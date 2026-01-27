import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./component/Header.jsx";
import NotFound from "./view/NotFound.jsx";
import Home from "./view/Home.jsx";
import Login from "./view/Login.jsx";
import Signup from "./view/Signup.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Header />}>
        <Route path="/" element={<Home />} />
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
      <AppRoutes />
    </BrowserRouter>
  );
}
