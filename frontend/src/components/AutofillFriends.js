import { Autocomplete, TextField } from "@mui/material";

export default function AutofillFriends({
  friends,
  setPersonInfo,
  addParticipant,
}) {
  return (
    <Autocomplete
      options={friends}
      onChange={(e, value) => setPersonInfo(value)}
      onKeyDown={(e) => {
        if (e.key == "Enter") {
          addParticipant();
          setPersonInfo({});
        }
      }}
      renderInput={(params) => <TextField {...params} label="Friends" />}
      getOptionLabel={(option) => {
        if (option.last_name) return option.first_name + " " + option.last_name;
        else return option.first_name;
      }}
    />
  );
}
