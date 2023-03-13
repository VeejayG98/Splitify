import { Alert, Snackbar } from "@mui/material";

export default function ErrorSnackBar({ open, message, handleClose }) {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }} variant="filled" elevation={6}>
        {message}
      </Alert>
    </Snackbar>
  );
}
