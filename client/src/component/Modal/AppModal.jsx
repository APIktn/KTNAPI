import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function AppModal({
  open,
  onClose,

  /* basic */
  title,
  message,
  type = "success", // success | error | warning
  mode = "alert", // alert | confirm

  /* buttons */
  confirmText = "ok",
  cancelText = "cancel",

  onConfirm,
  onCancel,

  /* optional links */
  link1,
  link1Text,
  link2,
  link2Text,
}) {
  const isSuccess = type === "success";
  const isError = type === "error";

  const icon =
    type === "success" ? (
      <CheckCircleIcon sx={{ fontSize: 34, color: "#2e7d32" }} />
    ) : type === "error" ? (
      <ErrorIcon sx={{ fontSize: 34, color: "#d32f2f" }} />
    ) : (
      <WarningAmberIcon sx={{ fontSize: 34, color: "#ed6c02" }} />
    );

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          onClose?.();
        }
      }}
      slots={{ transition: Fade }}
      slotProps={{
        transition: { timeout: 220 },
        paper: {
          sx: {
            width: 420,
            minHeight: 220,
            borderRadius: 4,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.6))",
            backdropFilter: "blur(18px)",
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
          color: isSuccess ? "#1b5e20" : isError ? "#b71c1c" : "#e65100",
        }}
      >
        {icon}
        {title}
      </DialogTitle>

      {/* content */}
      <DialogContent sx={{ pt: 1 }}>
        <DialogContentText
          sx={{
            fontSize: "0.95rem",
            color: "rgba(0,0,0,0.85)",
            lineHeight: 1.6,
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>

      {/* actions */}
      <DialogActions sx={{ pb: 3, px: 3 }}>
        {/* cancel */}
        {mode === "confirm" && (
          <Button
            onClick={onCancel || onClose}
            variant="outlined"
            sx={{ borderRadius: 999, textTransform: "none" }}
          >
            {cancelText}
          </Button>
        )}

        {/* link buttons */}
        {link1 && (
          <Button component="a" href={link1} sx={{ textTransform: "none" }}>
            {link1Text || "open"}
          </Button>
        )}

        {link2 && (
          <Button component="a" href={link2} sx={{ textTransform: "none" }}>
            {link2Text || "open"}
          </Button>
        )}

        {/* confirm */}
        <Button
          onClick={mode === "confirm" ? onConfirm : onClose}
          variant="contained"
          sx={{
            px: 4,
            borderRadius: 999,
            textTransform: "none",
            fontWeight: 500,
            background: isSuccess
              ? "linear-gradient(135deg,#4caf50,#81c784)"
              : isError
                ? "linear-gradient(135deg,#e53935,#ef5350)"
                : "linear-gradient(135deg,#fb8c00,#ffb74d)",
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
