import { Route } from 'react-router-dom';
import HomePage from "../pages/HomePage.tsx";
import {Routes} from "react-router-dom";
import CoursePage from "../pages/CoursePage.tsx";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/course/:sectionId/lesson/:lessonId" element={<CoursePage />} />
        </Routes>
    )
}

