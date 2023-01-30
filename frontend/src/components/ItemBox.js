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

const ItemBox = ({ id }) => {
  const { participants, items, setItems } = useContext(BillContext);

  const updateSplit = () => {
    if (Object.keys(items[id][2]).length !== 0){
      let newCost = items[id][1] / Object.keys(items[id][2]).length;
      let newSplit = Object.fromEntries(Object.keys(items[id][2]).map((key) => [key, newCost]));
      console.log(newSplit);
      const res = [...items];
      res[id][2] = newSplit;
      console.log(res);
      setItems(res);
    }
  }

  const handleCheckBox = (event) => {
    if (event.target.checked) {
      setItems((items) => {
        let currentSplit = items[id][2];
        let newCost = items[id][1] / (Object.keys(currentSplit).length + 1);
        const newSplit = {
          ...Object.fromEntries(
            Object.keys(currentSplit).map((key) => [key, newCost])
          ),
          [event.target.id]: newCost,
        };
        const res = [...items];
        res[id][2] = newSplit;
        return res;
        // })
      });
    } else {
      setItems((items) => {
        let currentSplit = items[id][2];
        let newCost = items[id][1] / (Object.keys(currentSplit).length - 1);
        const { [event.target.id]: removedProperty, ...rest } = currentSplit;
        const newSplit = Object.fromEntries(
          Object.keys(rest).map((key) => [key, newCost])
        );
        const res = [...items];
        res[id][2] = newSplit;
        return res;
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
        <Grid item display="flex" alignContent="center" justifyContent="center" marginTop={2}>
          <TextField
            label="Item name"
            variant="filled"
            required
            color="primary"
            onChange={handleItemNameChange}
            id={`${id}`}
            defaultValue={items[id][0]}
          />
        </Grid>
        <Grid item display="flex" alignContent="center" justifyContent="center" marginTop={2}>
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
            onChange={(event) => {
              handleItemBillChange(event);
              updateSplit();
            }}
            id={`${id}`}
            defaultValue={items[id][1]}
          />
        </Grid>
        <Grid item>
          <Grid container direction="row" margin={3}>
            {[...participants].map((participant, pid) => (
              <Grid item key={pid} marginRight={2}>
                <FormControlLabel
                  control={
                    <Checkbox id={participant} onChange={handleCheckBox} checked={items[id][2].hasOwnProperty(participant)}/>
                  }
                  label={participant}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      {Object.keys(items[id][2]).map((key) => {
        return (
          <Typography variant="h6" key={key}>
            {key}: {items[id][2][key]}
          </Typography>
        );
      })}
    </Paper>
  );
}
export default ItemBox;
