import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageWrapper from "../context/animate";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AppModal from "../component/Modal/AppModal";
import { validateRegister } from "../validations/auth.validation";
import { useServices } from "../context/ServiceContext";

export default function Signup() {
  const { auth } = useServices();
  const [form, setForm] = useState({
    userEmail: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // modal state
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState({
    type: "success",
    title: "",
    message: "",
  });

  const openModal = (type, title, message) => {
    setModal({ type, title, message });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    if (modal.type === "success") {
      navigate("/login");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate
    const newErrors = validateRegister(form);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      // di
      const res = await auth.register(form);

      if (res.status === 201) {
        openModal("success", "registration successful", res.data.message);
      }
    } catch (err) {
      openModal(
        "error",
        "registration failed",
        err.response?.data?.error || "something went wrong",
      );
    }
  };

  return (
    <PageWrapper>
      <div
        className="signup d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="card p-4" style={{ width: "420px" }}>
          <h4 className="text-center mb-3">sign up</h4>

          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={2}>
              <TextField
                label="first name"
                name="firstName"
                size="small"
                fullWidth
                value={form.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />

              <TextField
                label="last name"
                name="lastName"
                size="small"
                fullWidth
                value={form.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />

              <TextField
                label="email"
                name="userEmail"
                type="email"
                size="small"
                fullWidth
                value={form.userEmail}
                onChange={handleChange}
                error={!!errors.userEmail}
                helperText={errors.userEmail}
              />

              <TextField
                label="password"
                name="password"
                type={showPassword ? "text" : "password"}
                size="small"
                fullWidth
                value={form.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button type="submit" variant="contained" fullWidth>
                register
              </Button>

              <Link
                to="/login"
                style={{
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                already have an account ? let's login here!
              </Link>
            </Stack>
          </form>
        </div>

        <Link to="/" className="btn-glass">
          back to home
        </Link>
      </div>

      <AppModal
        open={open}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />
    </PageWrapper>
  );
}
