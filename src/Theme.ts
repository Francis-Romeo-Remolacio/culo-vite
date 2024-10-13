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
          100: "#6e355a",
          200: "#923f6a",
          300: "#a74472",
          400: "#be497b",
          500: "#cf4d82",
          600: "#ce6193",
          700: "#d578a7",
          800: "#df9bbf",
          900: "#eac1d8",
        },
        complementary: {
          100: "#00581f",
          200: "#007733",
          300: "#00883f",
          400: "#009a4b",
          500: "#00a955",
          600: "#00b76d",
          700: "#2fc485",
          800: "#78d5a7",
          900: "#b0e6c9",
        },
        analogous1: {
          100: "#6e259d",
          200: "#b63531",
          300: "#9d33b2",
          400: "#b139ba",
          500: "#bf3ec1",
          600: "#ca59cb",
          700: "#d578d5",
          800: "#e29fe2",
          900: "#edc5ed",
        },
        analogous2: {
          100: "#a82b26",
          200: "#b63531",
          300: "#c33c38",
          400: "#d5453e",
          500: "#e44d40",
          600: "#de5c58",
          700: "#d57878",
          800: "#d57878",
          900: "#e39c9d",
        },
        triadic1: {
          100: "#970d00",
          200: "#a23000",
          300: "#aa4000",
          400: "#b04e00",
          500: "#b45700",
          600: "#be6d1e",
          700: "#c68444",
          800: "#d5a778",
          900: "#e6c9ac",
        },
        triadic2: {
          100: "#246911",
          200: "#498b22",
          300: "#5d9f2b",
          400: "#71b335",
          500: "#80c33c",
          600: "#92cc59",
          700: "#a7d578",
          800: "#c0e19f",
          900: "#d9edc5",
        },
        background: "#000",
        panel: "#00000080",
        subtle: "#FFD8BE",
        text: "#fff",
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
      }),
});

// mui theme settings
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
