import {
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useContext, useEffect } from "react";
import { BillContext } from "../context/BillContext";

function ItemBox({ id }) {
  const { participants, items, setItems } = useContext(BillContext);

  const handleItemNameChange = (event) => {
    let tempItems = items;
    let index = event.currentTarget.id;

    tempItems[index][0] = event.currentTarget.value;
    setItems(tempItems);
  };

  const handleItemBillChange = (event) => {
    let tempItems = items;
    let index = event.currentTarget.id;

    tempItems[index][1] = Number(event.currentTarget.value);
    setItems(tempItems);
  };

  return (
    <Paper
      sx={{
        minWidth: 450,
        alignContent: "center",
        justifyContent: "center",
      }}
    >
      <Grid
        container
        direction="column"
        alignContent="center"
        justifyContent="center"
        marginTop={2}
      >
        <Grid item alignContent="center" justifyContent="center" marginTop={2}>
          <TextField
            label="Item name"
            variant="filled"
            required
            color="primary"
            onChange={handleItemNameChange}
            id={`${id}`}
          />
        </Grid>
        <Grid item alignContent="center" justifyContent="center" marginTop={2}>
          <TextField
            label="Item price"
            variant="filled"
            required
            color="primary"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            onChange={handleItemBillChange}
            id={`${id}`}
          />
        </Grid>
        <Grid item>
          <Grid container direction="row" margin={3}>
            {participants.map((participant, id) => (
              <Grid item key={id} marginRight={2}>
                <FormControlLabel control={<Checkbox />} label={participant} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
export default ItemBox;
