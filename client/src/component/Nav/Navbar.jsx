import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import SupportAgent from "@mui/icons-material/SupportAgent";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import ButtonBase from "@mui/material/ButtonBase";

import { useTheme } from "../../context/Theme";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppModal from "../Modal/AppModal";

function Navbar({ onToggleSidebar, onStickyChange }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const isDark = theme === "dark";

  const [isSticky, setIsSticky] = useState(false);
  const [value, setValue] = useState("Home");

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  /* ---------- logout confirm ---------- */
  const [openLogout, setOpenLogout] = useState(false);

  const STICKY_OFFSET = 80;

  useEffect(() => {
    const onScroll = () => {
      const sticky = window.scrollY >= STICKY_OFFSET;
      setIsSticky(sticky);
      onStickyChange?.(sticky);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onStickyChange]);

  const handleOpenMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  /* avatarSrc */
  const avatarSrc = user?.imageUpload || user?.imageProfile;

  return (
    <div className={isSticky ? "navbar-placeholder" : "pt-3 mx-4"}>
      <nav
        className={`navbar bg-body-tertiary ${
          isSticky ? "navbar-fixed" : "border rounded-4"
        }`}
      >
        <div className="container d-flex align-items-center justify-content-between">
          {/* left */}
          <button
            className="btn btn-outline-secondary"
            onClick={onToggleSidebar}
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          {/* center */}
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
              component={Link}
              to="/contact"
              label="Contact"
              value="Contact"
              icon={<SupportAgent />}
            />
          </BottomNavigation>

          {/* right */}
          <div className="d-flex align-items-center gap-2">
            {/* theme */}
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

            {/* auth */}
            {user ? (
              <>
                {/* avatar + name */}
                <ButtonBase
                  onClick={handleOpenMenu}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    borderRadius: 2,
                    px: 0.5,
                  }}
                >
                  <Avatar
                    src={avatarSrc}
                    alt={user.displayName}
                    sx={{ width: 32, height: 32 }}
                  />
                  <span className="fw-medium d-none d-md-inline">
                    {user.displayName}
                  </span>
                </ButtonBase>

                {/* dropdown */}
                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleCloseMenu}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleCloseMenu}
                  >
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    profile
                  </MenuItem>

                  <Divider />

                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      setOpenLogout(true);
                    }}
                  >
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  size="small"
                >
                  login
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  size="small"
                >
                  sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* modal*/}
      <AppModal
        open={openLogout}
        mode="confirm"
        type="warning"
        title="logout"
        message="are you sure you want to logout?"
        confirmText="logout"
        cancelText="cancel"
        onConfirm={() => {
          setOpenLogout(false);
          logout();
        }}
        onCancel={() => setOpenLogout(false)}
        onClose={() => setOpenLogout(false)}
      />
    </div>
  );
}

export default Navbar;
