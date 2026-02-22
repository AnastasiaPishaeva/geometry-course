import { Route } from 'react-router-dom';
export const AppRoutes = () => {
    return (
        <>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/course/:sectionId/lesson/:lessonId" element={<CoursePage />} />
        </>
    )
}

