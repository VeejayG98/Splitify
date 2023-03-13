import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OpeningPage from "./pages/OpeningPage";
import { createTheme } from "@mui/material";
import { green, grey } from "@mui/material/colors";
import { ThemeProvider } from "@mui/material";
import SuccessPage from "./pages/SuccessPage";

function App() {
  const theme = createTheme({
    palette: {
      // mode: "dark",
      primary: {
        main: "#00b55c",
        contrastText: "#fff"
      },
      secondary: {
        main: green[600]
      },
      neutral: {
        main: "#FFFFFF",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<OpeningPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
