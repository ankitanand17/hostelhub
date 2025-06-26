//client/src/pages/admin/StaffProfilePage.tsx
import React, { useState, useEffect, } from "react";
import type { FormEvent } from "react";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const UpdateStaffProfilePage = () => {
    const navigate = useNavigate();
    const {user, checkStaffProfile} = useAuth();

    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        staffContactNumber: '',
        department: '',
        jobTitle: '',
        officeLocation: '',
        description: ''
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] =useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if(!user) return;
            setIsLoading(true);
            try{
                const response = await api.get('/staff/profile');
                if(response.data){
                    setFormData({
                        staffContactNumber: response.data.staffContactNumber || '',
                        department: response.data.department || '',
                        jobTitle: response.data.jobTitle || '',
                        officeLocation: response.data.officeLocation || '',
                        description: response.data.description || ''
                    });
                    if(response.data.profilePhotoUrl){
                        setImagePreview(response.data.profilePhotoUrl);
                    }
                }
                setTimeout(() => {
                    navigate('/dashboard',)
                },1000)
            }catch(err: any){
                console.log("No existing profile found, user can create one.");
            }finally{
                setIsLoading(false);
            }
        };
        fetchProfile();
    },[user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]){
            const file = e.target.files[0];
            setProfilePhoto(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({...formData,[e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        if (profilePhoto) {
            data.append('profilePhoto', profilePhoto);
        }

        try{
            await api.post('/staff/profile', data);
            setSuccess('Profile updated successfully!');
            await checkStaffProfile();
        }catch(err: any){
            setError(err.response?.data?.message || 'An error occured.');
        }finally{
            setIsSubmitting(false);
        }
    }

    if(isLoading){
        return <div className="p-8 text-center">Loading Profile....</div>
    }

    return(
        <div className="p-4 mx-auto max-w-2xl sm:p-6 lg:p-8">
            <div className="p-8 bg-white rounded-lg shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Complete Your Profile</h1>
                    <p className="mt-2 text-gray-600">Welcome, {user?.firstName}! Please provide your details to continue.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Profile Preview" className="w-32 h-32 rounded-full object-cover mb-4" />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4 text-gray-500">No Image</div>
                        )}
                        <label htmlFor="profilePhoto" className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-800 rounded-md border hover:bg-gray-200">
                            Change Photo
                        </label>
                        <input id="profilePhoto" name="profilePhoto" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </div>
                    <div>
                        <label htmlFor="staffContactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
                        <input name="staffContactNumber" type="text" placeholder="Contact Number" value={formData.staffContactNumber} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black" />
                    </div>
                    <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                        <input name="department" type="text" placeholder="Department" value={formData.department} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black" />
                    </div>
                    <div>
                        <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title</label>
                        <input name="jobTitle" type="text" placeholder="Job Title (Professor)" value={formData.jobTitle} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black" />
                    </div>
                    <div>
                        <label htmlFor="officeLocation" className="block text-sm font-medium text-gray-700">Office At</label>
                        <input name="officeLocation" type="text" placeholder="Office Location" value={formData.officeLocation} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" placeholder="A brief description (optional)" value={formData.description} onChange={handleChange} required className="w-full h-24 px-3 py-2 mt-1 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black" />
                    </div>
                    <div>
                        <button type="submit" disabled={isSubmitting} className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                            {isSubmitting ? 'Saving...' : 'Save Profile' }
                        </button>
                        {success && <p className="mt-4 text-center text-green-600">{success}</p>}
                        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
                    </div>
                </form>
            </div>
        </div>
    )
};

export default UpdateStaffProfilePage;