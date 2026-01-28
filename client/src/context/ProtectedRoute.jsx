import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import PleaseLoginModal from "../component/Modal/PleaseLoginModal";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      setOpen(true);
    }
  }, [token]);

  const handleClose = () => {
    setOpen(false);
    navigate("/login");
  };

  if (!token) {
    return (
      <PleaseLoginModal
        open={open}
        onClose={handleClose}
      />
    );
  }

  return <Outlet />;
}
