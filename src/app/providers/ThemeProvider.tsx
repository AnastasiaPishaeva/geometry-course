import { createContext, useMemo } from "react";
import type {ReactNode} from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

declare module "@mui/material/styles" {
  interface Palette {
    primaryScale: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      1000: string;
    };
  }

  interface PaletteOptions {
    primaryScale?: {
      100?: string;
      200?: string;
      300?: string;
      400?: string;
      500?: string;
      600?: string;
      700?: string;
      800?: string;
      900?: string;
      1000?: string;
    };
  }

  interface Theme {
    shape: {
      borderRadius: string;
      cardRadius: string; 
    };
  }
  interface ThemeOptions {
    shape?: {
      borderRadius?: string;
      cardRadius?: string;
    };
  }
  interface TypeText {
    two: string,
    three: string,
    four: string,
    white: string;
    black: string;
  }
}

const getTheme = () =>
  createTheme({
    palette: {
      mode: "light", 
      primaryScale: {
        100: "#091434",
        200: "#1A0041",
        300: "#402E7A",
        400: "#4B3BCF",
        500: "#4B70F5",
        600: "#3DC2EB",
        700: "#A4B7F9",
        800: "#D1DAFB",
        900: "#E7ECFC",
        1000: "#F2F5FD"
      },

      background: {
        default: "#fff",
      },

      text: { 
        white: "#fff",
        black: "#000",
      },
    },
    typography: {
      fontFamily: "'Rubik', sans-serif",
      h1: {
        fontFamily: "'Rubik', sans-serif",
        fontSize: "90px",
        lineHeight: "1.2",
        fontWeight: "bold",
        letterSpacing: "1px",
      },
      allVariants: {
        wordBreak: "break-word",
        textTransform: "none",
      },
    },
    spacing: 4,
    shape: {
      borderRadius: "8px",
      cardRadius: "20px",
    },
  });

interface ThemeContextType {
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProviderWrapper = ({ children }: { children: ReactNode }) => {
  const theme = useMemo(() => getTheme(), []);

  const toggleTheme = () => {
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
