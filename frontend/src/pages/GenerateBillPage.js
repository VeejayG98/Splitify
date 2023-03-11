import {
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useState } from "react";
import SplitupTable from "../components/SplitupTable";
import SplitwiseForm from "../components/SplitwiseForm";
import { BillContext } from "../context/BillContext";

function GenerateBillPage() {
  const { billName, step, setStep, participants, items, totals } =
    useContext(BillContext);
  const [commonGroups, setCommonGroups] = useState([]);
  const [splitwiseGroup, setSplitwiseGroup] = useState(null);
  const [paidBy, setPaidBy] = useState(null);
  let cost = 0;
  for (let i = 0; i < items.length; i++) {
    cost = cost + items[i][1];
  }

  const getCommonGroups = () => {
    const participantIDs = [];
    for (const participant of participants) {
      participantIDs.push(participant.id);
    }

    fetch(
      "http://127.0.0.1:5000/find_common_groups?token=" +
        localStorage.getItem("accessToken") +
        "&participants=" +
        participantIDs.join(","),
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setCommonGroups(data.common_groups));
  };

  const addExpense = () => {
    const participantIDs = [];
    for (const participant of participants) {
      participantIDs.push(participant.id);
    }
    fetch("http://127.0.0.1:5000/add_expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("accessToken"),
        description: billName,
        cost: cost,
        participants: participantIDs,
        splitwise_group: splitwiseGroup,
        paid_by: paidBy,
        splits: totals,
      }),
    });
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        padding={2}
      >
        <Card sx={{ minWidth: 650, maxWidth: 650 }}>
          <CardContent>
            <Box display="flex" alignContent="center" justifyContent="center">
              <Typography variant="h4" sx={{ fontWeight: 550 }}>
                {billName}
              </Typography>
            </Box>
            <Box display="flex" alignContent="center" justifyContent="center">
              <SplitupTable />
            </Box>
          </CardContent>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              sx={{ margin: 2 }}
              onClick={() => setStep(step - 1)}
            >
              Modify Bill
            </Button>
          </Box>
          {commonGroups.length !== 0 ? (
            <Box display="flex" flexDirection="column" margin={2}>
              <SplitwiseForm
                commonGroups={commonGroups}
                setSplitwiseGroup={setSplitwiseGroup}
                participants={participants}
                setPaidBy={setPaidBy}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ margin: 2 }}
                onClick={addExpense}
              >
                Push to Splitwise
              </Button>
            </Box>
          ) : (
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                sx={{ margin: 2 }}
                onClick={getCommonGroups}
              >
                Add to Splitwise
              </Button>
            </Box>
          )}
        </Card>
      </Box>
      {/* <Box display="flex" justifyContent="flex-end" marginBottom={10}>
        <Button
          variant="contained"
          color="primary"
          sx={{ margin: 2 }}
          onClick={addExpense}
        >
          Push to Splitwise
        </Button>
      </Box> */}
    </>
  );
}
export default GenerateBillPage;
