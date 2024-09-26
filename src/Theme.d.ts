// theme.d.ts

import "@mui/material/styles";
import { PaletteOptions } from "@mui/material/styles";

// Extend the existing Palette interface
declare module "@mui/material/styles" {
  interface Palette {
    complementary?: PaletteOptions;
    analogous1?: PaletteOptions;
    analogous2?: PaletteOptions;
    triadic1?: PaletteOptions;
    triadic2?: PaletteOptions;
  }

  interface PaletteOptions {
    complementary?: PaletteOptions;
    analogous1?: PaletteOptions;
    analogous2?: PaletteOptions;
    triadic1?: PaletteOptions;
    triadic2?: PaletteOptions;
  }
}

declare module "@mui/material" {
  interface Theme {
    palette: {
      mode: PaletteMode;
    };
  }
}
