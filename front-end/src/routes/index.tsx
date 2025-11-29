import { Routes, Route } from "react-router-dom";
import SpinPage from "../Pages/SpinPage/SpinPage";
import InvalidPage from "../Pages/InvalidPages/InvalidPage";


const AppRoutes = () => {
 
  return (
    <Routes>
      <Route path="/" element={<SpinPage />} />
      <Route path="/invalid" element={<InvalidPage />} />
    </Routes>
  );
};

export default AppRoutes;
