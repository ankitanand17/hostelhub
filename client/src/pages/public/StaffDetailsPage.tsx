//client/src/pages/public/StaffDetailsPage.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

interface FullStaffProfile {
    id: string;
    staffContactNumber: string;
    department: string;
    jobTitle: string;
    officeLocation: string | null;
    description: string | null;
    profilePhotoUrl: string | null;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

const StaffDetailsPage = () => {
    const { userId } = useParams<{ userId: string }>(); // Use the USER ID
    const [profile, setProfile] = useState<FullStaffProfile | null>(null);

    useEffect(() => {
        if (!userId) return;
        const fetchDetails = async () => {
            // We need a new backend endpoint to fetch a staff member's full public profile
            // For now, let's assume we have it at '/public/staff/:userId'
            const response = await api.get(`/public/staff/${userId}`);
            setProfile(response.data);
            console.log("Fetching full details for staff user ID:", userId);
        };
        fetchDetails();
    }, [userId]);

    // For now, we'll just display a placeholder
    return <div className="p-8">Details for staff member {userId} will be shown here.</div>;
};

export default StaffDetailsPage;