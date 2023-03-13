import { AppBar, Avatar, IconButton, Toolbar, Typography } from "@mui/material";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { green } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";

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
    <AppBar position="static" color="primary">
      <Toolbar >
        <Box display="flex" justifyContent="space-between" width="100%">
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

          <Box display="flex" flexDirection="row" alignItems="center" sx={{}}>
            <Avatar src={avatar} sx={{marginRight: 1}}/>
            <IconButton
              size="large"
              color="inherit"
              edge="end"
              onClick={handleLogout}
            >
              <LogoutRoundedIcon />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default NavBar;
