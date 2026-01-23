import { useTheme } from "../../context/Theme";
import { useEffect, useState } from "react";

function Navbar({ onToggleSidebar }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [isSticky, setIsSticky] = useState(false);

  const STICKY_OFFSET = 80; // ปรับได้ตามต้องการ

  useEffect(() => {
    const onScroll = () => {
      setIsSticky(window.scrollY >= STICKY_OFFSET);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`${isSticky ? "navbar-placeholder" : "pt-3 mx-4"}`}>
      <nav
        className={`
          navbar
          bg-body-tertiary
          ${isSticky ? "navbar-fixed" : "border rounded-4"}
        `}
      >
        <div className="container d-flex justify-content-between align-items-center">
          {/* left */}
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-outline-secondary"
              onClick={onToggleSidebar}
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            <span className="navbar-brand mb-0">Daily Duck</span>
          </div>

          {/* right */}
          <div
            onClick={toggleTheme}
            className={`theme-switch ${isDark ? "dark" : ""}`}
            role="button"
          >
            <div className="theme-switch-thumb">
              {isDark ? (
                <i className="fa-solid fa-moon" style={{ color: "#91c8f2" }} />
              ) : (
                <i className="fa-solid fa-sun" style={{ color: "#ffe093" }} />
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
