// client/src/pages/CommitteePage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { CommitteeMember } from '../types';

// This is the component that needs fixing
const MemberCard = ({ member }: { member: CommitteeMember }) => {
    const isStaff = member.role === 'WARDEN' || member.role === 'CARETAKER';
    const name = `${member.firstName} ${member.lastName}`;

    // --- SOLUTION: Use the 'isStaff' type guard to separate the logic ---

    let photoUrl: string | null | undefined = null;
    let contact: string | null | undefined = null;
    let title: string | null | undefined = null;
    let detailLink = '#'; // Default to a non-link

    if (isStaff) {
        // TypeScript now knows that member.staffProfile is guaranteed to exist here
        const profile = member.staffProfile;
        photoUrl = profile?.profilePhotoUrl;
        contact = profile?.staffContactNumber;
        title = profile?.jobTitle;
        // The link is only for staff members, and we can now use the user ID
        detailLink = `/staff/${member.id}/details`;
    } else {
        // Here, TypeScript knows it's a student admin
        const profile = member.studentProfile;
        photoUrl = profile?.profilePhotoUrl;
        contact = profile?.studentContactNumber;
        title = profile?.adminSubRole;
    }
    
    // The content rendering is now separated from the logic
    const CardContent = () => (
      <>
        <img
          src={photoUrl || `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random`}
          alt={name}
          className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
        />
        <h3 className="text-lg font-bold text-gray-800">{name}</h3>
        <p className="font-semibold text-indigo-600">{title || member.role}</p>
        <p className="text-sm text-gray-500">{member.email}</p>
        {contact && <p className="text-sm text-gray-500 mt-1">Contact: {contact}</p>}
      </>
    );

    // Conditionally render a Link or a div based on the user type
    return isStaff ? (
      <Link to={detailLink} className="block text-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <CardContent />
      </Link>
    ) : (
      <div className="text-center p-4 bg-white rounded-lg shadow-md">
        <CardContent />
      </div>
    );
};


const CommitteePage = () => {
    const [members, setMembers] = useState<CommitteeMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/public/committee');
                setMembers(response.data);
            } catch (error) {
                console.error("Failed to fetch committee members:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMembers();
    }, []);

    const staff = members.filter(m => m.role === 'WARDEN' || m.role === 'CARETAKER');
    const admins = members.filter(m => m.role === 'HOSTEL_ADMIN' || m.role === 'MESS_ADMIN');

    if (isLoading) return <div className="p-8 text-center font-semibold">Loading Committee Members...</div>;

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold text-center mb-12">Hostel Committee</h1>

            {/* Staff Section */}
            <section>
                <h2 className="text-2xl font-bold border-b-2 border-indigo-500 pb-2 mb-6">Staff & Wardens</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {staff.map(member => <MemberCard key={member.id} member={member} />)}
                </div>
            </section>

            {/* Student Admins Section */}
            <section className="mt-12">
                <h2 className="text-2xl font-bold border-b-2 border-gray-400 pb-2 mb-6">Student Admins</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {admins.map(member => <MemberCard key={member.id} member={member} />)}
                </div>
            </section>
        </div>
    );
};

export default CommitteePage;