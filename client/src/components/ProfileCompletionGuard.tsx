//client/src/components/ProfileCompletionGuard.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProfileCompletionGuard = () => {
    const {user, staffProfileExists, studentProfileExists} = useAuth();
    const location = useLocation();

    const isStaff = user?.role === 'WARDEN' || user?.role === 'CARETAKER';
    const isStudent = user?.role === 'STUDENT' || user?.role === 'HOSTEL_ADMIN' || user?.role === 'MESS_ADMIN';
  
    if(isStaff && !staffProfileExists && location.pathname !== '/staff/profile'){
        return <Navigate to="staff/profile" replace />
    }

    if (isStudent && !studentProfileExists && location.pathname !== '/student/profile') {
        return <Navigate to="/student/profile" replace />;
    }
    return <Outlet />
};

export default ProfileCompletionGuard;