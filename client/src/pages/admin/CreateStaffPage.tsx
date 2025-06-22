//client/src/pages/admin/CreateStaffPage.tsx
import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const STAFF_ROLES = ['WARDEN', 'CARETAKER'] as const;

const CreateStaffPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: STAFF_ROLES[0]
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({
            firstName: '', lastName: '', email: '', password: '', role: STAFF_ROLES[0],
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await api.post('/users/create-staff', formData);
            setSuccess(`Staff account for ${formData.firstName} ${formData.lastName} created successfully!`);
            resetForm();
            setTimeout(() => {
                navigate('/dashboard')
            },1000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 mx-auto max-w-lg sm:p-6 lg:p-8">
            <div className="p-8 bg-white rounded-lg shadow-lg">
                <h1 className="mb-6 text-3xl font-bold text-gray-800">Create Staff Account</h1>
                <p className="mb-6 text-gray-600">This creates a basic user account. The new staff member will be prompted to complete their profile upon their first login.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                        <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black" />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Temporary Password</label>
                        <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black" />
                    </div>
                    
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Assign Role</label>
                        <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black">
                            {STAFF_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                    </div>

                    <div>
                        <button type="submit" disabled={isLoading} className="w-full px-4 py-3 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400">
                            {isLoading ? 'Creating Account...' : 'Create Staff Account'}
                        </button>
                        {success && <p className="mt-4 text-center text-green-600">{success}</p>}
                        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateStaffPage;