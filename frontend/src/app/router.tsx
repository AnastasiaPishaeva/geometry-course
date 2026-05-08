import { Route } from 'react-router-dom';
import HomePage from "../pages/HomePage.tsx";
import { Routes } from "react-router-dom";
import CoursePage from "../pages/CoursePage.tsx";
import BaseHeader from '../widgets/BaseHeader.tsx';
import HeaderForMainPage from '../widgets/HeaderForMainPage.tsx';
import { Box } from "@mui/material";
import { Navigate } from "react-router-dom";
import LoginPage from '../pages/AuthPage.tsx';
import RegistrationPage from '../pages/RegistrationPage.tsx';
import PersonalAccount from '../pages/PersonalAccountPage.tsx';


export const AppRoutes = () => {
  const currentPath = location.pathname.split("/")[1] || "";
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      height: "100vh"
    }}>
      {(currentPath === "course" || currentPath === "personal-account") ? <BaseHeader /> : <HeaderForMainPage />}
      <Box sx={{ flexGrow: 1 }}>
        <Routes>  
          <Route path="/" element={<Navigate to="/geomGame" />} />
          <Route path="/geomGame" element={<HomePage />} />
          <Route path="/course/:topicId" element={<CoursePage />}>
            <Route path="lesson/:lessonId/section/:sectionId" element={<CoursePage />} />
          </Route>
          <Route path="/authorization" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/personal-account" element={<PersonalAccount />} />

        </Routes>
      </Box>
    </Box>
  )
}

