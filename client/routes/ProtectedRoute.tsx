import { Navigate } from "react-router-dom";

type Props = {
    role: "admin" | "student";
    children: React.ReactNode;
};

export default function ProtectedRoute({ role, children }: Props) {
    // Temporary fake login role
    const userRole = localStorage.getItem("role");

    if (!userRole) {
        return <Navigate to="/" replace />;
    }

    if (userRole !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
}
