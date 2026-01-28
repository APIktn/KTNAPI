import { useState } from "react";
import { Link } from "react-router-dom";
import PageWrapper from "../context/animate";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Signup() {
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    userEmail: "",
    password: "",
    firstName: "",
    lastName: "",
  });

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

    if (!validate()) return;

    const payload = {
      ...form,
      status: "register",
    };

    try {
      const res = await axios.post(`${API_URL}/auth/register`, payload);

      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || "error");
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = "first name is required";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "last name is required";
    }

    if (!form.userEmail.trim()) {
      newErrors.userEmail = "email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.userEmail)) {
      newErrors.userEmail = "invalid email format";
    }

    if (!form.password) {
      newErrors.password = "password is required";
    } else if (form.password.length < 10) {
      newErrors.password = "password must be at least 10 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <PageWrapper>
      <div
        className="signup d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="card p-4" style={{ width: "420px" }}>
          <h4 className="text-center mb-3">Sign up</h4>

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
                type="password"
                size="small"
                fullWidth
                value={form.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />

              <Button
                type="submit"
                variant="contained"
                value="register"
                fullWidth
              >
                register
              </Button>

              <Link
                to="/login"
                style={{ textAlign: "center", textDecoration: "none" }}
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
    </PageWrapper>
  );
}
