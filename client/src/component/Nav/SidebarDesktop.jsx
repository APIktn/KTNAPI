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

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "isNavbarSticky",
})(({ theme, open, isNavbarSticky }) => ({
  "& .MuiDrawer-paper": {
    top: isNavbarSticky ? "80px" : "100px",
    left: "1.5rem",
    bottom: "1rem",
    height: "auto",
    borderRadius: "16px",
    transition: theme.transitions.create(["top", "width"], {
      duration: 300,
      easing: theme.transitions.easing.easeInOut,
    }),
    ...(open ? openedMixin(theme) : closedMixin(theme)),
  },
}));

export default function SidebarDesktop({ isOpen, isNavbarSticky }) {
  return (
    <Drawer variant="permanent" open={isOpen} isNavbarSticky={isNavbarSticky}>
      <SidebarMenu showText={isOpen} />
    </Drawer>
  );
}
