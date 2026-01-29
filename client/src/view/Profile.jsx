import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
} from "@mui/material";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function Profile() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  /* ================= load profile ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const localUser = JSON.parse(localStorage.getItem("user"));

    if (!token || !localUser?.userCode) return;

    axios
      .post(
        `${API_URL}/user/profile`,
        {
          status: "getprofile",
          userCode: localUser.userCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setUser(res.data);

        setUsername(
          res.data.userName
            ? res.data.userName
            : res.data.displayName
        );

        setPreview(res.data.imageProfile);
      })
      .catch(() => {
        // optional: handle error
      });
  }, []);

  /* ================= save ================= */
  const handleSave = async () => {
    if (!user) return;

    const formData = new FormData();
    formData.append("status", "updateprofile");
    formData.append("userCode", user.userCode);
    formData.append("userName", username);

    if (password) formData.append("password", password);
    if (image) formData.append("image", image);

    await axios.post(`${API_URL}/user/update`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    // sync user back to localStorage (important)
    const updatedUser = {
      ...user,
      userName: username,
      displayName: username,
      imageProfile: image ? preview : user.imageProfile,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setPassword("");

    alert("profile updated");
  };

  if (!user) return null;

  return (
    <Box
      sx={{
        maxWidth: 420,
        mx: "auto",
        mt: 4,
        p: 3,
        borderRadius: 3,
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.35)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
      }}
    >
      <Typography variant="h6" mb={2}>
        profile
      </Typography>

      {/* profile image */}
      <Box
        component="label"
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 2,
          cursor: "pointer",
        }}
      >
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            setImage(file);
            setPreview(URL.createObjectURL(file));
          }}
        />
        <Avatar
          src={preview || ""}
          sx={{ width: 96, height: 96 }}
        />
      </Box>

      <TextField
        label="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        margin="dense"
      />

      <TextField
        label="email"
        value={user.email}
        disabled
        fullWidth
        margin="dense"
      />

      <TextField
        label="new password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="dense"
      />

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleSave}
      >
        save
      </Button>
    </Box>
  );
}

export default Profile;
