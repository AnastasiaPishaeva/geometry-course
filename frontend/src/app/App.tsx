import { AppRoutes } from './router.tsx'
import { QueryProvider } from './providers/QueryProvider.tsx'
import { ThemeProviderWrapper } from "./providers/ThemeProvider.tsx";
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from "@mui/material";

<<<<<<< HEAD
const App = () => {
    return (
        <ThemeProviderWrapper>
            <QueryProvider>
                <AppRoutes />
            </QueryProvider>
        </ThemeProviderWrapper>
    )
=======
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
>>>>>>> 48a4db90 (fix accordion)
}

export default App

