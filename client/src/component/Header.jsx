import { useState, useEffect, useRef } from "react";
import Navbar from "./Nav/Navbar";
import SidebarDesktop from "./Nav/SidebarDesktop";
import SidebarMobile from "./Nav/SidebarMobile";
import Footer from "./Footer";
import { useTheme } from "../context/Theme";
import { Outlet } from "react-router-dom";

import darkVideo from "../assets/design/video/bg_dark_video.mp4";
import lightVideo from "../assets/design/video/bg_light_video.mp4";

export default function Header() {
  const { theme } = useTheme();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const isSidebarExpanded = isSidebarOpen && isSidebarHovered;
  const isSidebarActive = isSidebarOpen || isSidebarHovered;
  const [isNavbarSticky, setIsNavbarSticky] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [animateSidebarBorder, setAnimateSidebarBorder] = useState(false);
  const footerRef = useRef(null);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  // resize handler
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      setIsSidebarOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // observe footer
  useEffect(() => {
    if (!footerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  // trigger border animation
  useEffect(() => {
    setAnimateSidebarBorder(true);
    const t = setTimeout(() => {
      setAnimateSidebarBorder(false);
    }, 300);
    return () => clearTimeout(t);
  }, [isSidebarOpen, isNavbarSticky, isFooterVisible, isSidebarHovered]);

  const bgVideo = theme === "dark" ? darkVideo : lightVideo;

  return (
    <div
      className="Header container-fluid position-relative d-flex flex-column"
      style={{ minHeight: "100vh" }}
    >
      {/* bg video */}
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
          onToggleSidebar={() => {
            setIsSidebarOpen((p) => !p);
            setIsSidebarHovered(false);
          }}
          onStickyChange={setIsNavbarSticky}
        />
      </div>

      <div className="flex-grow-1">
        {/* desktop */}
        {!isMobile && (
          <div className="row p-3 desktop-layout d-flex ">
            <div
              className={`desktop-sidebar ${isSidebarOpen ? "open" : "closed"}`}
            >
              {isSidebarOpen && (
                <div className="desktop-sidebar open">
                  <SidebarDesktop
                    isOpen={isSidebarExpanded}
                    isNavbarSticky={isNavbarSticky}
                    isFooterVisible={isFooterVisible}
                    animateBorder={animateSidebarBorder}
                    onMouseEnter={() => setIsSidebarHovered(true)}
                    onMouseLeave={() => setIsSidebarHovered(false)}
                  />
                </div>
              )}
            </div>

            <div
              className={`desktop-content ${
                isSidebarExpanded
                  ? "shrink"
                  : isSidebarOpen
                    ? "expand"
                    : "expand-full"
              }`}
            >
              <Outlet />
            </div>
          </div>
        )}

        {/* mobile */}
        {isMobile && (
          <>
            <SidebarMobile
              open={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />
            <div className="mobile-content">
              {" "}
              <Outlet />
            </div>
          </>
        )}
      </div>

      {/* footer */}
      <div className="footer-layer mt-auto" ref={footerRef}>
        <Footer />
      </div>
    </div>
  );
}
