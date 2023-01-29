import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useContext } from "react";
import SplitupTable from "../components/SplitupTable";
import { BillContext } from "../context/BillContext";

function GenerateBillPage() {
  const { billName, step, setStep } = useContext(BillContext);

  return (
    <Grid container alignContent="center" justifyContent="center" padding={2}>
      <Card sx={{ minWidth: 650, maxWidth: 650 }}>
        <CardContent>
          <Box display="flex" alignContent="center" justifyContent="center">
            <Typography variant="h4" sx={{ fontWeight: 550 }}>
              {billName}
            </Typography>
          </Box>
          <Box display="flex" alignContent="center" justifyContent="center">
            <SplitupTable />
          </Box>
        </CardContent>
        <Box display="flex" justifyContent="flex-start">
          <Button variant="contained" color="primary" sx={{margin: 2}} onClick={() => setStep(step - 1)}>
            Modify Bill
          </Button>
        </Box>
      </Card>
    </Grid>
  );
}
export default GenerateBillPage;
