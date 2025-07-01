//src/App.tsx
import { Routes, Route, Navigate} from "react-router-dom";
// Layouts
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileCompletionGuard from "./components/ProfileCompletionGuard";
//Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import NotificationsPage from "./pages/NotificationsPage";
import CommitteePage from "./pages/CommitteePage";
import RegisterStudentPage from "./pages/admin/RegisterStudentPage";
import UpdateStaffProfilePage from "./pages/admin/StaffProfilePage";
import CreateStaffPage from "./pages/admin/CreateStaffPage";
import StudentProfilePage from "./pages/student/StudentProfilePage";
import StudentDetailsPage from "./pages/admin/StudentDetailsPage";
import AllStudentsPage from "./pages/admin/AllStudentsPage";
import StaffDetailsPage from "./pages/public/StaffDetailsPage";

function App() {
  return(
      <Routes>
        {/* Public pages with the main navbar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/committee" element={<CommitteePage />} />
          <Route path="/staff/:userId/details" element={<StaffDetailsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<ProfileCompletionGuard />}> 
            <Route path="/dashboard" element={<DashboardPage />}/>
            <Route path="/admin/add-student" element={<RegisterStudentPage />}/>
            <Route path="/admin/add-staff" element={<CreateStaffPage />}/>
            <Route path="/admin/all-students" element={<AllStudentsPage />} />
            <Route path="/student/:studentProfileId" element={<StudentDetailsPage />} />
            <Route path="/student/:studentProfileId/actions" element={<StudentDetailsPage />} />
          </Route>
          <Route path="/staff/profile" element={<UpdateStaffProfilePage />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}

export default App;
