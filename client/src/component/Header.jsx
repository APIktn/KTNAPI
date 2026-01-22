import { useState } from "react";
import Navbar from "./Nav/Navbar";
import Sidebar from "./Nav/Sidebar.jsx";
import { useTheme } from "../context/Theme";

import darkVideo from "../assets/design/video/bg_dark_video.mp4";
import lightVideo from "../assets/design/video/bg_light_video.mp4";

export default function Header({ children }) {
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const bgVideo = theme === "dark" ? darkVideo : lightVideo;

  return (
    <div
      className="container-fluid position-relative"
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

      <div className="row p-3">
        <div className="col-lg-12">
          <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
        </div>

        {isSidebarOpen && (
          <div className="col-lg-3 mt-3">
            <Sidebar />
          </div>
        )}

        <div className={`${isSidebarOpen ? "col-lg-9" : "col-lg-12"} mt-3`}>
          {children}
        </div>
      </div>
    </div>
  );
}
