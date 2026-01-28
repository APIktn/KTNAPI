import Drawer from "@mui/material/Drawer";
import SidebarMenu from "./SidebarMenu";

export default function SidebarMobile({ open, onClose }) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant="temporary"
      anchor="left"
      ModalProps={{
        keepMounted: true,
        disableScrollLock: true,
      }}
    >
      <SidebarMenu showText isMobile />
    </Drawer>
  );
}

