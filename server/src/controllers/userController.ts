// server/src/controllers/userController.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import prisma from '../lib/prisma';
import { Role, AdminSubRole, Prisma} from '../generated/prisma';
import bcrypt from 'bcryptjs';
import { profile } from 'console';

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
                role: Role.STUDENT,
                isActive: true,
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

/*Gets the staff profile for the currently logged-in user.*/
export const getMyStaffProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if(!userId){
        res.status(401).json({message: "Authentication error."});
        return;
    }

    try{
        const staffProfile = await prisma.staffProfile.findUnique({
            where: { userId },
        });

        if(!staffProfile){
            res.status(404).json({message: "Staff Profile not found. Please complete your profile."});
            return;
        }
        res.status(200).json(staffProfile);
    }catch(error){
        console.error("Error fetching staff Profile", error);
        res.status(500).json({message: "Internal server error"});
    }
};

/*Create and Update staff Profile */
export const createOrUpdateMyStaffProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if(!userId){
        res.status(401).json({message: "Authenticate Error"});
        return;
    }
    const {staffContactNumber, department, jobTitle, officeLocation, description} = req.body;

    if ( !staffContactNumber || !department || !jobTitle || !officeLocation){
        res.status(400).json({message: "Contact Number, department, jobtitle and office Location are required"});
        return;
    }

    let profilePhotoUrl : string | undefined = undefined;
    if(req.file){
        const filePath = req.file.path.replace(/\\/g, '/');
        profilePhotoUrl = `${req.protocol}: //${req.get('host')}/${filePath}`;
    }
    
    try{
        const dataToUpsert = {
            staffContactNumber, 
            department, 
            jobTitle, 
            officeLocation, 
            description,
            ...(profilePhotoUrl && {profilePhotoUrl})
        };

        const staffProfile = await prisma.staffProfile.upsert({
            where: {userId},
            update: dataToUpsert,
            create: {userId, ...dataToUpsert }
        });
        res.status(200).json({message: "Profile Updateed successfully", profile: staffProfile});
    }catch(error){
        console.error("Error updating staff profile:",error);
        res.status(500).json({message: "An error occur while updating staff profile."});
    }
};

/*Create a basic Warden or Caretaker user account */
export const createStaffUser = async(req: AuthenticatedRequest, res: Response): Promise<void> => {
    const {firstName, lastName, email, password, role} = req.body;

    if(!firstName || !lastName || !email || !password){
        res.status(400).json({message: 'firstName, lastName, email and a temporary password are required.'});
        return;
    }
    
    if (role !== 'WARDEN' && role !== 'CARETAKER') {
        res.status(400).json({ message: 'Invalid role specified. Must be WARDEN or CARETAKER.' });
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
                role: role as Role,
                isActive: true,
            },
        });

        const {password: _, ...userWithoutPassword} = newUser;
        res.status(201).json({message: 'Staff user account created successfully.', user: userWithoutPassword});
    }catch(error: any){
        if(error.code === 'P2002'){
            res.status(409).json({message: 'A user with this email already exists.'});
            return;
        }
        console.error(error);
        res.status(500).json({message: 'An error occurred while creating the staff user.'});
    }
};

/*Get the student profile for the currently logged-in user */
export const getMyStudentProfile = async(req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if(!userId){
        res.status(401).json({message: "Authenticate Error"});
        return;
    }
    try{
        const studentProfile = await prisma.studentProfile.findUnique({
            where: {userId}
        });

        if(!studentProfile){
            res.status(404).json({message: "Student Profile not found"});
            return;
        }

        res.status(200).json(studentProfile);
    }catch(error){
        res.status(500).json({message: "Internal server error!!"});
    }
};

/*Create and Update student profile */
export const createOrUpdateMyStudentProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if(!userId){
        res.status(404).json({message: "Authentication Error."});
        return;
    }

    const {rollNumber, roomNumber, currentSem, sgpa, cgpa, department, school, studentContactNumber, guardianName, guardianContact, courseStartDate, expectedCourseEndDate} = req.body;

    if(!rollNumber || !department || !school || !studentContactNumber || !guardianContact || !guardianName || !courseStartDate || ! expectedCourseEndDate){
        res.status(400).json({message: "All fields are required."});
        return;
    }

    let profilePhotoUrl : string | undefined = undefined;
    if(req.file){
        const filePath = req.file.path.replace(/\\/g, '/');
        profilePhotoUrl = `${req.protocol}://${req.get('host')}/${filePath}`;
    }

    try{
        const dataToUpsert = {rollNumber, roomNumber,currentSem, department, school, studentContactNumber, guardianName, guardianContact,
            cgpa: cgpa ? +cgpa : null,
            sgpa: sgpa ? +sgpa : null, 
            courseStartDate: new Date(courseStartDate),
            expectedCourseEndDate: new Date(expectedCourseEndDate),
            ...(profilePhotoUrl && {profilePhotoUrl})
        };

        const studentProfile = await prisma.studentProfile.upsert({
            where: {userId},
            update: dataToUpsert,
            create: {userId, ...dataToUpsert}
        });
        res.status(200).json({message: "Profile Update successfully.", profile: studentProfile});
    }catch(error){
        console.error("Error Updating student profile:",error);
        res.status(500).json({message: "An error occurred while updating the profile."});
    }
};