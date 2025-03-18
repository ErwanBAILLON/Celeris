import express from 'express';
import { User } from '../entities';
import { UserRepository } from '../repositories';
import { hashPassword, comparePasswords } from '../utils/hash';
import { generateToken, generateRefreshToken } from '../utils/jwt';
import { refreshTokenMiddleware } from '../middlewares/authMiddleware';

const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ error: 'Username and password are required' });
            return;
        }

        // Check if user already exists by username
        const existingUsernameUser = await UserRepository.findByUsername(username);
        if (existingUsernameUser) {
            res.status(400).json({ error: 'This username already exists' });
            return;
        }

        // Check if user already exists by email
        const existingEmailUser = await UserRepository.findByEmail(email);
        if (existingEmailUser) {
            res.status(400).json({ error: 'User with this email already exists' });
            return;
        }

        // Hash the password and create the new user
        const passwordHash = await hashPassword(password);
        const newUser = new User();
        newUser.username = username;
        newUser.email = email;
        newUser.passwordHash = passwordHash;
        newUser.createdAt = new Date();

        // Save the user in the database
        await UserRepository.create(newUser);

        // Generate tokens and send the successful response
        const token = generateToken(newUser.id);
        const refreshToken = generateRefreshToken(newUser.id);
        res.status(201).json({
            name: newUser.username,
            accessToken: token,
            refreshToken: refreshToken,
        });
        return;

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
});

authRouter.post('/login', async (req, res) => {
    // Handle user login
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required' });
        return;
    }
    // Check if user exists by username
    const existingUser = await UserRepository.findByUsername(username);
    if (!existingUser) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
    }
    // Check if password is correct
    const passCompResult = await comparePasswords(password, existingUser.passwordHash);
    if (!passCompResult) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
    }

    const token = generateToken(existingUser.id);
    const refreshToken = generateRefreshToken(existingUser.id);
    const response = {
        name: existingUser.username,
        accessToken: token,
        refreshToken: refreshToken,
    }
    res.status(200).json(response);
    return;
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

export default authRouter;
