import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import Fade from "@mui/material/Fade";

export default function AppModal({
  open,
  onClose,
  type = "success",
  title,
  message,
}) {
  const isSuccess = type === "success";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slots={{ transition: Fade }}
      slotProps={{
        transition: { timeout: 220 },
        paper: {
          sx: {
            width: 420,
            minHeight: 220,
            borderRadius: 4,

            /* brighter glass */
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
      {/* title */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          fontWeight: 600,
          fontSize: "1.15rem",
          color: isSuccess ? "#1b5e20" : "#b71c1c",
        }}
      >
        {isSuccess ? (
          <CheckCircleIcon sx={{ fontSize: 34, color: "#2e7d32" }} />
        ) : (
          <ErrorIcon sx={{ fontSize: 34, color: "#d32f2f" }} />
        )}
        {title}
      </DialogTitle>

      {/* content */}
      <DialogContent sx={{ pt: 1 }}>
        <DialogContentText
          sx={{
            fontSize: "0.96rem",
            color: "rgba(0,0,0,0.85)",
            lineHeight: 1.6,
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>

      {/* actions */}
      <DialogActions sx={{ pb: 3, pr: 3 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            px: 4,
            borderRadius: 999,
            textTransform: "none",
            fontWeight: 500,
            background: isSuccess
              ? "linear-gradient(135deg,#4caf50,#81c784)"
              : "linear-gradient(135deg,#e53935,#ef5350)",
            boxShadow:
              "0 6px 14px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.4)",
          }}
        >
          ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
