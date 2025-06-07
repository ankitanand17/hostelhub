// server/src/services/authService.ts
import prisma from '../lib/prisma';
import { User, StudentProfile, StaffProfile, School, Role, Prisma } from '../generated/prisma';
import bcrypt from 'bcryptjs';

// --- STUDENT REGISTRATION ---
/*Defines the data structure for a new student registration.*/
type StudentRegistrationData = Omit<StudentProfile, 
    'id' | 'userId' | 'createdAt' | 'updatedAt' | 'isActive' | 
    'adminSubRole' | 'adminRoleAssignedAt' | 'adminRoleEndedAt'
> & {
    email: User['email'];
    password: User['password'];
    firstName: User['firstName'];
    lastName: User['lastName'];
};

/*** Handles the logic for registering a new student.*/
export const registerStudent = async (data: StudentRegistrationData) => {
    const { 
        email, password, firstName, lastName, rollNumber, department, 
        school, studentContactNumber, guardianName, guardianContact,
        courseStartDate, expectedCourseEndDate, cgpa, sgpa
    } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const user = await tx.user.create({
            data: {
                firstName, lastName, email,
                password: hashedPassword,
                role: 'STUDENT',
            },
        });

        await tx.studentProfile.create({
            data: {
                userId: user.id,
                rollNumber, department, school, studentContactNumber, 
                guardianName, guardianContact,
                courseStartDate: new Date(courseStartDate),
                expectedCourseEndDate: new Date(expectedCourseEndDate),
                cgpa, sgpa,
            },
        });
        return user;
    });
    return newUser;
};


// --- STAFF REGISTRATION (NEW) ---
/*Defines the data structure for a new staff registration.*/
type StaffRegistrationData = Omit<StaffProfile, 
    'id' | 'userId' | 'createdAt' | 'updatedAt' | 'isActive' | 'startDate' | 'endDate'
> & {
    email: User['email'];
    password: User['password'];
    firstName: User['firstName'];
    lastName: User['lastName'];
    role: Role;
};

/*Handles the logic for registering a new staff member (Warden or Caretaker).*/
export const registerStaff = async (data: StaffRegistrationData) => {
    const {
        email, password, firstName, lastName, role,
        staffContactNumber, department, jobTitle, description, officeLocation
    } = data;

    if (role !== 'WARDEN' && role !== 'CARETAKER') {
        throw new Error('Invalid role for staff registration. Must be WARDEN or CARETAKER.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Use a transaction to create the User and StaffProfile
    const newStaffUser = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Step 1: Create the core User record
        const user = await tx.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: role,
            },
        });

        // Step 2: Create the associated StaffProfile record
        await tx.staffProfile.create({
            data: {
                userId: user.id,
                staffContactNumber,
                department,
                jobTitle,
                description,
                officeLocation,
            },
        });

        return user;
    });

    return newStaffUser;
};