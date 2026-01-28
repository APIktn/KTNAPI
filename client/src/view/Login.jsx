import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageWrapper from "../context/animate";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import axios from "axios";
import AppModal from "../component/Modal/AppModal";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [modal, setModal] = useState({
    type: "success",
    title: "",
    message: "",
  });

  const navigate = useNavigate();

  const openModal = (type, title, message) => {
    setModal({ type, title, message });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    if (isLogin) {
      navigate("/");
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

  const validate = () => {
    const newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = "username or email is required";
    }

    if (!form.password) {
      newErrors.password = "password is required";
    } else if (form.password.length < 10) {
      newErrors.password = "password must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        username: form.username,
        password: form.password,
      });

      if (res.status === 200) {
        setIsLogin(true);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        openModal("success", "login successful", res.data.message);
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.errors?.userName ||
        err.response?.data?.errors?.password ||
        "something went wrong";

      openModal("error", "login failed", msg);
    }
  };

  return (
    <PageWrapper>
      <div
        className="login d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="card p-4" style={{ width: "420px" }}>
          <h4 className="text-center mb-3">login</h4>

          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={2}>
              <TextField
                label="username or email"
                name="username"
                size="small"
                fullWidth
                value={form.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
              />

              <TextField
                label="password"
                name="password"
                type="password"
                size="small"
                fullWidth
                value={form.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />

              <Button type="submit" variant="contained" fullWidth>
                login
              </Button>

              <Link
                to="/signup"
                style={{ textAlign: "center", textDecoration: "none" }}
              >
                no account ? let's signup here!
              </Link>
            </Stack>
          </form>
        </div>

        <Link to="/" className="btn-glass">
          back to home
        </Link>
      </div>

      {/* modal */}
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
