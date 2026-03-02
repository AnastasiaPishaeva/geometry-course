import { AppRoutes } from './router.tsx'
import { QueryProvider } from './providers/QueryProvider.tsx'
import { ThemeProviderWrapper } from "./providers/ThemeProvider.tsx";
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from "@mui/material";

export const App = () => {
  return (
    <ThemeProviderWrapper>
      <QueryProvider>
        <CssBaseline />
        <BrowserRouter>
            <AppRoutes /> 
        </BrowserRouter> 
      </QueryProvider>
    </ThemeProviderWrapper>
  )
}
