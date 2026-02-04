import { Outlet } from "react-router-dom";
import { useTheme } from "../context/Theme";

const DARK_VIDEO = "/public/video/bg_dark_video.mp4";
const LIGHT_VIDEO = "/public/video/bg_light_video.mp4";

export default function LayoutBg() {
  const { theme } = useTheme();
  const bgVideo = theme === "dark" ? DARK_VIDEO : LIGHT_VIDEO;

  return (
    <div
      className="layout-bg position-relative"
      style={{ minHeight: "100dvh" }}
    >
      <video
        key={bgVideo}
        autoPlay
        loop
        muted
        playsInline
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ objectFit: "cover", zIndex: -1 }}
      >
        <source src={bgVideo} type="video/mp4" />
      </video>
      <Outlet />
    </div>
  );
}
