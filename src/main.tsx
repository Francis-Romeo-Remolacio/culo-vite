import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./Theme";
// import { createTheme, MantineProvider } from "@mantine/core";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import App from "./App";
import { AlertProvider } from "./components/CuloAlert";
import { AuthProvider } from "./components/AuthContext";

const Index = () => {
  const [theme, colorMode] = useMode();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <HelmetProvider>
        <BrowserRouter>
          <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
              {
                //<MantineProvider theme={theme}>
              }
              <CssBaseline />
              <AlertProvider>
                <AuthProvider>
                  <App />
                </AuthProvider>
              </AlertProvider>
              {
                //</MantineProvider>
              }
            </ThemeProvider>
          </ColorModeContext.Provider>
        </BrowserRouter>
      </HelmetProvider>
    </LocalizationProvider>
  );
};

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);
root.render(<Index />);
