import { useTheme } from "../../context/Theme";

function Navbar({ onToggleSidebar }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <nav className="navbar bg-body-tertiary border rounded-4">
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
              <i className="fa-solid fa-moon" style={{ color: "#91c8f2" }}></i>
            ) : (
              <i className="fa-solid fa-sun" style={{ color: "#ffe093" }}></i>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
