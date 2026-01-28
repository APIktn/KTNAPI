import { BrowserRouter, Routes, Route } from "react-router-dom";

import LayoutBg from "./component/LayoutBg";
import Header from "./component/Header";
import AuthExpiredModal from "./component/Modal/AuthExpiredModal";
import ProtectedRoute from "./context/ProtectedRoute";
import Home from "./view/Home.jsx";
import Login from "./view/Login.jsx";
import Signup from "./view/Signup.jsx";
import NotFound from "./view/NotFound.jsx";
import Profile from "./view/Profile.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<LayoutBg />}>
        <Route element={<Header />}>
          <Route path="/" element={<Home />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
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
