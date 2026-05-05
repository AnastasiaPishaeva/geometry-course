import { AppRoutes } from './router.tsx'
import { QueryProvider } from './providers/QueryProvider.tsx'
import { ThemeProviderWrapper } from "./providers/ThemeProvider.tsx";
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from "@mui/material";
import { AuthProvider } from './providers/AuthProvider.tsx';

export const App = () => {
  return (
    <ThemeProviderWrapper>
      <QueryProvider>
        <AuthProvider>
          <CssBaseline />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </QueryProvider>
    </ThemeProviderWrapper>
  )
}

export default App

