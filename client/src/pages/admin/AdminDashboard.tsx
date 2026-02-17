import { useState, useEffect } from "react";
import {
    FaTachometerAlt,
    FaUserGraduate,
    FaClipboardList,
    FaFileAlt,
    FaCog,
    FaSignOutAlt,
    FaUsers,
    FaDollarSign,
    FaFileInvoiceDollar,
    FaSortAmountDown
} from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import "../../../styles/index.css";

export default function AdminDashboard() {
    const [adminData, setAdminData] = useState({
        verifiedStudents: 120,
        totalPaid: 95,
        paidObligations: 75,
        departments: {
            "Computer Engineering": 30,
            "Electrical Engineering": 25,
            "Electronics Engineering": 20,
            "Mechanical Engineering": 15,
            "Civil Engineering": 10
        }
    });

    const [activeNav, setActiveNav] = useState("dashboard");
    const [sortOption, setSortOption] = useState("department");

    useEffect(() => {
        const data = localStorage.getItem("admin");
        if (data) setAdminData(JSON.parse(data));
        else localStorage.setItem("admin", JSON.stringify(adminData));
    }, [adminData]);

    const departmentLabels = Object.keys(adminData.departments);
    const departmentValues = Object.values(adminData.departments);

    const navItems = [
        { key: "Admin", label: "Admin", icon: <FaTachometerAlt /> },
        { key: "students", label: "Students", icon: <FaUserGraduate /> },
        { key: "obligations", label: "Obligations", icon: <FaClipboardList /> },
        { key: "documents", label: "Documents", icon: <FaFileAlt /> },
        { key: "settings", label: "Settings", icon: <FaCog /> },
        { key: "signout", label: "Sign Out", icon: <FaSignOutAlt /> },
    ];

    return (
        <div className="side-bar flex flex-col md:flex-row h-screen bg-white">
            {/* Sidebar for Desktop */}
            <div className="desktop-sidebar hidden md:flex w-64 bg-[#F1F3F4] p-6 flex-col">
                <div className="desktop-sidebar-logo font-bold text-primary mb-10">AdminLogo</div>
                <nav className="navigation-bar flex flex-col gap-4 text-primary">
                    {navItems.map((item) => (
                        <NavItem
                            key={item.key}
                            icon={item.icon}
                            label={item.label}
                            active={activeNav === item.key}
                            onClick={() => setActiveNav(item.key)}
                        />
                    ))}
                </nav>
            </div>
            {/* Main Content */}
            <div className="admin-main flex-1 p-4 sm:p-6 md:p-8 overflow-auto mb-16 md:mb-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-6">
                    {navItems.find(n => n.key === activeNav)?.label} Dashboard
                </h1>
                {/* Only show stats and graph if dashboard is active */}
                {activeNav === "dashboard" && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
                            <StatCard
                                icon={<FaUsers size={24} />}
                                label="Verified Students"
                                value={adminData.verifiedStudents}
                                description="Total verified students"
                            />
                            <StatCard
                                icon={<FaDollarSign size={24} />}
                                label="Total Paid"
                                value={adminData.totalPaid}
                                description="Total paid students"
                            />
                            <StatCard
                                icon={<FaFileInvoiceDollar size={24} />}
                                label="Paid Obligations"
                                value={adminData.paidObligations}
                                description="Obligations paid"
                            />
                        </div>
                        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow w-full" style={{ height: '400px' }}>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
                                <h2 className="text-xl sm:text-2xl font-bold text-black">
                                    Department Statistics
                                </h2>
                                <div className="flex items-center gap-2 text-primary cursor-pointer">
                                    <FaSortAmountDown />
                                    <select
                                        className="border border-gray-300 rounded p-1"
                                        value={sortOption}
                                        onChange={(e) => setSortOption(e.target.value)}
                                    >
                                        <option value="department">Sort by Department</option>
                                        <option value="value">Sort by Value</option>
                                    </select>
                                </div>
                            </div>

                            <Bar
                                data={{
                                    labels: departmentLabels,
                                    datasets: [
                                        {
                                            label: "Number of Students",
                                            data: departmentValues,
                                            backgroundColor: "#3B82F6"
                                        }
                                    ]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                }}
                                height={400} // <- Chart height fixed
                            />
                        </div>

                    </>
                )}
            </div>

            {/* Bottom Navigation for Mobile/Tablet */}
            <div className="bottom-navigation-mobile fixed bottom-0 left-0 right-0 md:hidden bg-white border-t shadow-md flex justify-around items-center h-16 z-50">
                {navItems.map((item) => (
                    <button
                        key={item.key}
                        className={`flex flex-col items-center justify-center text-xs ${activeNav === item.key ? "text-primary font-bold" : "text-gray-500"
                            }`}
                        onClick={() => setActiveNav(item.key)}
                    >
                        {item.icon}
                        <span className="text-[10px] mt-1">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

// Sidebar Navigation Item
function NavItem({ icon, label, active, onClick }) {
    return (
        <div
            className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-200 ${active ? "font-bold bg-gray-300" : ""
                }`}
            onClick={onClick}
        >
            {icon}
            <span>{label}</span>
        </div>
    );
}

// Statistic Card
function StatCard({ icon, label, value, description }) {
    return (
        <div className="bg-primary text-white rounded-lg p-4 sm:p-6 flex flex-col justify-between shadow relative min-w-[150px]">
            <div className="absolute top-3 right-3">{icon}</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold mt-4">{value}%</div>
            <div className="mt-2 text-sm sm:text-base">{label}</div>
            <div className="text-xs sm:text-sm opacity-80">{description}</div>
        </div>
    );
}
