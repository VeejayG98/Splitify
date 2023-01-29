import { Fab, ThemeProvider } from "@mui/material";
import NavBar from "../components/Navbar";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import { green } from "@mui/material/colors";
import { createTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BillInfo from "../BillInfo";
import { BillContext } from "../context/BillContext";
import PageSwitcher from "./PageSwitcher";

function Home() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [participants, setParticipants] = useState([]);
  const [name, setName] = useState("");
  const [billName, setBillName] = useState("");
  const [items, setItems] = useState([["", 0, {}]]);
  const [numItems, setNumItems] = useState(1);
  const [totals, setTotals] = useState({});

  const theme = createTheme({
    palette: {
      primary: {
        main: green[600],
      },
    },
  });

  return (
    <div>
      <NavBar />
      <ThemeProvider theme={theme}>
        <Fab
          variant="extended"
          aria-label="add bill"
          color="primary"
          sx={{ position: "fixed", bottom: "20px", right: "20px" }}
          onClick={() => {}}
        >
          <ReceiptLongRoundedIcon sx={{ mr: 1 }} />
          New Bill
        </Fab>
        <BillContext.Provider
          value={{
            step,
            setStep,
            participants,
            setParticipants,
            name,
            setName,
            billName,
            setBillName,
            items,
            setItems,
            numItems,
            setNumItems,
            totals, 
            setTotals
          }}
        >
          <PageSwitcher />
        </BillContext.Provider>
      </ThemeProvider>
    </div>
  );
}
export default Home;
