import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import WardenDashboard from '../components/dashboard/WardenDashboard';

// Placeholder for other roles
const StudentDashboard = () => <div><h3 className="text-2xl font-semibold">Student Actions</h3><p>Your dues, profile, etc.</p></div>;
const AdminDashboard = () => <div><h3 className="text-2xl font-semibold">Admin Actions</h3><p>Tasks assigned to you.</p></div>;

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderDashboardByRole = () => {
    switch (user?.role) {
      case 'WARDEN':
        return <WardenDashboard />;
      case 'HOSTEL_ADMIN':
      case 'MESS_ADMIN':
        return <AdminDashboard />;
      case 'STUDENT':
        return <StudentDashboard />;
      default:
        return <p>No specific dashboard for your role.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4 mx-auto max-w-7xl">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.firstName}!</p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600">
            Logout
          </button>
        </div>
      </header>
      <main className="p-8 mx-auto max-w-7xl">
        {renderDashboardByRole()}
      </main>
    </div>
  );
};

export default DashboardPage;