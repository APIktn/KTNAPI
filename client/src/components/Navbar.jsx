import * as React from "react";

// component
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

// icon
import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import ApiIcon from "@mui/icons-material/Api";
import SupportAgent from "@mui/icons-material/SupportAgent";

// image
import NavBg from "../assets/Design/Image/navi_bg.png";

export default function Navbar() {
  const [value, setValue] = React.useState("recents");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <nav style={{ padding: "10px" }}>
      <Paper
        elevation={3}
        sx={{
          backgroundImage: `url(${NavBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "16px",
        }}
        className="flex items-center justify-between px-4 py-2"
      >
        <div className="flex items-center gap-2 text-white font-bold cursor-pointer">
          <ApiIcon />
          <span>APIKTN</span>
        </div>

        <BottomNavigation
          value={value}
          onChange={handleChange}
          showLabels={false}
          sx={{
            backgroundColor: "transparent",

            "& .MuiBottomNavigationAction-root": {
              color: "#aaa",
              minWidth: 120,
            },
          }}
        >
          <BottomNavigationAction
            label="Home"
            value="home"
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            label="Smart Tools"
            value="tools"
            icon={<CategoryIcon />}
          />
          <BottomNavigationAction
            label="Contact Me"
            value="contact"
            icon={<SupportAgent />}
          />
        </BottomNavigation>

        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="small"
            className="!text-white !border-zinc-600"
          >
            LOGIN
          </Button>

          <Button
            variant="contained"
            size="small"
            className="!bg-white !text-black"
          >
            SIGN UP
          </Button>
        </div>
      </Paper>
    </nav>
  );
}
