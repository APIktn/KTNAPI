import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

export default function SavingBackdrop({
  open,
  text = "loading...",
}) {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.modal + 1,
        flexDirection: "column",
      }}
      open={open}
    >
      <CircularProgress size={80} thickness={4} />
      <Typography sx={{ mt: 2 }}>{text}</Typography>
    </Backdrop>
  );
}

SavingBackdrop.propTypes = {
  open: PropTypes.bool.isRequired,
  text: PropTypes.string,
};
