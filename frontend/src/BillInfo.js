import {
  Autocomplete,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { useContext, useEffect, useState } from "react";
import { BillContext } from "./context/BillContext";
import { Box } from "@mui/system";
import AutofillFriends from "./components/AutofillFriends";

function BillInfo() {
  const [friends, setFriends] = useState([]);

  const {
    step,
    setStep,
    participants,
    setParticipants,
    personinfo,
    setPersonInfo,
    billName,
    setBillName,
  } = useContext(BillContext);

  const [test, setTest] = useState("");

  useEffect(() => {
    fetch(
      "http://127.0.0.1:5000/getParticipants?token=" +
        localStorage.getItem("accessToken") +
        "&search=" +
        personinfo,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setFriends(data.friends));
  }, []);

  const addParticipant = () => {
    if (personinfo.length !== 0) {
      setParticipants((oldParticipants) => {
        console.log(personinfo);
        // let first_name = name.first_name;
        // let [first_name] = name;
        // console.log([first_name]);
        oldParticipants.add(personinfo);
        return oldParticipants;
      });
      setPersonInfo("");
    }
  };

  const deleteParticipant = (event) => {
    const id = Number(event.currentTarget.id);
    let deletedParticipant;
    for (const participant of participants) {
      console.log(participant.id);
      if (participant.id === id) {
        deletedParticipant = participant;
        break;
      }
    }

    setParticipants((oldParticipants) => {
      oldParticipants = new Set([...oldParticipants]);
      oldParticipants.delete(deletedParticipant);
      console.log(oldParticipants);
      return oldParticipants;
    });
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
              <AutofillFriends
                friends={friends}
                setPersonInfo={setPersonInfo}
                addParticipant={addParticipant}
              />

              {/* <TextField
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
                    addParticipant();
                    setName("");
                  }
                }}
                value={name}
              /> */}
            </Grid>
            <Grid item marginTop={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={addParticipant}
              >
                Add
              </Button>
            </Grid>
            <Grid item>
              <Grid
                container
                marginTop={1}
                display="flex"
                alignContent="left"
                justifyContent="left"
                direction="column"
              >
                {[...participants].map((participant, pid) => (
                  <Grid item key={pid}>
                    <AccountCircleRoundedIcon />
                    <Typography variant="h7">
                      {participant.first_name}
                    </Typography>
                    <IconButton onClick={deleteParticipant} id={participant.id}>
                      <CancelRoundedIcon
                        fontSize="small"
                        // sx={{ marginBottom: 5 }}
                      />
                    </IconButton>
                  </Grid>
                ))}
              </Grid>
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
