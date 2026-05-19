import { AppRoutes } from './router.tsx'
import { QueryProvider } from './providers/QueryProvider.tsx'
import { ThemeProviderWrapper } from "./providers/ThemeProvider.tsx";
import { HashRouter } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { AuthProvider } from './providers/AuthProvider.tsx';

export const App = () => {
  return (
    <ThemeProviderWrapper>
      <QueryProvider>
        <AuthProvider>
          <CssBaseline />
          <HashRouter >
            <AppRoutes />
          </HashRouter >
        </AuthProvider>
      </QueryProvider>
    </ThemeProviderWrapper>
  )
}

export default App

