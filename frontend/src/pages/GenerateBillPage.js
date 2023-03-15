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
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SplitupTable from "../components/SplitupTable";
import SplitwiseForm from "../components/SplitwiseForm";
import { BillContext } from "../context/BillContext";
import backendAPI from "../utils/network";

function GenerateBillPage() {
  const { billName, step, setStep, participants, items, totals } =
    useContext(BillContext);
  const [commonGroups, setCommonGroups] = useState([]);
  const [splitwiseGroup, setSplitwiseGroup] = useState(null);
  const [paidBy, setPaidBy] = useState(null);
  const [expenseDate, setExpenseDate] = useState(null);
  const navigate = useNavigate();

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
      backendAPI +
        "/find_common_groups?token=" +
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

  const addExpense = async () => {
    const participantIDs = [];
    for (const participant of participants) {
      participantIDs.push(participant.id);
    }
    const response = await fetch(backendAPI + "/add_expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("accessToken"),
        description: billName,
        cost: cost,
        date: expenseDate,
        participants: participantIDs,
        splitwise_group: splitwiseGroup,
        paid_by: paidBy,
        splits: totals,
      }),
    });
    const expense_info = await response.json();

    const participantNames = [];
    for (const participant of participants) {
      participantNames.push(participant.first_name + participant.last_name);
    }

    console.log(items);
    await fetch(backendAPI + "/add_comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("accessToken"),
        expenseID: expense_info["id"],
        participants: [...participants],
        items: items,
      }),
    });
    navigate("/success?groupId=" + splitwiseGroup);
  };

  useEffect(() => {
    console.log(expenseDate);
  }, [expenseDate]);

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        padding={2}
      >
        <Card sx={{ minWidth: 650 }}>
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
                setExpenseDate={setExpenseDate}
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
