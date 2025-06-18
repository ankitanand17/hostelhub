export interface User {
    id: string;
    firstName: string;
    lastname: string;
    email: string;
    role: 'STUDENT' | 'WARDEN' | 'CARETAKER' | 'HOSTEL_ADMIN' | 'MESS_ADMIN';
    isActive: boolean;
}