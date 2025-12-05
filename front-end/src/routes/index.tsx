import { Routes, Route, Navigate } from "react-router-dom";
import SpinPage from "../Pages/Users/SpinPage";
import InvalidPage from "../Pages/Users/InvalidPage";
import DemoForm from "../Pages/Users/DemoForm";
import AdminLogin from "../Pages/Admin/AdminLogin";
import AdminDashboard from "../Pages/Admin/AdminDashboard";
import DashboardHome from "../Pages/Admin/DashboardHome";
import UsersPage from "../Pages/Admin/UsersPage";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<DemoForm />} />
    <Route path="/spin" element={<SpinPage />} />
    <Route path="/invalid" element={<InvalidPage />} />

    {/* Admin Login (Public) */}
    <Route path="/admin/login" element={<AdminLogin />} />
    
    {/* Protected Admin Routes */}
    <Route  path="/admin"  element={ <ProtectedRoute>  <AdminDashboard /> </ProtectedRoute> }>
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="dashboard" element={<DashboardHome />} />
      <Route path="users" element={<UsersPage />} />
    </Route>
  </Routes>
);

export default AppRoutes;
