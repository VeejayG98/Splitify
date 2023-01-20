import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import PersonIcon from "@mui/icons-material/Person";
import { useContext, useState } from "react";
import { BillContext } from "./context/BillContext";
import { Box } from "@mui/system";

function BillInfo() {
  const {
    participants,
    setParticipants,
    name,
    setName,
    billName,
    setBillName,
  } = useContext(BillContext);

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
            <Grid item>
              <TextField
                label="Bill Name"
                variant="standard"
                required
                color="success"
                onChange={(e) => setBillName(e.target.value)}
              />
            </Grid>
          </Grid>

          <Grid
            container
            direction="column"
            alignContent="center"
            justifyContent="center"
            padding={2}
            marginTop={5}
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
                variant="standard"
                required
                color="success"
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item marginTop={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => {
                  if (name.length !== 0)
                    setParticipants([...participants, name]);
                }}
              >
                Add
              </Button>
            </Grid>
            <Grid item>
              {participants.map((participant, id) => (
                <Grid
                  container
                  marginTop={1}
                  alignContent="center"
                  justifyContent="left"
                  key={id}
                >
                  <Grid item>
                    <PersonIcon />
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
          <Button variant="contained" color="primary" sx={{ height: 40 }}>
            Next
          </Button>
        </Box>
      </Card>
    </Grid>
  );
}
export default BillInfo;
