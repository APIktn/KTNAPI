import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AddBoxIcon from "@mui/icons-material/AddBox";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import { Link } from "react-router-dom";

export default function SidebarMenu({ showText, isMobile }) {
  return (
    <>
      {/* mobile only */}
      {isMobile && (
        <>
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/">
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                {showText && <ListItemText primary="Home" />}
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} to="/Contact">
                <ListItemIcon>
                  <SupportAgentIcon />
                </ListItemIcon>
                {showText && <ListItemText primary="Contact" />}
              </ListItemButton>
            </ListItem>
          </List>

          <Divider />
        </>
      )}

      {/* shared menu (mobile + desktop) */}
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/AdminAddProduct">
            <ListItemIcon>
              <AddBoxIcon />
            </ListItemIcon>
            {showText && <ListItemText primary="Add Product" />}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/AdminInventory">
            <ListItemIcon>
              <WarehouseIcon />
            </ListItemIcon>
            {showText && <ListItemText primary="Inventory" />}
          </ListItemButton>{" "}
        </ListItem>
      </List>
    </>
  );
}
