import {
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import { BillContext } from "../context/BillContext";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

const ItemBox = ({ id, deleteItem }) => {
  const { participants, items, setItems } = useContext(BillContext);
  const [nameError, setNameError] = useState(false);
  const [priceError, setPriceError] = useState(false);

  const getSplitDiff = (splitValue, n, itemCost) => {
    return Number((itemCost - splitValue * n).toFixed(2));
  };

  const getRandomParticipant = (participants) => {
    return participants[Math.floor(Math.random() * participants.length)];
  };

  const getRandomParticipants = (participants, n) => {
    if (n > participants.length) {
      throw new Error("n cannot be greater than array length");
    }

    const result = [];
    const usedIndices = new Set();

    while (result.length < n) {
      const index = Math.floor(Math.random() * participants.length);

      if (!usedIndices.has(index)) {
        usedIndices.add(index);
        result.push(participants[index]);
      }
    }
    return result;
  };

  const adjustSplit = (participants, newSplit, splitDiff) => {
    if (participants.length !== 0) {
      splitDiff = Number((splitDiff / participants.length).toFixed(2));
      for (let i = 0; i < participants.length; i++) {
        newSplit[participants[i]] += splitDiff;
        newSplit[participants[i]] = Number(
          newSplit[participants[i]].toFixed(2)
        );
      }
    }
  };

  const updateSplit = () => {
    if (Object.keys(items[id][2]).length !== 0) {
      let newCost = items[id][1] / Object.keys(items[id][2]).length;
      newCost = Number(newCost.toFixed(2));
      const splitDiff = getSplitDiff(
        newCost,
        Object.keys(items[id][2]).length,
        items[id][1]
      );
      let newSplit = Object.fromEntries(
        Object.keys(items[id][2]).map((key) => [key, newCost])
      );

      const randomParticipants = getRandomParticipants(
        Object.keys(newSplit),
        Math.abs(splitDiff * 100)
      );

      adjustSplit(randomParticipants, newSplit, splitDiff);

      const res = [...items];
      res[id][2] = newSplit;
      setItems(res);
    }
  };

  const selectAll = () => {
    let newCost = items[id][1] / participants.size;
    newCost = Number(newCost.toFixed(2));
    const splitDiff = getSplitDiff(newCost, participants.size, items[id][1]);
    let newSplit = Object.fromEntries(
      [...participants].map((key) => [key.id, newCost])
    );
    const randomParticipants = getRandomParticipants(
      Object.keys(newSplit),
      Math.abs(splitDiff * 100)
    );

    adjustSplit(randomParticipants, newSplit, splitDiff);

    const res = [...items];
    res[id][2] = newSplit;
    setItems(res);
  };

  const unselectAll = () => {
    let newSplit = {};
    const res = [...items];
    res[id][2] = newSplit;
    setItems(res);
  };

  const handleCheckBox = (event) => {
    if (event.target.checked) {
      setItems((items) => {
        let currentSplit = items[id][2];
        let newCost = items[id][1] / (Object.keys(currentSplit).length + 1);
        newCost = Number(newCost.toFixed(2));
        const splitDiff = getSplitDiff(
          newCost,
          Object.keys(currentSplit).length + 1,
          items[id][1]
        );
        const newSplit = {
          ...Object.fromEntries(
            Object.keys(currentSplit).map((key) => [key, newCost])
          ),
          [event.target.id]: newCost,
        };

        const randomParticipants = getRandomParticipants(
          Object.keys(newSplit),
          Math.abs(splitDiff * 100)
        );

        adjustSplit(randomParticipants, newSplit, splitDiff);

        const res = [...items];
        res[id][2] = newSplit;
        return res;
      });
    } else {
      setItems((items) => {
        let currentSplit = items[id][2];
        let newCost = items[id][1] / (Object.keys(currentSplit).length - 1);
        newCost = Number(newCost.toFixed(2));
        const splitDiff = getSplitDiff(
          newCost,
          Object.keys(currentSplit).length - 1,
          items[id][1]
        );
        const { [event.target.id]: removedProperty, ...rest } = currentSplit;
        const newSplit = Object.fromEntries(
          Object.keys(rest).map((key) => [key, newCost])
        );

        const randomParticipants = getRandomParticipants(
          Object.keys(newSplit),
          Math.abs(splitDiff * 100)
        );

        adjustSplit(randomParticipants, newSplit, splitDiff);

        const res = [...items];
        res[id][2] = newSplit;
        return res;
      });
    }
  };

  const handleItemNameChange = (event) => {
    let itemName = event.currentTarget.value;
    if (itemName === "") setNameError(true);
    else setNameError(false);
    setItems((items) => {
      const tempItems = [...items];
      tempItems[id][0] = itemName;
      return tempItems;
    });
  };

  const handleItemBillChange = (event) => {
    let itemCost = Number(event.currentTarget.value);
    if (itemCost === 0) setPriceError(true);
    else setPriceError(false);
    setItems((items) => {
      const tempItems = [...items];
      tempItems[id][1] = itemCost;
      return tempItems;
    });
  };

  const handleBillFocus = (event) => {
    event.target.select();
    let itemCost = Number(event.currentTarget.value);
    if (itemCost === 0) setPriceError(true);
    else setPriceError(false);
  };

  return (
    <Paper
      key={id}
      sx={{
        minWidth: 450,
        alignContent: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Grid
        display="flex"
        container
        direction="column"
        alignContent="center"
        justifyContent="center"
        marginTop={2}
      >
        <Grid
          item
          display="flex"
          alignContent="center"
          justifyContent="center"
          marginTop={2}
        >
          <TextField
            key={id}
            label="Item name"
            variant="outlined"
            required
            color="primary"
            error={nameError}
            helperText={nameError ? "Enter a name for the item" : ""}
            onChange={handleItemNameChange}
            onFocus={handleItemNameChange}
            id={`${id}`}
            value={items[id][0]}
          />
        </Grid>
        <Grid
          item
          display="flex"
          alignContent="center"
          justifyContent="center"
          marginTop={2}
        >
          <TextField
            label="Item price"
            variant="outlined"
            type="number"
            onWheel={(e) => e.target.blur()}
            required
            color="primary"
            error={priceError}
            helperText={priceError ? "Enter a valid price" : ""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            onChange={(event) => {
              handleItemBillChange(event);
              updateSplit();
            }}
            onFocus={handleBillFocus}
            id={`${id}`}
            value={items[id][1]}
          />
        </Grid>
        <Grid item>
          <Grid container direction="row" margin={3}>
            {[...participants].map((participant, pid) => (
              <Grid item key={pid} marginRight={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id={`${participant.id}`}
                      onChange={handleCheckBox}
                      checked={items[id][2].hasOwnProperty(participant.id)}
                    />
                  }
                  label={participant.first_name}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="flex-start">
        <Button
          variant="outlined"
          color="primary"
          sx={{ margin: 2 }}
          onClick={selectAll}
        >
          Select all
        </Button>
      </Box>

      <Box display="flex" justifyContent="flex-start">
        <Button
          variant="outlined"
          color="primary"
          sx={{ marginLeft: 2, marginBottom: 2 }}
          onClick={unselectAll}
        >
          Unselect all
        </Button>
      </Box>
      <Box display="flex" position="absolute" top={4} right={4}>
        <IconButton id={id} onClick={deleteItem}>
          <DeleteRoundedIcon />
        </IconButton>
      </Box>

      {/* {Object.keys(items[id][2]).map((key) => {
        return (
          <Typography variant="h6" key={key}>
            {key}: {items[id][2][key]}
          </Typography>
        );
      })} */}
    </Paper>
  );
};
export default ItemBox;
