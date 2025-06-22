//client/src/components/ProfileCompletionGuard.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProfileCompletionGuard = () => {
    const {user, staffProfileExists} = useAuth();
    const location = useLocation();

    const isStaff = user?.role === 'WARDEN' || user?.role === 'CARETAKER';

    if(isStaff && !staffProfileExists && location.pathname !== '/staff/profile'){
        return <Navigate to="staff/profile" replace />
    }

    return <Outlet />
};

export default ProfileCompletionGuard;