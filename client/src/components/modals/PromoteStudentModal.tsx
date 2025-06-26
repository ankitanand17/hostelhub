//client/src/components/modals/PromoteStudentModal.tsx
import { useState } from 'react';
import type { FormEvent } from 'react';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const PROMOTION_ROLES = ['HOSTEL_ADMIN', 'MESS_ADMIN'] as const;
const ADMIN_SUB_ROLES = {
    HOSTEL_ADMIN: ['PREFECT', 'ASSISTANT_PREFECT'],
    MESS_ADMIN: ['MESS_MANAGER']
} as const;

type PromotionRole = typeof PROMOTION_ROLES[number];
type AdminSubRole = typeof ADMIN_SUB_ROLES[PromotionRole][number];

interface PromoteStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentUserId: string;
  studentName: string;
  onPromotionSuccess: () => void;
}

const PromoteStudentModal = ({ isOpen, onClose, studentUserId, studentName, onPromotionSuccess }: PromoteStudentModalProps) => {
    const {addToast} = useToast();
    const [newRole, setNewRole] = useState<PromotionRole>(PROMOTION_ROLES[0]);
    const [adminSubRole, setAdminSubRole] = useState<AdminSubRole>(ADMIN_SUB_ROLES['HOSTEL_ADMIN'][0]);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRole = e.target.value as PromotionRole;
        setNewRole(selectedRole);
        setAdminSubRole(ADMIN_SUB_ROLES[selectedRole][0]);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await api.post('/users/promote', {
                studentUserId,
                newRole,
                adminSubRole,
            });
            addToast('Student promoted successfully!', 'success');
            onPromotionSuccess();
            onClose();
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Failed to promote student.';
            addToast(errorMsg, 'error');
            setError(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
                <h2 className="text-xl font-bold text-gray-800">Promote Student</h2>
                <p className="mb-4 text-gray-600">Assign an admin role to <span className="font-semibold">{studentName}</span>.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="newRole" className="block text-sm font-medium text-gray-700">New Primary Role</label>
                        <select id="newRole" value={newRole} onChange={handleRoleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black">
                            {PROMOTION_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="adminSubRole" className="block text-sm font-medium text-gray-700">Specific Title</label>
                        <select id="adminSubRole" value={adminSubRole} onChange={(e) => setAdminSubRole(e.target.value as AdminSubRole)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black">
                            {(ADMIN_SUB_ROLES[newRole] as readonly string[]).map(subRole => <option key={subRole} value={subRole}>{subRole}</option>)}
                        </select>
                    </div>
                    
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    
                    <div className="flex justify-end pt-4 space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400">
                            {isSubmitting ? 'Promoting...' : 'Confirm Promotion'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PromoteStudentModal;