import { Box, Fab } from "@mui/material";
import NavBar from "../components/Navbar";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BillContext } from "../context/BillContext";
import PageSwitcher from "./PageSwitcher";

function Home() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [participants, setParticipants] = useState(new Set());
  const [personinfo, setPersonInfo] = useState({});
  const [billName, setBillName] = useState("");
  const [items, setItems] = useState([["", 0, {}]]);
  const [numItems, setNumItems] = useState(1);
  const [totals, setTotals] = useState({});

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      console.log("Please log in");
      navigate("/");
    }
  }, []);

  return (
    <Box sx={{ height: "100vh" }}>
      <NavBar />

      <BillContext.Provider
        value={{
          step,
          setStep,
          participants,
          setParticipants,
          personinfo,
          setPersonInfo,
          billName,
          setBillName,
          items,
          setItems,
          numItems,
          setNumItems,
          totals,
          setTotals,
        }}
      >
        <PageSwitcher />
      </BillContext.Provider>
    </Box>
  );
}
export default Home;
