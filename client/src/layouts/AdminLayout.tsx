import {
    FaTachometerAlt,
    FaUserGraduate,
    FaClipboardList,
    FaCog,
    FaSignOutAlt,
    FaTimes,
} from "react-icons/fa";

import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../styles/index.css";
import logo from "../assets/ESO_Logo.png"


// REVIEWME
//// TODO Fix the UI


const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Logout Modal State
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const navItems = [
        { path: "/admin/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
        { path: "/admin/students", label: "Students", icon: <FaUserGraduate /> },
        { path: "/admin/obligations", label: "Obligations", icon: <FaClipboardList /> },
        { path: "/admin/settings", label: "Settings", icon: <FaCog /> },
    ];

    // Logout Handler
    function handleLogout() {
        // localStorage.clear();
        navigate("/");
    }

    return (
        <div className="flex flex-col md:flex-row h-screen bg-white">
            {/* ================= Desktop Sidebar ================= */}
            <div className="hidden md:flex w-64 bg-[#F1F3F4] p-6 flex-col">
                <div className="logo-container flex w-[100%] items-center justify-center">
                    <img src={logo} className="object-contain mb-5  "
                        style={{
                            width: "clamp(50px,28vw,90px)",
                            height: "clamp(50px,28vw,90px)",
                        }} />

                </div>


                <nav className="flex flex-col gap-4 text-primary">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/admin/dashboard"}
                            className={({ isActive }) =>
                                `flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-200 ${isActive ? "font-bold bg-gray-300" : ""
                                }`
                            }
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}

                    {/* ================= Logout Button (Same Style) ================= */}
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-200 text-primary"
                    >
                        <FaSignOutAlt />
                        <span>Sign Out</span>
                    </button>
                </nav>
            </div>

            {/* ================= Main Content ================= */}
            <div className="flex-1 overflow-auto pb-20 md:pb-0">
                <Outlet key={location.pathname} />
            </div>

            {/* ================= Mobile Bottom Navigation ================= */}
            <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t shadow-md flex justify-around items-center h-16 z-50">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/admin/dashboard"}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center text-xs ${isActive ? "text-primary font-bold" : "text-gray-500"
                            }`
                        }
                    >
                        {item.icon}
                        <span className="text-[10px] mt-1">{item.label}</span>
                    </NavLink>
                ))}

                {/* ================= Logout Mobile Button (Same Style) ================= */}
                <button
                    onClick={() => setShowLogoutModal(true)}
                    className="flex flex-col items-center justify-center text-xs text-gray-500 hover:text-primary"
                >
                    <FaSignOutAlt />
                    <span className="text-[10px] mt-1">Sign Out</span>
                </button>
            </div>

            {/* ================= Logout Modal ================= */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-[90%] sm:w-[400px] p-6 relative">
                        {/* Close Icon */}
                        <button
                            onClick={() => setShowLogoutModal(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-black"
                        >
                            <FaTimes size={18} color="#FE8901" />
                        </button>

                        <h2 className="text-lg font-bold mb-3 text-gray-800">
                            Confirm Logout
                        </h2>

                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to log out?
                        </p>

                        <div className="flex justify-end gap-3">
                            {/* No Button */}
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >
                                No
                            </button>

                            {/* Yes Button */}
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-red-700"
                            >
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLayout;
