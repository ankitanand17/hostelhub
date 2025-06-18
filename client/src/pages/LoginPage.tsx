//src/pages/LoginPage.tsx
import { useState} from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import type { User } from "../types";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {login} = useAuth();
    const navigate = useNavigate();
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        try{
            const response = await api.post<{ user: User; token: string; }>('/auth/login', {
                email,
                password,
            });
            login(response.data.user, response.data.token);
            navigate('/');
        }catch(err: any){
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold text-center text-gray-800">HostelHub Login</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                        required className="w-full px-3 py-2 mt-1 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-red-500" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">password</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
                        required className="w-full px-3 py-2 mt-1 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-red-500" />
                    </div>
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;