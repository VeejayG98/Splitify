import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import { Box } from "@mui/system";
import { useContext, useState } from "react";
import ItemBox from "./components/ItemBox";
import { BillContext } from "./context/BillContext";

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
    setNumItems
  } = useContext(BillContext);


  const addNewItem = () => {
    setNumItems(numItems + 1);
    setItems([...items, ["", 0, {}]]);
  };

  return (
    <Grid
      container
      alignContent="center"
      justifyContent="center"
      padding={2}
      color={green[600]}
    >
      <Card sx={{ minWidth: 650 }}>
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
                  <ItemBox id={id} />
                </Grid>
              );
            })}

            {/* <Grid item>
              <ItemBox />
            </Grid> */}
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
            onClick={() => setStep(step + 1)}
          >
            Next
          </Button>
        </Box>
      </Card>
    </Grid>
  );
}
export default ItemsPage;
