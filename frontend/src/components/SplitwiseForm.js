import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Box } from "@mui/system";

export default function SplitwiseForm({
  commonGroups,
  setSplitwiseGroup,
  participants,
  setPaidBy,
  addExpense
}) {
  return (
    <Box display="flex" flexDirection="column" >
      <Box display="flex" justifyContent="center">
        <FormControl>
          <FormLabel>Splitwise Group</FormLabel>
          <RadioGroup
            onChange={(event) => setSplitwiseGroup(Number(event.target.value))}
          >
            {commonGroups.map((group) => (
              <FormControlLabel
                value={group.id}
                control={<Radio />}
                label={group.name}
                id={group.id}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel>Paid by</FormLabel>
          <RadioGroup
            onChange={(event) => setPaidBy(Number(event.target.value))}
          >
            {[...participants].map((participant) => (
              <FormControlLabel
                value={participant.id}
                control={<Radio />}
                label={participant.first_name}
                id={participant.id}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>
      <Box display="flex" justifyContent="flex-end" marginBottom={10}>
        {/* <Button
          variant="contained"
          color="primary"
          sx={{ margin: 2 }}
          onClick={addExpense}
        >
          Push to Splitwise
        </Button> */}
      </Box>
    </Box>
  );
}
