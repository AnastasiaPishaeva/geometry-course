import { Route, Routes } from 'react-router-dom';
import CoursePage from '../pages/CoursePage';
import HomePage from '../pages/HomePage.tsx';
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
        <Route path="/geomGame" element={<HomePage />}/>
        <Route path="/course/:sectionId/lesson/:lessonId" element={<CoursePage />} />
        </Routes>
      </Box>
      </Box>
    )
}

