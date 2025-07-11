// client/src/pages/admin/StudentDetailsPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import AddActionModal from '../../components/modals/AddActionModal';
import EditActionModal from '../../components/modals/EditActionModal';
import type { Action, FullStudentProfile } from '../../types';


const ActionCard = ({ action, onClick }: { action: Action, onClick: () => void }) => (
    <button onClick={onClick} className={`w-full text-left p-4 rounded-lg border transition-colors ${action.status === 'ACTIVE' ? 'border-red-300 bg-red-50 hover:bg-red-100' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
        <div className={`p-4 rounded-lg border ${action.status === 'ACTIVE' ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}`}>
        <div className="flex justify-between items-center"><span className={`px-2 py-1 text-xs font-bold rounded-full ${action.status === 'ACTIVE' ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-800'}`}>{action.status}</span><span className="bg-gray-200 text-gray-800">{action.actionType}</span></div>
        <p className="mt-2 text-gray-700">{action.reason}</p>
        <p className="mt-4 text-xs text-gray-500">Issued by {action.issuedBy.firstName} on {new Date(action.dateIssued).toLocaleDateString()}</p>
    </div>
    </button>
);

const InfoItem = ({ label, value }: { label: string, value: string | number | null | undefined }) => (
    <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-lg font-semibold text-gray-800">{value || 'N/A'}</p>
    </div>
);


const StudentDetailsPage = () => {
    const { studentProfileId } = useParams<{ studentProfileId: string }>(); 
    const [profile, setProfile] = useState<FullStudentProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState<Action | null>(null);

    const fetchStudentDetails = async () => {
        if (!studentProfileId) return;
        setIsLoading(true);
        try {
            const response = await api.get(`/staff/${studentProfileId}/details`);
            setProfile(response.data);
        } catch (error) {
            console.error("Failed to fetch student details", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentDetails();
    }, [studentProfileId]);

    const handleEditActionClick = (action: Action) => {
        setSelectedAction(action);
        setIsEditModalOpen(true);
    };

    if (isLoading) return <div className="p-8 text-center font-semibold">Loading Student Details...</div>;
    if (!profile) return <div className="p-8 text-center font-semibold text-red-500">Student not found.</div>;

    const { user, disciplinaryActions, adminSubRole, adminRoleAssignedAt, adminRoleEndedAt } = profile;

    const hasAdminHistory = !!adminRoleAssignedAt;

    return (
        <>
            <div className="p-4 mx-auto max-w-7xl sm:p-6 lg:p-8">
                <Link to="/admin/students" className="mb-6 inline-block text-indigo-600 hover:underline">← Back to All Students</Link>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="p-6 bg-white rounded-lg shadow-lg">
                            <div className="flex flex-col items-center">
                                <img src={profile.profilePhotoUrl || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200" />
                                <h1 className="mt-4 text-3xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
                                <p className="text-indigo-600">{user.email}</p>
                                <p className="text-gray-500">{user.role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details & Actions */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Academic and Contact Details */}
                        <div className="p-6 bg-white rounded-lg shadow-lg">
                            <h2 className="mt-4 text-3xl font-bold text-gray-400">Profile Information</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                <InfoItem label="Roll Number" value={profile.rollNumber} />
                                <InfoItem label="Room Number" value={profile.roomNumber} />
                                <InfoItem label="Current Semester" value={profile.currentSem} />
                                <InfoItem label="Contact" value={profile.studentContactNumber} />
                                <InfoItem label="Department" value={profile.department} />
                                <InfoItem label="School" value={profile.school.replace(/_/g, ' ')} />
                                <InfoItem label="CGPA / SGPA" value={`${profile.cgpa || 'N/A'} / ${profile.sgpa || 'N/A'}`} />
                                <InfoItem label="Course Starting Date" value={profile.courseStartDate} />
                                <InfoItem label="Expected Course End" value={profile.expectedCourseEndDate} />
                            </div>
                        </div>
                        {/* Guardian Details*/}
                        <div className='p-6 bg-white rounded-lg shadow-lg'>
                            <h2 className='mt-4 text-3xl font-bold text-gray-400'>Guardian Details</h2>
                            <div className='grid grid-cols-2 sm:grid-cols-3 gap-6'>
                                <InfoItem label='Guardian Name' value={profile.guardianName} />
                                <InfoItem label='Guardian Contact' value={profile.guardianContact} />
                            </div>
                        </div>
                        {/* --- NEW ADMINISTRATIVE ROLE CARD --- */}
                        {hasAdminHistory && (
                            <div className="p-6 bg-white rounded-lg shadow-lg">
                                <h2 className="mt-4 text-3xl font-bold text-gray-400">Administrative Role</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <InfoItem label="Title" value={adminSubRole} />
                                    <InfoItem label="Assigned On" value={adminRoleAssignedAt ? new Date(adminRoleAssignedAt).toLocaleDateString() : 'N/A'} />
                                    {adminRoleEndedAt ? (
                                        <InfoItem label="Tenure Ended On" value={new Date(adminRoleEndedAt).toLocaleDateString()} />
                                    ) : (
                                        <div>
                                          <p className="text-sm font-medium text-gray-500">Status</p>
                                          <span className="px-2 py-1 mt-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                              Active
                                          </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {/* Disciplinary History */}
                        <div className="p-6 bg-white rounded-lg shadow-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="mt-4 text-3xl font-bold text-gray-400">Disciplinary History</h2>
                                <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">
                                    Add Action
                                </button>
                            </div>
                            <div className="space-y-4">
                                {disciplinaryActions.length > 0 ? (
                                    disciplinaryActions.map(action => <ActionCard key={action.id} action={action} onClick={() => handleEditActionClick(action)} />)
                                ) : (
                                    <p className="text-gray-500">No disciplinary actions on record.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddActionModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                studentProfileId={profile.id}
                onActionAdded={fetchStudentDetails}
            />
            <EditActionModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                action={selectedAction}
                onActionUpdated={fetchStudentDetails}
            />
        </>
    );
};

export default StudentDetailsPage;