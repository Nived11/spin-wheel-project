import { Lock, User, Shield, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAdminLogin } from "../../hooks/Admin/useAdminLogin";

const AdminLogin = () => {
  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    loading,
    handleLogin,
  } = useAdminLogin();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-900 via-amber-950 to-slate-900 px-2">

        <div className="bg-white rounded-2xl shadow-2xl p-1 w-full max-w-md relative z-10">
          <div className="absolute -inset-0.5 bg-linear-to-r from-amber-800 to-amber-900 rounded-2xl opacity-80 blur"></div>

          <div className="relative bg-white rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="inline-block relative mb-4">
                <div className="absolute inset-0 bg-linear-to-br from-amber-600 to-amber-800 rounded-full blur-md opacity-50"></div>
                <div className="relative bg-linear-to-br from-amber-600 to-amber-800 p-4 rounded-full">
                  <Shield className="w-10 h-10 text-white" />
                </div>
              </div>

              <h1 className="text-3xl font-bold bg-linear-to-r from-amber-800 to-slate-800 bg-clip-text text-transparent mb-2">
                Admin Portal
              </h1>
              <p className="text-gray-600 font-medium">Empire Plaza Spin Wheel</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">⚠️</span>
                    {error}
                  </div>
                </div>
              )}

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 text-amber-700" />
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
                         focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                         outline-none transition-all hover:border-gray-300
                         placeholder:text-gray-400"
                  placeholder="Enter admin username"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Lock className="w-4 h-4 text-amber-700" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl 
                           focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                           outline-none transition-all hover:border-gray-300
                           placeholder:text-gray-400"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-amber-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-amber-700 via-amber-800 to-amber-900 
                       text-white py-3 rounded-xl font-semibold 
                       hover:shadow-xl transition-shadow duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Secure Login
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                🔒 Secure admin access only
              </p>
            </div>
          </div>
        </div>

        <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
      </div>
    </>

  );
};

export default AdminLogin;
