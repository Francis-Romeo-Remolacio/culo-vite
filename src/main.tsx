import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme"
import { createTheme, MantineProvider } from "@mantine/core";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import App from "./App";

const Index = () => {
  const [theme, colorMode] = useMode();

  return (
    <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <HelmetProvider>
        <BrowserRouter>
          <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>     
          {
            //<MantineProvider theme={theme}>
          }<CssBaseline />
          <App />
          {
            //</MantineProvider>
          }
          </ThemeProvider>
          </ColorModeContext.Provider>
        </BrowserRouter>
      </HelmetProvider>
      <></>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Index />);
