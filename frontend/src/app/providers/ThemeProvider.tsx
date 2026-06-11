import { createContext, useMemo, useState } from "react";
import type {ReactNode} from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

interface ThemeContextType {
  mode: "light" | "dark";
  toggleTheme: () => void;
}

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
  
  interface TypeBackground {
      textfield : string;
      text : string,
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

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    btnText: true;
    text1: true;
    text2: true;
    mobileMenu: true;
    mobileMenuActive: true;
  }
}



const getTheme = (mode: string) =>
  createTheme({
    palette: {
      primaryScale: {
        100: mode === "light" ? "#091434" : "#F2F5FD",
        200: mode === "light" ?  "#1A0041" : "#ede0ff",
        300: mode === "light" ? "#402E7A": "#a791ef" ,
        400: mode === "light" ? "#4B3BCF" : "#270652",
        500: mode === "light" ? "#4B70F5" : "#7a5bc7",
        600: mode === "light" ? "#8fa6f7" : "#33247c",
        700: mode === "light" ? "#A4B7F9" : "#403378",
        800: mode === "light" ?  "#D1DAFB" : "#2d26529a",
        900: mode === "light" ? "#E7ECFC" : "#421c76d7",
        1000: mode === "light" ? "#F2F5FD" : "#1a0438"
      },

      background: {
        default: mode === "light" ? "#F2F5FD" :  "#1a0438",
        paper: mode === "light" ? "#E7ECFC" : "#1e0246",
        textfield: mode === "light" ? "#F2F5FD" : "#2c0661",
        text: mode === "light" ? "#000000" : "#f6f0fe"
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
  const [mode, setMode] = useState<"light" | "dark">(() => {
    return (
      (localStorage.getItem("theme") as "light" | "dark") || "light"
    );
  });

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
  setMode((prev) => {
    const newMode = prev === "light" ? "dark" : "light";

    localStorage.setItem("theme", newMode);

    return newMode;
  });
};

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
