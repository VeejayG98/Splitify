import {
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { BillContext } from "../context/BillContext";

function ItemBox({ id }) {
  const { participants, items, setItems } = useContext(BillContext);
  const [selectedCheckBoxes, setSelectedCheckBoxes] = useState({});

  useEffect(() => {
    console.log(selectedCheckBoxes);
  }, [selectedCheckBoxes]);

  const handleCheckBox = (event) => {
    if (event.target.checked) {
      setSelectedCheckBoxes((selectedCheckBoxes) => {
        let newCost =
          items[id][1] / (Object.keys(selectedCheckBoxes).length + 1);
        const res = {
          ...Object.fromEntries(
            Object.keys(selectedCheckBoxes).map((key) => [key, newCost])
          ),
          [event.target.id]: newCost,
        };
        return res;
        // })
      });
    } else {
      setSelectedCheckBoxes((selectedCheckBoxes) => {
        let newCost =
          items[id][1] / (Object.keys(selectedCheckBoxes).length - 1);
        const { [event.target.id]: removedProperty, ...rest } =
          selectedCheckBoxes;
        return Object.fromEntries(
          Object.keys(rest).map((key) => [key, newCost])
        );
      });
    }
  };

  const handleItemNameChange = (event) => {
    let index = event.currentTarget.id;
    setItems((items) => {
      const tempItems = [...items];
      tempItems[index][0] = event.currentTarget.value;
      return tempItems;
    });
  };

  const handleItemBillChange = (event) => {
    let index = event.currentTarget.id;
    setItems((items) => {
      const tempItems = [...items];
      tempItems[index][1] = Number(event.currentTarget.value);
      return tempItems;
    });
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
                <FormControlLabel
                  control={
                    <Checkbox id={participant} onChange={handleCheckBox} />
                  }
                  label={participant}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      {Object.keys(selectedCheckBoxes).map((key) => {
        return (
          <Typography variant="h6" key={key}>
            {key}
          </Typography>
        );
      })}
    </Paper>
  );
}
export default ItemBox;
