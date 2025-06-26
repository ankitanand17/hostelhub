// src/components/modals/DemoteStudentModal.tsx
import { useState } from 'react';
import type { FormEvent } from 'react';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

interface DemoteStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentUserId: string;
  studentName: string;
  currentRole: string;
  onDemotionSuccess: () => void;
}

const DemoteStudentModal = ({ isOpen, onClose, studentUserId, studentName, currentRole, onDemotionSuccess }: DemoteStudentModalProps) => {
    const {addToast} = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await api.post('/users/demote', {
                studentUserId,
            });
            addToast('Student demoted successfully.', 'success');
            onDemotionSuccess();
            onClose();
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Failed to demote student.';
            addToast(errorMsg,'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
                <h2 className="text-xl font-bold text-red-700">Confirm Demotion</h2>
                <p className="my-4 text-gray-600">
                    Are you sure you want to demote <span className="font-semibold">{studentName}</span> from the role of <span className="font-semibold">{currentRole}</span> back to a regular STUDENT?
                </p>
                <p className="text-sm text-gray-500">This action will revoke their administrative privileges.</p>
                
                <form onSubmit={handleSubmit} className="mt-6">
                    {error && <p className="mb-4 text-sm text-center text-red-500">{error}</p>}
                    
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-400">
                            {isSubmitting ? 'Demoting...' : 'Confirm Demotion'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DemoteStudentModal;