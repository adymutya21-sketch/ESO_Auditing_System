import { createBrowserRouter } from "react-router-dom";
import { Navigate } from "react-router-dom";

/* Layouts */
import MainLayout from "../src/layouts/MainLayout.tsx";
import AdminLayout from "../src/layouts/AdminLayout.tsx";
import StudentLayout from "../src/layouts/StudentLayout.tsx";

/* Pages */
import LandingPage from "../src/pages/LandingPage.tsx";
import NotFoundPage from "../src/pages/NotFoundPage";
import Signup from "../src/pages/SignupPage.tsx";
import Signout from "../src/pages/Signout.tsx";

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
            { index: true, element: <Navigate to="dashboard" replace /> }, // default redirect
            { path: "dashboard", element: <AdminDashboard /> },
            { path: "settings", element: <AdminSettings /> },
            { path: "students", element: <StudentList /> },
            { path: "obligations", element: <Obligations /> },
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
            // {
            //     path: "signout",
            //     element: <Signout />

            // }
        ],
    },

    /* FALLBACK */
    {
        path: "*",
        element: <NotFoundPage />,
    },
]);

export default router;
