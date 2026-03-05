import { AppRoutes } from './router.tsx'
import { QueryProvider } from './providers/QueryProvider.tsx'
import { ThemeProviderWrapper } from "./providers/ThemeProvider.tsx";

const App = () => {
    return (
        <ThemeProviderWrapper>
            <QueryProvider>
                <AppRoutes />
            </QueryProvider>
        </ThemeProviderWrapper>
    )
}

export default App

