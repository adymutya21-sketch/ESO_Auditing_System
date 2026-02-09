import { createBrowserRouter } from "react-router-dom";

/* Layouts */
import MainLayout from "../layouts/MainLayout.tsx";
import AdminLayout from "../layouts/AdminLayout";
import StudentLayout from "../layouts/StudentLayout";

/* Pages */
import LandingPage from "../src/pages/LandingPage";
import NotFoundPage from "../src/pages/NotFoundPage";

/* Admin Pages */
import AdminDashboard from "../src/pages/admin/AdminDashboard";
import AdminSettings from "../src/pages/admin/AdminSettings";
import StudentList from "../src/pages/admin/StudentList";

/* Student Pages */
import StudentDashboard from "../src/pages/student/StudentDashboard";
import StudentSettings from "../src/pages/student/StudentSettings";
import Obligations from "../src/pages/admin/Obligations";

/* Protected Route */
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <NotFoundPage />,
        children: [
            {
                index: true,
                element: <LandingPage />,
            },
        ],
    },

    /* ADMIN ROUTES */
    {
        path: "/admin",
        element: (
            <ProtectedRoute role="admin">
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <AdminDashboard />,
            },
            {
                path: "settings",
                element: <AdminSettings />,
            },
            {
                path: "students",
                element: <StudentList />,
            },
        ],
    },

    /* STUDENT ROUTES */
    {
        path: "/student",
        element: (
            <ProtectedRoute role="student">
                <StudentLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <StudentDashboard />,
            },
            {
                path: "settings",
                element: <StudentSettings />,
            },
            {
                path: "obligations",
                element: <Obligations />,
            },
        ],
    },

    /* FALLBACK */
    {
        path: "*",
        element: <NotFoundPage />,
    },
]);

export default router;
