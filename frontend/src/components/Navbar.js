import { AppBar, Avatar, IconButton, Toolbar, Typography } from "@mui/material";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { green } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const [avatar, setAvatar] = useState("");
  useEffect(() => {
    fetch(
      "http://127.0.0.1:5000/getUserAvatar?token=" +
        localStorage.getItem("accessToken"),
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setAvatar(data["avatar"]));
  }, []);

  return (
    <AppBar position="static">
      <Toolbar sx={{ backgroundColor: green[600] }}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="logo"
          onClick={() => navigate("/")}
        >
          <AccountBalanceWalletRoundedIcon fontSize="large" />
          <Typography variant="h6" sx={{ fontWeight: 550 }}>
            Splitify
          </Typography>
        </IconButton>
        <IconButton
          size="large"
          color="inherit"
          edge="end"
          onClick={handleLogout}
        >
          <LogoutRoundedIcon />
        </IconButton>
        <Avatar src={avatar} />
      </Toolbar>
    </AppBar>
  );
};
export default NavBar;
