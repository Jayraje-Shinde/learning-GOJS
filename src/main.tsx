import { ThemeProvider, CssBaseline } from "@mui/material";
import { createRoot } from 'react-dom/client'
import theme from './MUITheme'
import App from './App.tsx'

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />                      {/* resets browser defaults */}
    <App />
  </ThemeProvider>
);