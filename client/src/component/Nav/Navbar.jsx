import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import SupportAgent from "@mui/icons-material/SupportAgent";
import Button from "@mui/material/Button";

import { useTheme } from "../../context/Theme";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Navbar({ onToggleSidebar, onStickyChange }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [isSticky, setIsSticky] = useState(false);
  const [value, setValue] = useState("Home");

  const STICKY_OFFSET = 80;

  useEffect(() => {
    const onScroll = () => {
      const sticky = window.scrollY >= STICKY_OFFSET;
      setIsSticky(sticky);
      onStickyChange?.(sticky);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={isSticky ? "navbar-placeholder" : "pt-3 mx-4"}>
      <nav
        className={`
          navbar
          bg-body-tertiary
          ${isSticky ? "navbar-fixed" : "border rounded-4"}
        `}
      >
        <div className="container d-flex align-items-center justify-content-between">
          {/* L */}
          <button
            className="btn btn-outline-secondary"
            onClick={onToggleSidebar}
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          {/* C */}
          <BottomNavigation
            value={value}
            onChange={(e, newValue) => setValue(newValue)}
            sx={{
              background: "transparent",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <BottomNavigationAction
              component={Link}
              to="/"
              label="Home"
              value="Home"
              icon={<HomeIcon />}
            />
            <BottomNavigationAction
              label="Contact"
              value="Contact"
              icon={<SupportAgent />}
            />
          </BottomNavigation>

          {/* R */}
          <div className="d-flex align-items-center gap-2">
            <div
              onClick={toggleTheme}
              className={`theme-switch ${isDark ? "dark" : ""}`}
              role="button"
            >
              <div className="theme-switch-thumb">
                {isDark ? (
                  <i className="fa-solid fa-moon" />
                ) : (
                  <i className="fa-solid fa-sun" />
                )}
              </div>
            </div>

            <Button
              component={Link}
              to="/login"
              variant="outlined"
              size="small"
            >
              Login
            </Button>

            <Button
              component={Link}
              to="/signup"
              variant="contained"
              size="small"
            >
              Sign up
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
