import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useEffect } from "react";
import { red } from "@mui/material/colors";

export default function SplitwiseForm({
  commonGroups,
  splitwiseGroup,
  setSplitwiseGroup,
  participants,
  paidBy,
  setPaidBy,
  expenseDate,
  setExpenseDate,
  groupError,
  paidError,
  dateError,
  setGroupError,
  setPaidError,
  setDateError,
}) {
  const handleOpen = (state, setError) => {
    if (state === null) {
      setError(true);
      return;
    }
  };

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" width="100%">
          <FormControl sx={{ minWidth: 200 }} error={groupError}>
            <InputLabel>Select Splitwise Group</InputLabel>
            <Select
              label="Select Splitwise Group"
              onChange={(event) => {
                setSplitwiseGroup(Number(event.target.value));
                setGroupError(false);
              }}
              onOpen={() => handleOpen(splitwiseGroup, setGroupError)}
              value={splitwiseGroup ? splitwiseGroup : ""}
            >
              {commonGroups.map((group) => (
                <MenuItem value={group.id} id={group.id} key={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
            {groupError && (
              <FormHelperText>Select a Splitwise Group</FormHelperText>
            )}
          </FormControl>
        </Box>

        <Box display="flex" width="100%">
          <FormControl sx={{ minWidth: 200 }} error={paidError}>
            <InputLabel>Paid by</InputLabel>
            <Select
              label="Paid by"
              onChange={(event) => {
                setPaidBy(Number(event.target.value));
                setPaidError(false);
              }}
              onOpen={() => handleOpen(paidBy, setPaidError)}
              value={paidBy ? paidBy : ""}
              autoWidth
            >
              {[...participants].map((participant) => (
                <MenuItem
                  value={participant.id}
                  id={participant.id}
                  key={participant.id}
                >
                  {participant.first_name}
                </MenuItem>
              ))}
            </Select>
            {paidError && (
              <FormHelperText>Select who paid the bill</FormHelperText>
            )}
          </FormControl>
        </Box>

        <Box display="flex" minWidth={200}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <FormControl error={dateError}>
              <DatePicker
                label="Date of expense"
                onChange={(date) => {
                  setExpenseDate(dayjs(date).format("YYYY-MM-DD"));
                  setDateError(false);
                }}
                onOpen={() => handleOpen(expenseDate, setDateError)}                  
              />
              {dateError && (
                <FormHelperText>Please fill in the date.</FormHelperText>
              )}
            </FormControl>
          </LocalizationProvider>
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-end" marginBottom={10}></Box>
    </Box>
  );
}
