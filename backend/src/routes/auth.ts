import express from 'express';
import { User } from '../entities';
import { UserRepository } from '../repositories';
import { hashPassword, comparePasswords } from '../utils/hash';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { authMiddleware, refreshTokenMiddleware } from '../middlewares/authMiddleware';

const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
    // Handle user registration
    const { username, email, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required' });
        return;
    }
    // Check if user already exists
    UserRepository.findByUsername(username).then( existingUser => {
        if (existingUser) {
            res.status(400).json({ error: 'This username already exists' });
            return;
        }
    }).catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Error while checking for existing user' });
        return;
    });

    UserRepository.findByEmail(email).then(existingUser => {
        if (existingUser) {
            res.status(400).json({ error: 'User with this email already exists' });
            return;
        }
    }).catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Error while checking for existing email' });
        return;
    });

    const passwordHash = await hashPassword(password);
    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.passwordHash = passwordHash;
    newUser.createdAt = new Date();
    UserRepository.create(newUser).then(() => {
        const token = generateToken(newUser.id);
        const refreshToken = generateRefreshToken(newUser.id);
        const response = {
            name: newUser.username,
            accessToken: token,
            refreshToken: refreshToken,
        }
        return;
    }).catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Error while saving the user in database' });
        return;
    });
});

authRouter.post('/login', async (req, res) => {
    // Handle user login
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required' });
        return;
    }
    UserRepository.findByUsername(username).then(user => {
        if (!user) {
            res.status(401).json({ error: 'Invalid username or password' });
            return;
        }
        // Check password
        comparePasswords(password, user.passwordHash).then(isMatch => {
            if (!isMatch) {
                res.status(401).json({ error: 'Invalid username or password' });
                return;
            }
        }).catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Error while comparing passwords' });
            return;
        });
        // Generate tokens
        const token = generateToken(user.id);
        const refreshToken = generateRefreshToken(user.id);
        const response = {
            name: user.username,
            accessToken: token,
            refreshToken: refreshToken,
        }
        res.status(200).json(response);
        return;
    }).catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Error while checking for existing user' });
        return;
    });
});

authRouter.get('/refresh', refreshTokenMiddleware, async (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const response = {
        accessToken: generateToken(req.user.userId),
        refreshToken: generateRefreshToken(req.user.userId),
    }
    res.status(200).json(response);
    return;
});
