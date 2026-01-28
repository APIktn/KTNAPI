import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

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
      slotProps={{
        paper: {
          sx: {
            width: 420,
            minHeight: 220,
            borderRadius: 2,
          },
        },
      }}
    >
      <DialogTitle>session expired</DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        your session has expired. please login again.
      </DialogContent>

      <DialogActions sx={{ pb: 2, pr: 3 }}>
        <Button onClick={handleClose} variant="contained">
          ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
