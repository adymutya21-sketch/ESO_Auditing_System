import { Navigate, useRouteLoaderData } from "react-router-dom";

// BUG admin sign in cannot log in
type Props = {
    role: "admin" | "student";
    children: React.ReactNode;
};

export default function ProtectedRoute({ role, children }: Props) {
    const adminDataString = localStorage.getItem("admin");

    if (!adminDataString) {
        // No admin data in localStorage
        return <Navigate to="/" replace />;
    }
    let userRole: string | undefined;
    try {
        const adminData = JSON.parse(adminDataString);
        userRole = adminData?.profile?.role;
    } catch (error) {
        // Invalid JSON in localStorage
        return <Navigate to="/" replace />;
    }
    if (!userRole || userRole !== role) {
        // Role mismatch or undefined
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
}
