import { Outlet } from "react-router-dom";
import SidebarLayout from "../../components/SidebarLayout";

const AdminDashboard = () => {
  return (
    <SidebarLayout>
      <Outlet />
    </SidebarLayout>
  );
};

export default AdminDashboard;
