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

  interface TypographyVariants {
    btnText: React.CSSProperties;
    text1: React.CSSProperties;
    text2: React.CSSProperties;
    mobileMenu: React.CSSProperties;
    mobileMenuActive: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    btnText?: React.CSSProperties;
    text1?: React.CSSProperties;
    text2?: React.CSSProperties;
    mobileMenu?: React.CSSProperties;
    mobileMenuActive?: React.CSSProperties;
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
    },

    typography: {
      fontFamily: "'Rubik', sans-serif",
      h1: {
        fontWeight: 700,
        fontSize: '58px',
        lineHeight: '80px',
        letterSpacing: '0.2px',
      },
      h2: {
        fontWeight: 700,
        fontSize: '40px',
        lineHeight: '57px',
        letterSpacing: '0.2px',
      },
      h3: {
        fontWeight: 500,
        fontSize: '24px',
        lineHeight: '32px',
        letterSpacing: '0.1px',
      },
      h4: {
        fontWeight: 500,
        fontSize: '20px',
        lineHeight: '30px',
        letterSpacing: '0.2px',
      },
      h5: {
        fontWeight: 400,
        fontSize: '18px',
        lineHeight: '30px',
        letterSpacing: '0.2px',
      },
      btnText: {
        fontWeight: 600,
        fontSize: '20px',
        lineHeight: '28px',
        letterSpacing: '0.2px',
      },
      text1: {
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '100%',
        letterSpacing: '0.2px',
      },
      text2: {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '100%',
        letterSpacing: '0.2px',
      },
      mobileMenu: {
        fontWeight: 400,
        fontSize: '18px',
        lineHeight: '45px',
        letterSpacing: '0.2px',
      },
      mobileMenuActive: {
        fontWeight: 700,
        fontSize: '18px',
        lineHeight: '45px',
        letterSpacing: '0.2px',
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
