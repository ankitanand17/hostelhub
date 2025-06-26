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

export interface Action {
  id: string;
  actionType: string;
  reason: string;
  dateIssued: string;
  status: string;
  issuedBy: { 
    firstName: string, 
    lastName: string 
  };
}

export interface FullStudentProfile {
  id: string;
  rollNumber: string;
  roomNumber: string | null;
  currentSem: string;
  department: string;
  school: string;
  studentContactNumber: string;
  guardianName: string;
  guardianContact: string;
  cgpa: number | null;
  sgpa: number | null;
  courseStartDate: string;
  expectedCourseEndDate: string;
  profilePhotoUrl: string | null;
  user: {
    firstName: string;
    lastName:string;
    email: string;
    role: string;
  };
  disciplinaryActions: Action[];
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