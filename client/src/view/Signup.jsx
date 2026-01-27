import { useState } from "react";
import { Link } from "react-router-dom";
import PageWrapper from "../context/animate";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("register data :", form);
  };

  return (
    <PageWrapper>
      <div
        className="signup d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="card p-4" style={{ width: "420px" }}>
          <h4 className="text-center mb-3">register</h4>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField label="first name" size="small" fullWidth />
              <TextField label="last name" size="small" fullWidth />
              <TextField label="email" type="email" size="small" fullWidth />
              <TextField
                label="password"
                type="password"
                size="small"
                fullWidth
              />

              <Button type="submit" variant="contained" fullWidth>
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
