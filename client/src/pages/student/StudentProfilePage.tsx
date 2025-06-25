//client/src/pages/student/StudentProfilePage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const SCHOOLS = [
    'SCHOOL_OF_ENGINEERING',
    'SCHOOL_OF_SCIENCE',
    'HUMANITIES_AND_SOCIAL_SCIENCES',
] as const;

const StudentProfilePage = () => {
    const navigate = useNavigate();
    const {user, checkStudentProfile} = useAuth();

    const [formData , setFormData] = useState({
        rollNumber: '',
        department: '',
        school: SCHOOLS[0],
        currentSem: '',
        roomNumber: '',
        sgpa: '',
        cgpa: '',
        studentContactNumber: '',
        guardianName: '',
        guardianContact: '',
        courseStartDate: '',
        expectedCourseEndDate: ''
    });
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if(!user) return;
            setIsLoading(true);
            try{
                const response = await api.get('/student/profile');
                if(response.data){
                    setFormData({
                        rollNumber: response.data.rollNumber || '',
                        department: response.data.department || '',
                        school: response.data.school || SCHOOLS[0],
                        currentSem: response.data.currentSem || '',
                        roomNumber: response.data.roomNumber || '',
                        sgpa: response.data.sgpa || '',
                        cgpa: response.data.cgpa || '',
                        studentContactNumber: response.data.studentContactNumber || '',
                        guardianName: response.data.guardianName || '',
                        guardianContact: response.data.guardianContact || '',
                        courseStartDate: response.data.courseStartDate?.split('T')[0] || '',
                        expectedCourseEndDate: response.data.expectedCourseEndDate?.split('T')[0] || '',
                    });
                    if(response.data.profilePhotoUrl){
                        setImagePreview(response.data.profilePhotoUrl);
                    }
                }
            }catch(err){
                console.log("No exixting Profile found, user can create one.");
            }finally{
                setIsLoading(false);
            }
        };
        fetchProfile();
    },[user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement |HTMLTextAreaElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]){
            const file = e.target.files[0];
            setProfilePhoto(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        const data = new FormData();
        Object.entries(formData).forEach(([Key, value]) => {
            data.append(Key, value);
        });
        if(profilePhoto){
            data.append('profilePhoto', profilePhoto);
        }

        try{
            await api.post('/student/profile',data);
            setSuccess('Profile updated successfully!');
            await checkStudentProfile();
            setTimeout(() => {
                navigate('/dashboard')
            },1000)
        }catch(err: any){
            setError(err.response?.data?.message || 'An error occured.');
        }finally{
            setIsSubmitting(false);
        }
    };

    if(isLoading){
        return <div className="text-center p-8 font-semibold">Loading Your Profile....</div>
    }

    return(
        <div className="p-4 mx-auto max-w-4xl sm:p-6 lg:p-8">
            <div className="p-8 bg-white rounded-lg shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Complete Your Profile</h1>
                    <p className="mt-2 text-gray-600">Welcome, {user?.firstName}! Please provide your details to continue.</p>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Photo Upload */}
                    <div className="md:col-span-2 flex flex-col items-center">
                        <img src={imagePreview || 'https://via.placeholder.com/128?text=Photo'} alt="Profile Preview" className="w-32 h-32 rounded-full object-cover mb-4 bg-gray-200 border-2" />
                        <label htmlFor="profilePhoto" className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-800 rounded-md border hover:bg-gray-200 transition-colors">
                            Upload Photo
                        </label>
                        <input id="profilePhoto" name="profilePhoto" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </div>

                    {/* Form Fields */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                        <input name="rollNumber" placeholder="Roll Number" value={formData.rollNumber} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Room Number</label>
                        <input name="roomNumber" placeholder="Room Number" value={formData.roomNumber} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">School</label>
                        <select name="school" value={formData.school} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black md:col-span-2">
                            {SCHOOLS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <input name="department" placeholder="Department (e.g., Computer Science)" value={formData.department} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Current Semester</label>
                        <input name="currentSem" placeholder="Semester" value={formData.currentSem} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">SGPA</label>
                        <input 
                        name="sgpa" 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        max="10" 
                        placeholder="Last Semester's SGPA (optional)" 
                        value={formData.sgpa} 
                        onChange={handleChange} 
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black" 
                    />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">CGPA</label>
                        <input 
                        name="cgpa" 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        max="10" 
                        placeholder="Current CGPA (optional)" 
                        value={formData.cgpa} 
                        onChange={handleChange} 
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black" 
                    />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                        <input name="studentContactNumber" placeholder="Your Contact Number" value={formData.studentContactNumber} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Guardian Name</label>
                        <input name="guardianName" placeholder="Guardian's Name" value={formData.guardianName} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Guardian's Contact</label>
                        <input name="guardianContact" placeholder="Guardian's Contact" value={formData.guardianContact} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Course Start Date</label>
                        <input name="courseStartDate" type="date" value={formData.courseStartDate} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Expected End Date</label>
                        <input name="expectedCourseEndDate" type="date" value={formData.expectedCourseEndDate} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black" />
                    </div>

                    {/* Submit Button & Messages */}
                    <div className="md:col-span-2">
                        <button type="submit" disabled={isSubmitting} className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                            {isSubmitting ? 'Saving...' : 'Save Profile'}
                        </button>
                        {success && <p className="mt-4 text-center text-green-600">{success}</p>}
                        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentProfilePage;