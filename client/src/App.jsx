import { BrowserRouter, Routes, Route } from "react-router-dom";

import LayoutBg from "./component/LayoutBg";
import Header from "./component/Header";
import AuthExpiredModal from "./component/Modal/AuthExpiredModal";
import ProtectedRoute from "./context/ProtectedRoute";
import PublicRoute from "./context/PublicRoute";
import Home from "./view/Home.jsx";
import Login from "./view/Login.jsx";
import Signup from "./view/Signup.jsx";
import NotFound from "./view/NotFound.jsx";
import Profile from "./view/Profile.jsx";
import Contact from "./view/Contact.jsx";
import AddProduct from "./view/AdminAddProduct.jsx";
import AdminInventory from "./view/AdminInventory.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<LayoutBg />}>
        <Route element={<Header />}>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />

          {/* login */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/AdminAddProduct" element={<AddProduct />} />
            <Route path="/AdminInventory" element={<AdminInventory />} />
          </Route>
        </Route>

        {/* Public only*/}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthExpiredModal />
      <AppRoutes />
    </BrowserRouter>
  );
}
