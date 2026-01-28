import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import ErrorIcon from "@mui/icons-material/Error";
import Fade from "@mui/material/Fade";

export default function AuthExpiredModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("auth-expired", handler);
    return () => window.removeEventListener("auth-expired", handler);
  }, []);

  const handleClose = () => {
    setOpen(false);
    window.location.replace("/login");
  };

  return (
    <Dialog
      open={open}
      slots={{ transition: Fade }}
      slotProps={{
        transition: { timeout: 220 },
        paper: {
          sx: {
            width: 420,
            minHeight: 220,
            borderRadius: 4,

            background:
              "linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0.55))",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",

            border: "1px solid rgba(255,255,255,0.45)",
            boxShadow:
              "0 20px 45px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.6)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          fontWeight: 600,
          color: "#b71c1c",
        }}
      >
        <ErrorIcon sx={{ fontSize: 34, color: "#d32f2f" }} />
        session expired
      </DialogTitle>

      <DialogContent>
        <DialogContentText
          sx={{ color: "rgba(0,0,0,0.85)", lineHeight: 1.6 }}
        >
          your session has expired. please login again.
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ pb: 3, pr: 3 }}>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            px: 4,
            borderRadius: 999,
            textTransform: "none",
            background: "linear-gradient(135deg,#e53935,#ef5350)",
            boxShadow: "0 6px 14px rgba(0,0,0,0.22)",
          }}
        >
          ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
