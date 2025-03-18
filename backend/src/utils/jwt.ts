import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION ? parseInt(process.env.JWT_EXPIRATION) : 3600;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh-secret";
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION ? parseInt(process.env.REFRESH_TOKEN_EXPIRATION) : 604800; // 7 jours

export const generateToken = (userId: number): string => {
    const expiration = Math.max(JWT_EXPIRATION, 86400);
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: expiration });
};

export const verifyToken = (token: string): { userId: number } | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        return decoded;
    } catch (error) {
        return null;
    }
};

export const generateRefreshToken = (userId: number): string => {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
};

export const verifyRefreshToken = (token: string): { userId: number } | null => {
    try {
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: number };
        return decoded;
    } catch (error) {
        return null;
    }
};
