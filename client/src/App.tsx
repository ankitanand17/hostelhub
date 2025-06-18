//src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
// Layouts
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
//Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import NotificationsPage from "./pages/NotificationsPage";
import CommitteePage from "./pages/CommitteePage";
import RegisterStudentPage from "./pages/admin/RegisterStudentPage";


function App() {
  return(
      <Routes>
        {/* Public pages with the main navbar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/committee" element={<CommitteePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />}/>
          <Route path="/add-student" element={<RegisterStudentPage />}/>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
  );
}

export default App;
