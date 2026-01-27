import { Outlet } from "react-router-dom";
import { useTheme } from "../context/Theme";

import darkVideo from "../assets/design/video/bg_dark_video.mp4";
import lightVideo from "../assets/design/video/bg_light_video.mp4";

export default function LayoutBg() {
  const { theme } = useTheme();
  const bgVideo = theme === "dark" ? darkVideo : lightVideo;

  return (
    <div
      className="layout-bg position-relative"
      style={{ minHeight: "100vh" }}
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
