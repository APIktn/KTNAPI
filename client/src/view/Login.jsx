import { useState } from "react";
import { Link } from "react-router-dom";
import PageWrapper from "../context/animate";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("login data :", form);
    // ต่อ api login ทีหลังตรงนี้
  };

  return (
    <PageWrapper>
      <div
        className="login d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="card p-4" style={{ width: "420px" }}>
          <h4 className="text-center mb-3">login</h4>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="username"
                name="username"
                size="small"
                value={form.username}
                onChange={handleChange}
                fullWidth
              />

              <TextField
                label="password"
                name="password"
                type="password"
                size="small"
                value={form.password}
                onChange={handleChange}
                fullWidth
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
    </PageWrapper>
  );
}
