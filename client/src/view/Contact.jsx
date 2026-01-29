import resume from "../assets/Design/Image/Kittanun_ Apisitamorn_resume.png";

function Contact() {
  return (
    <div
      style={{
        width: "100%",
        height: "78vh",
        padding: 24,
        textAlign: "center",
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.25)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
      }}
    >
      <img
        src={resume}
        alt="resume"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          marginBottom: 16,
        }}
      />
    </div>
  );
}

export default Contact;
