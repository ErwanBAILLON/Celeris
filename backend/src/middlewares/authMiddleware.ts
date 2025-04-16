import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "secret";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
            };
        }
    }
}

// Mandatory authentication middleware
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        req.user = {
            userId: decoded.userId
        };
        next();

    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
    }
};

// Optional authentication middleware
export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
            req.user = {
                userId: decoded.userId
            };
        }
        next();

    } catch (error) {
        req.user = undefined; // Clear user if token is invalid
        next(); // No token provided, no user authenticated
    }
};

export const refreshTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.headers['x-refresh-token'] as string;

        if (!refreshToken) {
            res.status(401).json({ message: 'Refresh token required' });
            return;
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "refresh-secret") as { userId: number };
        req.user = {
            userId: decoded.userId
        };
        next();

    } catch (error) {
        console.error('Refresh token verification error:', error);
        res.status(401).json({ message: 'Invalid or expired refresh token' });
        return;
    }
}
