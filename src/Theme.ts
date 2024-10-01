import { createContext, useState, useMemo } from "react";
import { createTheme, Theme } from "@mui/material/styles";
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
          100: "#eac1d8",
          200: "#df9bbf",
          300: "#d578a7",
          400: "#ce6193",
          500: "#cf4d82",
          600: "#be497b",
          700: "#a74472",
          800: "#923f6a",
          900: "#6e355a",
        },
        complementary: {
          100: "#b0e6c9",
          200: "#78d5a7",
          300: "#2fc485",
          400: "#00b76d",
          500: "#00a955",
          600: "#009a4b",
          700: "#00883f",
          800: "#007733",
          900: "#00581f",
        },
        analogous1: {
          100: "#edc5ed",
          200: "#e29fe2",
          300: "#d578d5",
          400: "#ca59cb",
          500: "#bf3ec1",
          600: "#b139ba",
          700: "#9d33b2",
          800: "#b63531",
          900: "#6e259d",
        },
        analogous2: {
          100: "#e39c9d",
          200: "#d57878",
          300: "#d57878",
          400: "#de5c58",
          500: "#e44d40",
          600: "#d5453e",
          700: "#c33c38",
          800: "#b63531",
          900: "#a82b26",
        },
        triadic1: {
          100: "#e6c9ac",
          200: "#d5a778",
          300: "#c68444",
          400: "#be6d1e",
          500: "#b45700",
          600: "#b04e00",
          700: "#aa4000",
          800: "#a23000",
          900: "#970d00",
        },
        triadic2: {
          100: "#d9edc5",
          200: "#c0e19f",
          300: "#a7d578",
          400: "#92cc59",
          500: "#80c33c",
          600: "#71b335",
          700: "#5d9f2b",
          800: "#498b22",
          900: "#246911",
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
              main: colors.primary[300],
            },
            secondary: {
              main: colors.analogous1[300],
            },
            // error: {
            //   main: colors.complementary[200],
            // },
            // warning: {
            //   main: colors.analogous2[300],
            // },
            // info: {
            //   main: colors.triadic1[200],
            // },
            // success: {
            //   main: colors.triadic2[300],
            // },
            complementary: {
              main: colors.complementary[200],
            },
            analogous1: {
              main: colors.analogous1[300],
            },
            analogous2: {
              main: colors.analogous2[300],
            },
            triadic1: {
              main: colors.triadic1[200],
            },
            triadic2: {
              main: colors.triadic2[300],
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
              main: colors.primary[300],
            },
            secondary: {
              main: colors.analogous1[300],
            },
            complementary: {
              main: colors.complementary[200],
            },
            analogous1: {
              main: colors.analogous1[300],
            },
            analogous2: {
              main: colors.analogous2[300],
            },
            triadic1: {
              main: colors.triadic1[200],
            },
            triadic2: {
              main: colors.triadic2[300],
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

export const useMode = (): [Theme, { toggleColorMode: () => void }] => {
  const [mode, setMode] = useState<PaletteMode>("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(ThemeSettings(mode)), [mode]);

  return [theme, colorMode];
};
