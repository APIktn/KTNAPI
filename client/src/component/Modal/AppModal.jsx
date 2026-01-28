import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

export default function AppModal({
  open,
  onClose,
  type = "success",
  title,
  message,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontWeight: "bold",
          color: type === "success" ? "green" : "red",
        }}
      >
        {type === "success" ? (
          <CheckCircleIcon color="success" />
        ) : (
          <ErrorIcon color="error" />
        )}
        {title}
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ pb: 2, pr: 3 }}>
        <Button onClick={onClose} variant="contained">
          ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
