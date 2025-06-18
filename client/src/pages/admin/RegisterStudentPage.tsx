//src/pages/admin/RegisterStudentPage.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import api from "../../services/api";

const RegisterStudentPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try{
            await api.post('/user/create-student', {
                firstName, lastName, email, password
            });
            setSuccess(`User account for ${firstName} ${lastName} create successfully!`);
            resetForm();
        }catch(err: any){
            setError(err.response?.data?.message || 'An error occured.');
        }finally{
            setIsLoading(false);
        }
    };

    return(
        <div className="p-4 mx-auto max-w-lg sm:p-6 lg:p-8">
            <div className="p-8 bg-white rounded-lg shadow-lg">
                <h1 className="mb-6 text-3xl font-bold text-gray-800">Create Student Account</h1>
                <p className="mb-6 text-gray-600">This will create a basic user account. The student will be prompted to complete their profile upon their first login.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required className="input-style" />
                    <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required className="input-style" />
                    <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required className="input-style" />
                    <input type="password" placeholder="Temporary Password" value={password} onChange={e => setPassword(e.target.value)} required className="input-style" />

                    <div>
                        <button type="submit" disabled={isLoading} className="w-full px-4 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400">
                            {isLoading ?  'Creating Account...' : 'Create Account'}
                        </button>
                        {success && <p className="mt-4 text-center text-green-600">{success}</p>}
                        [error && <p className="mt-4 text-center text-green-600">{error}</p>]
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterStudentPage;