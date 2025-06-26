import { useState } from 'react';
import type { FormEvent } from 'react';
import api from '../../services/api';

const ACTION_TYPES = ['WARNING', 'FINE', 'SUSPENSION', 'EXPULSION'] as const;
type ActionType = typeof ACTION_TYPES[number];

interface AddActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentProfileId: string;
  onActionAdded: () => void;
}

const AddActionModal = ({ isOpen, onClose, studentProfileId, onActionAdded }: AddActionModalProps) => {
    const [actionType, setActionType] = useState<ActionType>(ACTION_TYPES[0]);
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await api.post('/staff/action', {
                studentProfileId,
                actionType,
                reason,
            });
            onActionAdded(); // Tell the parent component we're done
            onClose();       // Close the modal
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add action.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        // Modal Overlay
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Add Disciplinary Action</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">×</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="actionType" className="block text-sm font-medium text-gray-700">Action Type</label>
                        <select id="actionType" value={actionType} onChange={(e) => setActionType(e.target.value as ActionType)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black">
                            {ACTION_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason</label>
                        <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} required placeholder="Describe the incident and reason for action..." className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black h-32" />
                    </div>
                    
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-400">
                            {isSubmitting ? 'Adding...' : 'Add Action'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddActionModal;