// server/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Role } from '../generated/prisma';

interface CustomJwtPayload extends JwtPayload {
    userId: string;
    role: Role;
}

export interface AuthenticatedRequest extends Request {
    user?: CustomJwtPayload;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Access denied. No token provided.' });
        return;
    }

    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined in .env file');
        res.status(500).json({ message: 'Internal server error: JWT secret not configured.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as CustomJwtPayload;

        req.user = decoded;
        next();

    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Unauthorized: Token has expired.' });
            return;
        }
        res.status(403).json({ message: 'Forbidden: Invalid token.' });
        return;
    }
};

export const authorizeRole = (allowedRoles: Role[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action.' });
            return;
        }
        next();
    };
};