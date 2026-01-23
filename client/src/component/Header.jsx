import { useState, useEffect } from "react";
import Navbar from "./Nav/Navbar";
import Sidebar from "./Nav/Sidebar.jsx";
import { useTheme } from "../context/Theme";

import darkVideo from "../assets/design/video/bg_dark_video.mp4";
import lightVideo from "../assets/design/video/bg_light_video.mp4";

export default function Header({ children }) {
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNavbarSticky, setIsNavbarSticky] = useState(false);

  // reset sidebar เมื่อเข้า mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const bgVideo = theme === "dark" ? darkVideo : lightVideo;

  return (
    <div
      className="Header container-fluid position-relative"
      style={{ minHeight: "100vh" }}
    >
      {/* background video */}
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

      {/* navbar */}
      <div className="navbar-layer">
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen((p) => !p)}
          onStickyChange={setIsNavbarSticky}
        />
      </div>

      <div className="row p-3 d-none d-lg-flex desktop-layout">
        {/* ===== desktop ===== */}
        <div
          className={`desktop-sidebar ${isSidebarOpen ? "open" : "closed"} transition-all`}
        >
          <Sidebar isOpen={isSidebarOpen} isNavbarSticky={isNavbarSticky} />
        </div>

        <div
          className={`desktop-content ${isSidebarOpen ? "shrink" : "expand"}`}
        >
          {children}
        </div>

        {/* ===== mobile ===== */}
        <div className="d-block d-lg-none position-relative">
          {/* backdrop */}
          {isSidebarOpen && (
            <div
              className="mobile-backdrop"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <div className={`mobile-sidebar ${isSidebarOpen ? "open" : ""}`}>
            <Sidebar isOpen />
          </div>

          <div className="mobile-content mt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
