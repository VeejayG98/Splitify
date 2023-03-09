import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import { Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OpeningPage() {
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (localStorage.getItem("accessToken")) {
      const time = new Date().getTime();
      if (time - localStorage.getItem("accessTokenTime") > 24 * 60 * 1000) {
        localStorage.clear();
      } else {
        navigate("/home");
      }
    }

    if (code && state) {
      fetch(
        "http://127.0.0.1:5000/get_access_token?code=" +
          code +
          "&state=" +
          state,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
        .then((res) => res.json())
        // .then((data) => console.log(data));
        .then((data) => {
          localStorage.setItem("accessToken", data["access_token"]);
          const time = new Date().getTime();
          localStorage.setItem("accessTokenTime", time);
          setAccessToken(data["access_token"]);
        });
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) navigate("/home");
  }, [accessToken]);

  const oAuth2CodeLink = `https://secure.splitwise.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&state=SPLITIFY_APP`;
  return (
    <div>
      <Grid
        container
        sx={{ margin: 10 }}
        direction="column"
        display="flex"
        justifyContent="center"
        alignContent="center"
      >
        <Grid item marginLeft={10}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <AccountBalanceWalletRoundedIcon sx={{ fontSize: 100 }} />
            <Typography sx={{ fontWeight: 550, fontSize: 70 }}>
              Splitify
            </Typography>
          </div>
        </Grid>

        <Grid item>
          <p style={{ fontSize: 30, fontWeight: "bold" }}>
            Manage breaking down your bills efficiently.
          </p>
          <p style={{ fontSize: 20, marginTop: 50 }}>
            Easily calculate the splits of huge bills. Connect your Splitwise
            account and seamlessly add your friends into the bills, and send it
            straight to Splitwise.
          </p>
          <a href={oAuth2CodeLink} style={{ textDecoration: "None" }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              Login with Splitwise
            </Button>
          </a>
        </Grid>
      </Grid>
    </div>
  );
}
export default OpeningPage;
