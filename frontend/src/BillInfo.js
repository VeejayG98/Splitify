import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { useContext, useState } from "react";
import { BillContext } from "./context/BillContext";
import { Box } from "@mui/system";

function BillInfo() {
  const {
    step,
    setStep,
    participants,
    setParticipants,
    name,
    setName,
    billName,
    setBillName,
  } = useContext(BillContext);

  const addItems = () => {
    if (name.length !== 0) {
      setParticipants((oldParticipants) => {
        oldParticipants.add(name);
        return oldParticipants;
      })
      setName("");
    }
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
              <Typography variant="h4" sx={{ fontWeight: 550 }}>
                Create a bill
              </Typography>
            </Grid>
            <Grid item marginTop={2}>
              <TextField
                label="Bill Name"
                variant="filled"
                required
                color="success"
                onChange={(e) => setBillName(e.target.value)}
                defaultValue={billName}
              />
            </Grid>
          </Grid>

          <Grid
            container
            direction="column"
            alignContent="center"
            justifyContent="center"
            padding={2}
            marginTop={2}
          >
            <Grid item>
              <Typography
                variant="h5"
                sx={{ fontWeight: 550, marginBottom: "5px" }}
              >
                Add participants
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                label="Participant Name"
                variant="filled"
                required
                color="success"
                onChange={(e) => setName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleRoundedIcon />
                    </InputAdornment>
                  ),
                }}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    addItems();
                    setName("");
                  }
                }}
                value={name}
              />
            </Grid>
            <Grid item marginTop={2}>
              <Button variant="contained" color="primary" onClick={addItems}>
                Add
              </Button>
            </Grid>
            <Grid item>
              {[...participants].map((participant, id) => (
                <Grid
                  container
                  marginTop={1}
                  alignContent="center"
                  justifyContent="left"
                  key={id}
                >
                  <Grid item>
                    <AccountCircleRoundedIcon />
                  </Grid>
                  <Grid item>
                    <Typography variant="h7">{participant}</Typography>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </CardContent>
        <Box margin={1} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            sx={{ height: 40 }}
            onClick={() => setStep(step + 1)}
          >
            Next
          </Button>
        </Box>
      </Card>
    </Grid>
  );
}
export default BillInfo;
