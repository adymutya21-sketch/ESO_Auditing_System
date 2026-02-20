import { Outlet, Link } from "react-router-dom";

export default function StudentLayout() {
    return (
        <div className="flex min-h-screen">

            {/* Sidebar */}
            <aside className="w-64 bg-blue-900 text-white p-6">
                <h2 className="text-xl font-bold mb-6">
                    Student Portal
                </h2>

                <nav className="flex flex-col gap-3">
                    <Link to="/student">Dashboard</Link>
                    <Link to="/student/obligations">Obligations</Link>
                    <Link to="/student/settings">Settings</Link>
                </nav>
            </aside>

            {/* Content */}
            <main className="flex-1 p-6 bg-gray-50">
                <Outlet />
            </main>
        </div>
    );
}
