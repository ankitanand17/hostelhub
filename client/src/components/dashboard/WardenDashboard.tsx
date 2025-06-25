//src/components/dashboard/WardenDashboard.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import WardenProfileCard from "./WardenProfileCard";
import StudentList from "./StudentList";

const ActionCard = ({to, title, description, icon}: {to: string, title: string, description: string, icon: string}) => (
    <Link to={to} className="block p-6 transition-transform bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 hover:scale-105">
        <div className="flex items-center mb-4">
            <span className="p-3 mr-4 text-indigo-500 bg-indigo-100 rounded-full">{icon}</span>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        <p className="text-gray-600">{description}</p>
    </Link>
);

const WardenDashboard = () => {
    const {user} = useAuth();

    return(
        <div className="space-y-8">
            <WardenProfileCard user={user} />
            <div>
                <h3 className="mb-6 text-2xl font-semibold text-gray-700">Warden Action</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <ActionCard to="/admin/add-student"
                        title="Add New Student"
                        description="Create a user account for a new student"
                        icon="👤+"
                    />
                    <ActionCard to="/admin/add-staff"
                        title="Add new Warden or CareTaker"
                        description="Onboard a new Warden or Caretaker account."
                        icon="🧑‍🔧"
                    />
                    <ActionCard
                        to="/admin/all-students"
                        title="View All Students"
                        description="Search, view, and manage all student records."
                        icon="📚"
                    />
                </div>
            </div>
        </div>
        
    );
};

export default WardenDashboard;