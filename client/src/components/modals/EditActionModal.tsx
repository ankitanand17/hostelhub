//client/src/components/modals/EditActionModal.tsx
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import api from "../../services/api";
import type { Action } from "../../types";

const ACTION_STATUSES = ['ACTIVE', 'RESOLVED', 'APPEALED'] as const;
type ActionStatus = typeof ACTION_STATUSES[number];

interface EditActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: Action | null;
  onActionUpdated: () => void;
}

const EditActionModal = ({ isOpen, onClose, action, onActionUpdated }: EditActionModalProps) => {
    const [reason, setReason] = useState('');
    const [status, setStatus] = useState<ActionStatus>('ACTIVE');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (action) {
            setReason(action.reason);
            setStatus(action.status as ActionStatus);
        }
    }, [action]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!action) return;
        setIsSubmitting(true);
        setError(null);

        try {
            await api.patch(`/staff/action/${action.id}`, { reason, status });
            onActionUpdated();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update action.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if(!isOpen || !action) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Disciplinary Action</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason</label>
                        <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} required className="w-full h-24 px-3 py-2 mt-1 border rounded-md text-black" />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                        <select id="status" value={status} onChange={(e) => setStatus(e.target.value as ActionStatus)} className="w-full px-3 py-2 mt-1 border rounded-md text-black">
                            {ACTION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    
                    <div className="flex justify-end pt-4 space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                            {isSubmitting ? 'Updating...' : 'Update Action'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditActionModal;