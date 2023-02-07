import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OpeningPage from "./pages/OpeningPage";
import { createTheme } from "@mui/material";
import { green } from "@mui/material/colors";
import { ThemeProvider } from "@mui/material";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: green[600],
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<OpeningPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
