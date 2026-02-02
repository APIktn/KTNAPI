import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

/* ===== circular with label ===== */
function CircularProgressWithLabel({ value }) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={80}
        thickness={4}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" sx={{ color: "#fff" }}>
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

/* ===== backdrop component ===== */
export default function SavingBackdrop({
  open,
  progress,
  text = "saving...",
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
      <CircularProgressWithLabel value={progress} />
      <Typography sx={{ mt: 2 }}>{text}</Typography>
    </Backdrop>
  );
}

SavingBackdrop.propTypes = {
  open: PropTypes.bool.isRequired,
  progress: PropTypes.number.isRequired,
  text: PropTypes.string,
};
