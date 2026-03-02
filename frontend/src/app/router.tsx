import { Route, Routes } from 'react-router-dom';
import CoursePage from '../pages/CoursePage';
import Header from '../widgets/Header.tsx';
import {Box} from "@mui/material";
export const AppRoutes = () => {
    return (
        <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100vh" 
    }}>
      <Header/>
      <Box sx={{ flexGrow: 1 }}>
        <Routes>
        {/* <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} /> */}
        <Route path="/course/:sectionId/lesson/:lessonId" element={<CoursePage />} />
        </Routes>
      </Box>
      </Box>
    )
}

