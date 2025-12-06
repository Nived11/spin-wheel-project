import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, Menu, X, ShieldCheck } from "lucide-react";
import { getUserRole, isSuperAdmin } from "../utils/roleCheck";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const role = getUserRole();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    console.log("Logged out, redirecting to login");
    navigate("/admin/login", { replace: true });
  };

  // Define menu items based on role
  const menuItems = [
    { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["admin", "superadmin"] },
    { path: "/admin/users", icon: Users, label: isSuperAdmin() ? "All Users" : "Redeem", roles: ["admin", "superadmin"] },
  ];

  const currentPage = menuItems.find((i) => i.path === location.pathname)?.label || "Admin Panel";

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-linear-to-b from-amber-900 via-amber-950 to-slate-900 text-white
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between border-b border-amber-800/30">
          <h2 className="text-xl font-bold text-amber-50">Empire Plaza</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-amber-800/30 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Badge */}
        <div className="px-4 pt-4 pb-2">
          <div className="bg-amber-800/30 rounded-lg px-3 py-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span className="text-sm text-amber-100 font-medium">
              {role === "superadmin" ? "Super Admin" : "Admin"}
            </span>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-amber-600 text-white shadow-lg"
                    : "hover:bg-amber-800/30 text-amber-100"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-amber-800/30">
          <button
            onClick={handleLogout}
            className="cursor-pointer flex items-center gap-3 px-4 py-3 w-full hover:bg-red-600/90 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              {currentPage}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-800 font-semibold text-xs sm:text-sm">
              {role === "superadmin" ? "Welcome, Super Admin" : "Welcome, Admin"}
            </span>
          </div>
        </header>

        {/* Page Content - Scrollable */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
