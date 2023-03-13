import { Button, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const [splitwiseLink, setSplitwiseLink] = useState(
    "https://secure.splitwise.com/#/groups/"
  );
  const navigate = useNavigate();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const groupId = urlParams.get("groupId");
    setSplitwiseLink(splitwiseLink + groupId);
  }, []);

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
        <div onClick={() => navigate("/")}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 36,
              paddingLeft: 17,
              paddingTop: 6,
            }}
          >
            Splitify
          </Typography>
        </div>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 40,
            paddingLeft: 17,
            paddingTop: 28,
            width: 707,
            lineHeight: "50px",
          }}
        >
          Success! The bill was pushed to Splitwise!
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
          View the bill on Splitwise.
        </Typography>
        <div style={{ paddingLeft: 136, paddingTop: 33 }}>
          <a
            href={splitwiseLink}
            target="_blank"
            style={{ textDecoration: "None" }}
          >
            <Button
              variant="contained"
              color="neutral"
              sx={{ fontWeight: "bold", color: "black" }}
            >
              Go to Splitwise
            </Button>
          </a>
        </div>
      </div>
      <div>
        <img
          src="SuccessAvatar.png"
          style={{ width: 500, marginTop: 220, marginRight: 100 }}
        />
      </div>
    </div>
  );
}
