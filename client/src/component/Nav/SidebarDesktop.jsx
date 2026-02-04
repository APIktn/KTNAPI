import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import SidebarMenu from "./SidebarMenu";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  width: theme.spacing(7),
  overflowX: "hidden",
});

// เช็ค open sticky footer animate
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) =>
    prop !== "open" &&
    prop !== "isNavbarSticky" &&
    prop !== "isFooterVisible" &&
    prop !== "animateBorder",
})(
  ({ theme, open, isNavbarSticky, isFooterVisible, animateBorder }) => {
    const isDark = theme.palette.mode === "dark";

    // default
    const baseBorderColor = isDark
      ? "rgba(255,255,255,0.15)"
      : "rgba(0,0,0,0.15)";

    // animate
    const activeBorderColor = isDark
      ? "rgba(255,255,255,0.5)"
      : "rgba(0,0,0,0.35)";

    return {
      "& .MuiDrawer-paper": {
        top: isNavbarSticky ? "80px" : "93px",
        bottom: isFooterVisible ? "78px" : "1rem",
        left: "1.5rem",
        height: "auto",

        backgroundColor: isDark
          ? "rgb(33, 37, 41)"
          : theme.palette.background.paper,

        border: "1px solid transparent",
        borderRadius: "16px",

        borderColor: animateBorder
          ? activeBorderColor
          : baseBorderColor,

        transition: theme.transitions.create(
          ["top", "width", "bottom", "border-color"],
          {
            duration: 300,
            easing: theme.transitions.easing.easeInOut,
          }
        ),

        ...(open ? openedMixin(theme) : closedMixin(theme)),
      },
    };
  }
);

export default function SidebarDesktop({
  isOpen,
  isNavbarSticky,
  isFooterVisible,
  animateBorder,
  onMouseEnter,
  onMouseLeave,
}) {
  return (
    <Drawer
      variant="permanent"
      open={isOpen}
      isNavbarSticky={isNavbarSticky}
      isFooterVisible={isFooterVisible}
      animateBorder={animateBorder}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <SidebarMenu showText={isOpen} />
    </Drawer>
  );
}

