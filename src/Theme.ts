import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

// color design tokens export

export const Tokens = (mode: PaletteMode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#141414",
          200: "#292929",
          300: "#3d3d3d",
          400: "#525252",
          500: "#666666",
          600: "#858585",
          700: "#a3a3a3",
          800: "#c2c2c2",
          900: "#e0e0e0",
        },
        primary: {
          100: "#712947",
          200: "#973052",
          300: "#ad3457",
          400: "#c2395c",
          500: "#d33d60",
          600: "#d95075",
          700: "#e06a8c",
          800: "#e992ac",
          900: "#f1bccd",
        },
        complementary: {
          100: "#006b44",
          200: "#009a70",
          300: "#00ab80",
          400: "#00ba8e",
          500: "#00ba8e",
          600: "#00c79e",
          700: "#3dd3b0",
          800: "#7ee0c7",
          900: "#b3ecdd",
        },
        analogous1: {
          100: "#7c0081",
          200: "#98008c",
          300: "#a80092",
          400: "#ba0099",
          500: "#c8009e",
          600: "#d33dab",
          700: "#dd65ba",
          800: "#e893cd",
          900: "#f1bfe1",
        },
        analogous2: {
          100: "#a85436",
          200: "#c45f3a",
          300: "#d3653d",
          400: "#e16c41",
          500: "#ec7246",
          600: "#ed845e",
          700: "#ef997b",
          800: "#f2b4a0",
          900: "#f6d1c5",
        },
        triadic1: {
          100: "#c77722",
          200: "#cf9a33",
          300: "#d3b03d",
          400: "#d6c546",
          500: "#d8d64e",
          600: "#dddc63",
          700: "#e1e17c",
          800: "#e9ea9f",
          900: "#f1f2c5",
        },
        triadic2: {
          100: "#007608",
          200: "#169920",
          300: "#36ad2a",
          400: "#50c235",
          500: "#60d33d",
          600: "#7bda5d",
          700: "#96e17c",
          800: "#b6eaa3",
          900: "#d3f3c7",
        },
        background: "#000",
        panel: "#00000080",
        subtle: "#FFD8BE",
        text: "#fff",
        pink: "#f497da",
        blu: "#42cafd",
        gween: "#79b990",
      }
    : {
        grey: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#3d3d3d",
          800: "#292929",
          900: "#141414",
        },
        primary: {
          100: "#f1bccd",
          200: "#e992ac",
          300: "#e06a8c",
          400: "#d95075",
          500: "#d33d60",
          600: "#c2395c",
          700: "#ad3457",
          800: "#973052",
          900: "#712947",
        },
        complementary: {
          100: "#b3ecdd",
          200: "#7ee0c7",
          300: "#3dd3b0",
          400: "#00c79e",
          500: "#00ba8e",
          600: "#00ba8e",
          700: "#00ab80",
          800: "#009a70",
          900: "#006b44",
        },
        analogous1: {
          100: "#f1bfe1",
          200: "#e893cd",
          300: "#dd65ba",
          400: "#d33dab",
          500: "#c8009e",
          600: "#ba0099",
          700: "#a80092",
          800: "#98008c",
          900: "#7c0081",
        },
        analogous2: {
          100: "#f6d1c5",
          200: "#f2b4a0",
          300: "#ef997b",
          400: "#ed845e",
          500: "#ec7246",
          600: "#e16c41",
          700: "#d3653d",
          800: "#c45f3a",
          900: "#a85436",
        },
        triadic1: {
          100: "#f1f2c5",
          200: "#e9ea9f",
          300: "#e1e17c",
          400: "#dddc63",
          500: "#d8d64e",
          600: "#d6c546",
          700: "#d3b03d",
          800: "#cf9a33",
          900: "#c77722",
        },
        triadic2: {
          100: "#d3f3c7",
          200: "#b6eaa3",
          300: "#96e17c",
          400: "#7bda5d",
          500: "#60d33d",
          600: "#50c235",
          700: "#36ad2a",
          800: "#169920",
          900: "#007608",
        },
        background: "#fff",
        panel: "#ffffff80",
        subtle: "#411a00",
        text: "#000",
        pink: "#3f000b",
        blu: "#028abd",
        gween: "#46865d",
      }),
});

// mui theme settings
type ThemeSettingsProps = {
  mode: PaletteMode;
};
export const ThemeSettings = (mode: PaletteMode) => {
  const colors = Tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.analogous1[400],
            },
            error: {
              main: colors.complementary[300],
            },
            warning: {
              main: colors.analogous2[700],
            },
            info: {
              main: colors.triadic1[700],
            },
            success: {
              main: colors.triadic2[500],
            },
            complementary: {
              main: colors.complementary[300],
            },
            analogous1: {
              main: colors.analogous1[400],
            },
            analogous2: {
              main: colors.analogous2[700],
            },
            triadic1: {
              main: colors.triadic1[700],
            },
            triadic2: {
              main: colors.triadic2[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
          }
        : {
            // palette values for light mode
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.analogous1[400],
            },
            complementary: {
              main: colors.complementary[300],
            },
            analogous1: {
              main: colors.analogous1[400],
            },
            analogous2: {
              main: colors.analogous2[700],
            },
            triadic1: {
              main: colors.triadic1[700],
            },
            triadic2: {
              main: colors.triadic2[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
          }),
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState<PaletteMode>("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(ThemeSettings(mode)), [mode]);
  return [theme, colorMode];
};
