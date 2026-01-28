import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

export default function PleaseLoginModal({ open, onClose }) {
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
      <DialogTitle>login required</DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        please login before visiting this page.
      </DialogContent>

      <DialogActions sx={{ pb: 2, pr: 3 }}>
        <Button onClick={onClose} variant="contained">
          ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
