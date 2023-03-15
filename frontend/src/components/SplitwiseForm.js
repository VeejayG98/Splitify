import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import { Box } from "@mui/system";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function SplitwiseForm({
  commonGroups,
  splitwiseGroup,
  setSplitwiseGroup,
  participants,
  paidBy,
  setPaidBy,
  setExpenseDate,
}) {
  return (
    <Box display="flex" flexDirection="column">

      <Box display="flex" justifyContent="space-between">


        <Box display="flex" width="100%">
          <FormControl sx={{minWidth: 200}}>
            <InputLabel>Splitwise Group</InputLabel>
            <Select
              label="Splitwise Group"
              onChange={(event) =>
                setSplitwiseGroup(Number(event.target.value))
              }
              value={splitwiseGroup}
            >
              {commonGroups.map((group) => (
                <MenuItem value={group.id} id={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box display="flex" width="100%">
          <FormControl sx={{minWidth: 200}}>
            <InputLabel>Paid by</InputLabel>
            <Select
              label="Paid by"
              onChange={(event) => setPaidBy(Number(event.target.value))}
              value={paidBy}
              autoWidth
            >
              {[...participants].map((participant) => (
                <MenuItem value={participant.id} id={participant.id}>
                  {participant.first_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box display="flex" minWidth={200}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Date of expense" onChange={(date) => setExpenseDate(dayjs(date).format('YYYY-DD-MM'))}/>
        </LocalizationProvider>
      </Box>

        {/* <FormControl>
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
        </FormControl> */}
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
