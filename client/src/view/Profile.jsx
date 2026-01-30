import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  Divider,
  Slide,
  useMediaQuery,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useTheme } from "../context/Theme";
import AppModal from "../component/Modal/AppModal";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

function Profile() {
  const { updateUser } = useAuth();
  const { theme } = useTheme();
  const isMobile = useMediaQuery("(max-width:768px)");

  const [animateKey, setAnimateKey] = useState(0);
  useEffect(() => {
    setAnimateKey((k) => k + 1);
  }, []);

  const [user, setUser] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [tel, setTel] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  /* validate */
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
  });

  const validate = () => {
    const newErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "first name is required";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "last name is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ================= modal ================= */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const openModal = (config) => {
    setModalConfig({
      ...config,
      onClose: config.onClose || (() => setModalOpen(false)),
    });
    setModalOpen(true);
  };

  /* ================= load profile ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .post(
        `${API_URL}/user/profile`,
        { status: "getprofile" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        const d = res.data.user;

        setUser(d);
        setFirstName(d.firstName || "");
        setLastName(d.lastName || "");
        setUsername(d.userName || "");
        setAddress(d.address || "");
        setTel(d.tel || "");

        // image server url
        setPreview(`${API_URL}${d.imageUpload}` || null);
      })
      .catch(() => {
        openModal({
          type: "error",
          title: "load failed",
          message: "cannot load profile",
        });
      });
  }, []);

  /* ================= save ================= */
  const handleSave = async () => {
    if (!validate()) return;
    if (!user) return;

    const formData = new FormData();
    formData.append("status", "updateprofile");
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("userName", username);
    formData.append("address", address);
    formData.append("tel", tel);

    if (image) formData.append("image", image);

    try {
      const res = await axios.post(`${API_URL}/user/profile`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.data?.success) {
        openModal({
          type: "error",
          title: "update failed",
          message: res.data?.message || "update failed",
        });
        return;
      }

      openModal({
        type: "success",
        title: "update success",
        message: res.data.message || "profile updated",
        onClose: () => {
          const updatedUser = {
            ...user,
            firstName,
            lastName,
            userName: username,
            displayName: username ? username : `${firstName} ${lastName}`,
            address,
            tel,
            imageUpload: res.data.imageUpload ?? user.imageUpload,
          };

          updateUser(res.data.user);
          setUser(updatedUser);
          setModalOpen(false);
        },
      });
    } catch (err) {
      openModal({
        type: "error",
        title: "update failed",
        message:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "cannot update profile",
      });
    }
  };

  if (!user) return null;

  /* ================= UI ================= */
  /* ================= UI ================= */
  /* ================= UI ================= */
  /* ================= UI ================= */
  /* ================= UI ================= */

  return (
    <>
      <Slide
        in
        direction="left"
        timeout={450}
        key={animateKey}
        appear={!isMobile}
      >
        <Box
          sx={{
            minHeight: "79vh",
            p: 3,
            borderRadius: 2,
            marginBottom: 2,
            background:
              theme === "dark" ? "rgba(30,30,30,0.6)" : "rgba(255,255,255,0.6)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          }}
        >
          <Typography variant="h6" mb={2}>
            profile
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {/* avatar */}
            <Box
              component="label"
              sx={{
                width: 180,
                height: 180,
                borderRadius: "50%",
                overflow: "hidden",
                cursor: "pointer",
                alignSelf: { xs: "center", md: "flex-start" },
                bgcolor: "action.hover",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: preview ? "none" : "2px dashed #bbb",
              }}
            >
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files[0];
                  if (!f) return;
                  setImage(f);
                  setPreview(URL.createObjectURL(f));
                }}
              />

              {preview ? (
                <Avatar src={preview} sx={{ width: "100%", height: "100%" }} />
              ) : (
                <Typography variant="h3" sx={{ color: "#999" }}>
                  +
                </Typography>
              )}
            </Box>

            {/* form */}
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <TextField
                  label="first name"
                  value={firstName}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFirstName(value);

                    if (errors.firstName && value.trim()) {
                      setErrors((prev) => ({ ...prev, firstName: "" }));
                    }
                  }}
                />

                <TextField
                  label="last name"
                  value={lastName}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLastName(value);

                    if (errors.lastName && value.trim()) {
                      setErrors((prev) => ({ ...prev, lastName: "" }));
                    }
                  }}
                />

                <TextField
                  label="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <TextField
                  label="tel"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                />

                <TextField
                  label="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Box>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                >
                  save
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Slide>

      <AppModal open={modalOpen} {...modalConfig} />
    </>
  );
}

export default Profile;
