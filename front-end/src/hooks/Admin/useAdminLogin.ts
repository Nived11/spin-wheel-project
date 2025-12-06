import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import { extractErrorMessages } from "../../utils/extractErrorMessages";
import toast from "react-hot-toast";

export const useAdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const role = localStorage.getItem("adminRole");
    if (token && role) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/admin/login", { username, password });

      const { token, role } = response.data;
      
      // Store token and role
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminRole", role);
      
      toast.success(`Welcome ${role === "superadmin" ? "Super Admin" : "Admin"}!`);

      navigate("/admin/dashboard", { replace: true });
    } catch (err: any) {
      const message = extractErrorMessages(err);
      setError(message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    loading,
    handleLogin,
  };
};
