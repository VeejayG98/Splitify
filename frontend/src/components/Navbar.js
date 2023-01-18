import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import { green } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

const NavBar = () => {

  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar sx={{ backgroundColor: green[600] }}>
        <IconButton size="large" edge="start" color="inherit" aria-label="logo" onClick={() => navigate('/')}>
          <AccountBalanceWalletRoundedIcon fontSize="large" />
          <Typography variant="h6" sx={{ fontWeight: 550 }}>
            Splitify
          </Typography>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
export default NavBar;
