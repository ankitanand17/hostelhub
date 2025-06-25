export interface StaffProfile {
  id: string;
  staffContactNumber: string;
  department: string;
  jobTitle: string;
  officeLocation?: string | null;
  description?: string | null;
  profilePhotoUrl?: string | null;
}

export interface StudentProfile {
    id: string;
    rollNumber: string;
    roomNumber?: string | null;
    _count?: { disciplinaryActions: number };
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'STUDENT' | 'WARDEN' | 'CARETAKER' | 'HOSTEL_ADMIN' | 'MESS_ADMIN';
    isActive: boolean;
    
    staffProfile?: StaffProfile | null;
    studentProfile?: StudentProfile | null;
}