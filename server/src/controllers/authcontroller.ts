// server/src/controllers/authcontroller.ts
import { Request, Response } from 'express';
import { registerStaff } from '../services/authService';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// This function is correct. No changes needed.
export const handleLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required.' });
        return;
    }

    try {
        const user = await prisma.user.findUnique({ 
            where: { email }, 
            include: {staffProfile: true, studentProfile: true}  
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ message: 'Invalid credentials.' });
            return;
        }

        if (!user.isActive) {
            res.status(403).json({ message: 'This account has been deactivated.' });
            return;
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({ token, user: userWithoutPassword });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred during login.' });
    }
};
