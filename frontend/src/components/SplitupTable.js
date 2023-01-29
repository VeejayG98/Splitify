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
  const { participants, items } = useContext(BillContext);

  return (
    // <TableContainer component={Paper}>
    //   <Table sx={{ minWidth: 650 }} aria-label="a dense table">
    //     <TableHead>
    //       <TableRow>
    //         <TableCell align="center">Loan ID</TableCell>
    //         <TableCell align="center">Fine Amount</TableCell>
    //         <TableCell align="center">Status</TableCell>
    //       </TableRow>
    //     </TableHead>
    //     <TableBody>
    //       <TableRow sx={{ "&:last-child td, &:last-chlild th": { border: 0 } }}>
    //         <TableCell component="th" scope="row" align="center">
    //           Hello
    //         </TableCell>
    //       </TableRow>
    //     </TableBody>
    //   </Table>
    // </TableContainer>

    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 400 }}>
        <TableHead>
          <TableRow>
            <TableCell>Item Name</TableCell>
            {participants.map((participant, id) => (
              <TableCell key={id}>{participant}</TableCell>
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
              {participants.map((participant, pid) =>
                item[2].hasOwnProperty(participant) ? (
                  <TableCell key={pid}>{item[2][participant]}</TableCell>
                ) : (
                  <TableCell key={pid}>0</TableCell>
                )
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default SplitupTable;
