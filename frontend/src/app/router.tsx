import { Route } from 'react-router-dom';
import HomePage from "../pages/HomePage.tsx";
import {Routes} from "react-router-dom";
import CoursePage from "../pages/CoursePage.tsx";
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
        <Route path="/course/:topicId/lesson/:lessonId/section/:sectionId" element={<CoursePage />} />
        </Routes>
      </Box>
      </Box>
    )
}

