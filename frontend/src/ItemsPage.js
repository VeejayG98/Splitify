import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import { Box } from "@mui/system";
import { useContext, useEffect, useState } from "react";
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
  } = useContext(BillContext);

  const [numItems, setNumItems] = useState(1);

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
            <Button
              variant="contained"
              onClick={() => {
                setNumItems(numItems + 1);
                setItems([...items, ["", 0]]);
              }}
            >
              Add Item
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}
export default ItemsPage;
