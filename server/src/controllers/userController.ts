// server/src/controllers/userController.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import prisma from '../lib/prisma';
import { Role, AdminSubRole, Prisma} from '../generated/prisma';
import bcrypt from 'bcryptjs';

// A map to validate that the sub-role corresponds to the main role
const roleToSubRoleMap: Record<string, AdminSubRole[]> = {
    HOSTEL_ADMIN: ['PREFECT', 'ASSISTANT_PREFECT'],
    MESS_ADMIN: ['MESS_MANAGER'],
};

/*Promotes a student to an admin role (HOSTEL_ADMIN or MESS_ADMIN).*/
export const promoteStudent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { studentUserId, newRole, adminSubRole } = req.body;

    if (!studentUserId || !newRole || !adminSubRole) {
        res.status(400).json({ message: 'studentUserId, newRole, and adminSubRole are required.' });
        return;
    }

    const validSubRoles = roleToSubRoleMap[newRole];
    if (!validSubRoles || !validSubRoles.includes(adminSubRole)) {
        res.status(400).json({ message: `Invalid sub-role '${adminSubRole}' for the role '${newRole}'.` });
        return;
    }
    
    try {
        const updatedUser = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const studentUser = await tx.user.findUnique({
                where: { id: studentUserId },
                select: { role: true }
            });

            if (!studentUser || studentUser.role !== 'STUDENT') {
                throw new Error('User is not a promotable student.');
            }

            const user = await tx.user.update({
                where: { id: studentUserId },
                data: { role: newRole as Role },
            });

            await tx.studentProfile.update({
                where: { userId: studentUserId },
                data: {
                    adminRoleAssignedAt: new Date(),
                    adminSubRole: adminSubRole as AdminSubRole,
                    adminRoleEndedAt: null,
                },
            });

            return user;
        });
        
        res.status(200).json({ message: `Student promoted to ${newRole} (${adminSubRole}) successfully.`, user: updatedUser });

    } catch (error: any) {
        if (error.message === 'User is not a promotable student.') {
            res.status(404).json({ message: 'The specified user is not a student or does not exist.' });
            return;
        }
        console.error(error);
        res.status(500).json({ message: 'An error occurred while promoting the student.' });
    }
};

/*Demotes a student admin back to a regular STUDENT.*/
export const demoteStudent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { studentUserId } = req.body;

    if (!studentUserId) {
        res.status(400).json({ message: 'studentUserId is required.' });
        return;
    }

    try {
        const updatedUser = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const studentUser = await tx.user.findUnique({
                where: { id: studentUserId },
                select: { role: true }
            });

            if (!studentUser || (studentUser.role !== 'HOSTEL_ADMIN' && studentUser.role !== 'MESS_ADMIN')) {
                throw new Error('User is not a demotable student admin.');
            }

            const user = await tx.user.update({
                where: { id: studentUserId },
                data: { role: 'STUDENT' },
            });

            await tx.studentProfile.update({
                where: { userId: studentUserId },
                data: {
                    adminRoleEndedAt: new Date(),
                    adminSubRole: null,
                },
            });

            return user;
        });
        
        res.status(200).json({ message: 'Student admin demoted to STUDENT successfully.', user: updatedUser });

    } catch (error: any) {
        if (error.message === 'User is not a demotable student admin.') {
            res.status(404).json({ message: 'The specified user is not a student admin or does not exist.' });
            return;
        }
        console.error(error);
        res.status(500).json({ message: 'An error occurred while demoting the student.' });
    }
};

/*Create a basic Student user account */
export const createStudentUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const {firstName, lastName, email, password} = req.body;

    if(!firstName || !lastName || !email || !password){
        res.status(400).json({message: 'firstName, lastName, email and a temporary password are required.'});
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = await prisma.user.create({
            data:{
                firstName,
                lastName,
                email,
                password:hashedPassword,
                role: 'STUDENT'
            },
        });

        const {password: _, ...userWithoutPassword} = newUser;
        res.status(201).json({message: 'Student user account create successfully.', user: userWithoutPassword});
    }catch(error: any){
        if(error.code === 'P2002'){
            res.status(409).json({message: 'A user with this email already exists.'});
            return;
        }
        console.error(error);
        res.status(500).json({message: 'An error occured while creating a student user.'});
    }
};