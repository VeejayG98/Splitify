import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import { Box } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import ErrorSnackBar from "../components/ErrorSnackBar";
import ItemBox from "../components/ItemBox";
import { BillContext } from "../context/BillContext";

function ItemsPage() {
  const {
    step,
    setStep,
    billName,
    setBillName,
    participants,
    items,
    setItems,
    numItems,
    setNumItems,
    totals,
    setTotals,
  } = useContext(BillContext);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const closeSnackBar = (event, reason) => {
    setOpenSnackbar(false);
  };

  const addNewItem = () => {
    const lastItem = items[numItems - 1];

    if (
      lastItem[0] === "" ||
      lastItem[1] === 0 ||
      Object.keys(lastItem[2]).length === 0
    ) {
      setErrorMessage("Please fill in the details of the last item");
      setOpenSnackbar(true);
      return;
    }

    setNumItems(numItems + 1);
    setItems([...items, ["", 0, {}]]);
  };

  const deleteItem = (event) => {
    if (items.length === 1) {
      setErrorMessage("There has to be a minimum of one item in the bill");
      setOpenSnackbar(true);
      return;
    }
    const id = Number(event.currentTarget.id);
    setNumItems(numItems - 1);
    setItems(items.filter((_, i) => i !== id));
  };

  const generateBill = () => {
    const lastItem = items[numItems - 1];
    if (
      lastItem[0] === "" ||
      lastItem[1] === 0 ||
      Object.keys(lastItem[2]).length === 0
    ) {
      setErrorMessage("Please fill in the details of the last item");
      setOpenSnackbar(true);
      return;
    }
    calculateTotals();
    setStep(step + 1);
  };

  const calculateTotals = () => {
    let tempTotals = Object.fromEntries(
      [...participants].map((participant) => [participant.id, 0])
    );
    console.log(items);
    for (let x in items) {
      for (const participant of participants) {
        if (items[x][2].hasOwnProperty(participant.first_name))
          tempTotals[participant.id] += items[x][2][participant.first_name];
        tempTotals[participant.id] = Number(
          tempTotals[participant.id].toFixed(2)
        );
      }
    }
    const totals = Object.values(tempTotals).reduce(
      (totalPrice, price) => totalPrice + price,
      0
    );
    setTotals({ ...tempTotals, totalPrice: totals });
  };

  return (
    <Grid
      container
      alignContent="center"
      justifyContent="center"
      padding={2}
      color={green[600]}
    >
      <Card sx={{ minWidth: 650, maxWidth: 650 }} elevation={5}>
        <CardContent>
          <Grid
            container
            direction="column"
            alignContent="center"
            justifyContent="center"
          >
            <Grid item>
              <Typography variant="h3" sx={{ fontWeight: 550 }}>
                {billName}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4" sx={{ fontWeight: 550, marginTop: 5 }}>
                Add items
              </Typography>
            </Grid>
          </Grid>

          {/* Items component */}

          <Grid
            container
            direction="column"
            alignContent="center"
            justifyContent="center"
          >
            {Array.from({ length: numItems }, (_, id) => {
              return (
                <Grid item key={id}>
                  <ItemBox id={id} key={id} deleteItem={deleteItem} />
                </Grid>
              );
            })}
          </Grid>

          <Box display="flex" justifyContent="flex-end" marginTop={3}>
            <Button variant="contained" onClick={addNewItem}>
              Add Item
            </Button>
          </Box>
        </CardContent>

        {/* Code for Next and Previous Button -- IN PROGRESS */}

        <Box display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            color="primary"
            sx={{ height: 40, margin: 2 }}
            onClick={() => setStep(step - 1)}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ height: 40, margin: 2 }}
            onClick={generateBill}
          >
            Generate Bill
          </Button>
        </Box>
        <ErrorSnackBar
          open={openSnackbar}
          message={errorMessage}
          handleClose={closeSnackBar}
        />
      </Card>
    </Grid>
  );
}
export default ItemsPage;
