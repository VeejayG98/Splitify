import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useContext } from "react";
import { BillContext } from "../context/BillContext";

const SplitupTable = () => {
  const { participants, items, totals } = useContext(BillContext);

  return (
    <TableContainer component={Paper} sx={{maxHeight: 440}}>
      <Table sx={{ minWidth: 400 }} stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{fontWeight: "bold"}}>Item Name</TableCell>
            <TableCell sx={{fontWeight: "bold"}}>Item Price</TableCell>
            {[...participants].map((participant, id) => (
              <TableCell key={id} sx={{fontWeight: "bold"}}>{participant.first_name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, iid) => (
            <TableRow
              key={iid}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {item[0]}
              </TableCell>
              <TableCell>{item[1]}</TableCell>
              {[...participants].map((participant, pid) =>
                item[2].hasOwnProperty(participant.first_name) ? (
                  <TableCell key={pid}>{item[2][participant.first_name]}</TableCell>
                ) : (
                  <TableCell key={pid}>0</TableCell>
                )
              )}
            </TableRow>
          ))}
          <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell component="th" scope="row">
              Total
            </TableCell>
            <TableCell>{totals["totalPrice"]}</TableCell>
            {[...participants].map((participant, id) => (
              <TableCell key={id}>{totals[participant.id]}</TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default SplitupTable;
