import { useTheme } from "../../context/Theme";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <nav className="navbar bg-body-tertiary col-lg-12 border rounded-4">
      <div className="container d-flex justify-content-between align-items-center">
        <span className="navbar-brand">my Navbar</span>

        {/* Theme */}
        <div
          onClick={toggleTheme}
          className={`theme-switch ${isDark ? "dark" : ""}`}
          role="button"
          aria-label="toggle theme"
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
