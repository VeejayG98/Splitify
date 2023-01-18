import {
  Button,
  Card,
  CardContent,
  Fab,
  Grid,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import NavBar from "../components/Navbar";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import { green, grey } from "@mui/material/colors";
import { createTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Home() {
  const navigate = useNavigate();

  const [test, setTest] = useState(0);
  const [isBill, setIsBill] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [name, setName] = useState("");

  const theme = createTheme({
    palette: {
      primary: {
        main: green[600],
      },
    },
  });

  return (
    <div>
      <NavBar />
      <ThemeProvider theme={theme}>
        <Fab
          variant="extended"
          aria-label="add bill"
          color="primary"
          sx={{ position: "fixed", bottom: "20px", right: "20px" }}
          onClick={() => {
            setTest(test + 1);
            navigate("/add-bill");
          }}
        >
          <ReceiptLongRoundedIcon sx={{ mr: 1 }} />
          New Bill
        </Fab>
        {/* <Typography variant="h5" sx={{fontWeight: 550, color: grey[600]}} align="center" margin="150px">No bill created. Create a new bill.</Typography> */}
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
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </ThemeProvider>
    </div>
  );
}
export default Home;
