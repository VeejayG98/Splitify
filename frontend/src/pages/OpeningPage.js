import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import { Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import backendAPI from "../utils/network";

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
      fetch(backendAPI + "/get_access_token?code=" + code + "&state=" + state, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
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
    <div
      style={{
        backgroundColor: "#00b55c",
        color: "white",
        height: "100vh",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Typography
          sx={{ fontWeight: 700, fontSize: 36, paddingLeft: 17, paddingTop: 6 }}
        >
          Splitify
        </Typography>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 43,
            paddingLeft: 17,
            paddingTop: 28,
            width: 707,
            lineHeight: "50px",
          }}
        >
          Manage breaking down your bills efficiently.
        </Typography>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 18,
            paddingLeft: 17,
            paddingTop: 5,
            width: 518,
            lineHeight: "22px",
          }}
        >
          Easily calculate the splits of huge bills. Connect your Splitwise
          account and seamlessly add your friends into the bills, and send it
          straight to Splitwise.
        </Typography>
        <div style={{ paddingLeft: 136, paddingTop: 33 }}>
          <a href={oAuth2CodeLink} style={{ textDecoration: "None" }}>
            <Button
              variant="contained"
              color="neutral"
              sx={{ fontWeight: "bold", color: "black" }}
            >
              Login with Splitwise
            </Button>
          </a>
        </div>
      </div>
      <div>
        <img
          src="Avatar.png"
          style={{ width: 500, marginTop: 220, marginRight: 100 }}
        />
      </div>
    </div>
  );
}
export default OpeningPage;
