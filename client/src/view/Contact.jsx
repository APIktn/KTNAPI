import { useEffect, useState } from "react";
import { Box, Grow } from "@mui/material";

const RESUME_IMG ="/image/Kittanun_Apisitamorn_resume.png";

function Contact() {
  const [animateKey, setAnimateKey] = useState(0);

  useEffect(() => {
    setAnimateKey((k) => k + 1);
  }, []);

  return (
    <Grow in timeout={500} key={animateKey}>
      <Box
        sx={{
          p: 2,
          textAlign: "center",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: 2,
          border: "1px solid rgba(255,255,255,0.25)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        }}
      >
        <img
          src={RESUME_IMG}
          alt="resume"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      </Box>
    </Grow>
  );
}

export default Contact;
