import { Route, Routes } from 'react-router-dom';
import CoursePage from '../pages/CoursePage';
export const AppRoutes = () => {
    return (
        <Routes>
        {/* <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} /> */}
        <Route path="/course/:sectionId/lesson/:lessonId" element={<CoursePage />} />
        </Routes>
    )
}

