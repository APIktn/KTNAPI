import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Nav/Navbar";
import SidebarDesktop from "./Nav/SidebarDesktop";
import SidebarMobile from "./Nav/SidebarMobile";
import Footer from "./Footer";

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const isSidebarExpanded = isSidebarOpen && isSidebarHovered;

  const [isNavbarSticky, setIsNavbarSticky] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  const [animateSidebarBorder, setAnimateSidebarBorder] = useState(false);

  const footerRef = useRef(null);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  /* resize */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      setIsSidebarOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* footer observer */
  useEffect(() => {
    if (!footerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsFooterVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );

    observer.observe(footerRef.current);

    return () => observer.disconnect();
  }, [isMobile]);

  useEffect(() => {
    setIsSidebarOpen(false);
    setIsSidebarHovered(false);
  }, [isMobile]);

  /* sidebar border animation */
  useEffect(() => {
    setAnimateSidebarBorder(true);
    const t = setTimeout(() => setAnimateSidebarBorder(false), 300);
    return () => clearTimeout(t);
  }, [isSidebarOpen, isNavbarSticky, isFooterVisible, isSidebarHovered]);

  return (
    <div className="Header container-fluid d-flex flex-column min-vh-100">
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

      {/* content */}
      <div className="flex-grow-1">
        {/* desktop */}
        {!isMobile && (
          <div className="row px-3 py-2 desktop-layout d-flex">
            <div
              className={`desktop-sidebar ${isSidebarOpen ? "open" : "closed"}`}
            >
              {isSidebarOpen && (
                <SidebarDesktop
                  isOpen={isSidebarExpanded}
                  isNavbarSticky={isNavbarSticky}
                  isFooterVisible={isFooterVisible}
                  animateBorder={animateSidebarBorder}
                  onMouseEnter={() => setIsSidebarHovered(true)}
                  onMouseLeave={() => setIsSidebarHovered(false)}
                />
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
