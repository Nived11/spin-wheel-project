import { Routes, Route } from "react-router-dom";
import SpinPage from "../Pages/SpinPage/SpinPage";
import InvalidPage from "../Pages/InvalidPages/InvalidPage";
import DemoForm from "../Pages/DemoForm/DemoForm";


const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<DemoForm />} /> 
    <Route path="/spin" element={<SpinPage />} />
    <Route path="/invalid" element={<InvalidPage />} />
  </Routes>
);


export default AppRoutes;
