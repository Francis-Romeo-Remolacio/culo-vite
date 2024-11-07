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
          100: "#d4bff9",
          200: "#b794f6",
          300: "#9965f4",
          400: "#7e3ff2",
          500: "#6002ee",
          600: "#5300e8",
          700: "#3d00e0",
          800: "#1c00db",
          900: "#0000d6",
        },
        complementary: {
          100: "#defabb",
          200: "#c6f68d",
          300: "#aaf255",
          400: "#90ee02",
          500: "#75e900",
          600: "#61d800",
          700: "#41c300",
          800: "#09af00",
          900: "#008b00",
        },
        analogous1: {
          100: "#d2c2fd",
          200: "#b39afd",
          300: "#916eff",
          400: "#714cfe",
          500: "#4a26fd",
          600: "#3722f6",
          700: "#021aee",
          800: "#0013e9",
          900: "#0000e4",
        },
        analogous2: {
          100: "#f2bcf8",
          200: "#e98df5",
          300: "#df55f2",
          400: "#d602ee",
          500: "#cd00ea",
          600: "#ba00e5",
          700: "#a200e0",
          800: "#8b00dd",
          900: "#5c00d2",
        },
        triadic1: {
          100: "#f5b6da",
          200: "#f186c0",
          300: "#ef4fa6",
          400: "#ee0290",
          500: "#ef0078",
          600: "#dd0074",
          700: "#c7006e",
          800: "#b1006a",
          900: "#880061",
        },
        triadic2: {
          100: "#ffddb0",
          200: "#ffc77d",
          300: "#ffaf49",
          400: "#ff9e22",
          500: "#ff8d00",
          600: "#fa8100",
          700: "#f47100",
          800: "#ee6002",
          900: "#e54304",
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
              main: colors.primary[500],
            },
            secondary: {
              main: colors.analogous1[700],
            },
            complementary: {
              main: colors.complementary[400],
            },
            analogous1: {
              main: colors.analogous1[700],
            },
            analogous2: {
              main: colors.analogous2[400],
            },
            triadic1: {
              main: colors.triadic1[400],
            },
            triadic2: {
              main: colors.triadic2[800],
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
        fontWeight: "bold",
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
        fontWeight: "bold",
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
        fontWeight: "bold",
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
        fontWeight: "bold",
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
