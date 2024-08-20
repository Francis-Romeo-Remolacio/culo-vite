import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CssBaseline } from "@mui/material";
// import { ColorModeContext, useMode } from "./theme";
// import { tokens } from "./theme.js";
import { createTheme, MantineProvider } from "@mantine/core";
import App from "./App";

const theme = createTheme({
  /** Put your mantine theme override here */
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        {/*<ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>*/}
        <CssBaseline />
        <MantineProvider theme={theme}>
          <App />
        </MantineProvider>
        {/*</ThemeProvider>
          </ColorModeContext.Provider>*/}
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
