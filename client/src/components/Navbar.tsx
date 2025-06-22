//src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { User } from "../types";

const getInitials = (user: User | null) => {
    if(!user) return '';
    const firstNameInitials = user.firstName ? user.firstName[0] : '';
    const lastNameInitials = user.lastName ? user.lastName[0] : '';
    return `${firstNameInitials}${lastNameInitials}`.toUpperCase();
};

const Navbar = () => {
    const {user} = useAuth();
    const navigate = useNavigate();

    return(
        <header className="sticky top-0 z-50 bg-white shadow-md">
            <nav className="container flex items-center justify-between px-6 py-4 mx-auto">
                <div className="flex items-center space-x-8">
                    <Link to='/' className="text-2xl font-bold text-indigo-600">
                        HostelHub
                    </Link>
                    <div className="hidden space-x-6 md:flex">
                        <Link to='/committee' className="font-semibold text-gray-600 hover:text-indigo-600">committee</Link>
                        <Link to='/notifications' className="font-semibold text-gray-600 hover:text-indigo-600">Notifications</Link>
                    </div>
                </div>

                <div>
                    {user? (
                        <button onClick={() => navigate('/dashboard')}
                            className="flex items-center justify-center w-10 h-10 font-bold text-white bg-indigo-500 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
                            aria-label="Go to Dashboard">
                            {user.staffProfile?.profilePhotoUrl ? (
                                <img 
                                    src={user.staffProfile.profilePhotoUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                              getInitials(user)  
                            )}
                        </button>
                    ) : (
                        <Link to='/login' className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                            Login
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;