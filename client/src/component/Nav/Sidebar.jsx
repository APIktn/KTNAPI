import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width"),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  width: theme.spacing(7),
  transition: theme.transitions.create("width"),
  overflowX: "hidden",
});

const paperBase = (theme, isNavbarSticky) => ({
  top: isNavbarSticky ? "80px" : "100px",
  left: "1.5rem",
  bottom: "1rem",
  height: "auto",
  borderRadius: "16px",
  transition: theme.transitions.create(["top", "width"], {
    duration: 300,
    easing: theme.transitions.easing.easeInOut,
  }),
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "isNavbarSticky",
})(({ theme, open, isNavbarSticky }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  "& .MuiDrawer-paper": {
    ...paperBase(theme, isNavbarSticky),
    ...(open ? openedMixin(theme) : closedMixin(theme)),
  },
}));

export default function Sidebar({ isOpen, isNavbarSticky }) {
  const theme = useTheme();

  return (
    <Drawer variant="permanent" open={isOpen} isNavbarSticky={isNavbarSticky}>
      <Divider />
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              {isOpen && <ListItemText primary={text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
