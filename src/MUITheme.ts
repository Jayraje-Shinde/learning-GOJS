import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0a0c14",
      paper: "#1a1d27",
    },
    primary: {
      main: "#818cf8",
    },
    divider: "#2e3250",
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
});

export default theme;
