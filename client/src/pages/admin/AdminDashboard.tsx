import { useState, useEffect } from "react";
import {
    FaUsers,
    FaDollarSign,
    FaFileInvoiceDollar,
    FaSortAmountDown,
} from "react-icons/fa";

// REVIEWME
//// TODO Fix the UI


import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "../../../styles/index.css";

export default function AdminDashboard() {
    const [adminDashboardData, setAdminDashboardData] = useState({
        verifiedStudents: 120,
        totalPaid: 95,
        paidObligations: 75,
        departments: {
            "Computer Engineering": 30,
            "Electrical Engineering": 25,
            "Electronics Engineering": 20,
            "Mechanical Engineering": 15,
            "Civil Engineering": 10,
        },
    });

    const [sortOption, setSortOption] = useState("department");

    // Load admin data from localStorage
    useEffect(() => {
        const data = localStorage.getItem("admin");

        if (data) {
            setAdminDashboardData(JSON.parse(data));
        } else {
            localStorage.setItem("admin", JSON.stringify(adminDashboardData));
        }
    }, []);

    // -----------------------------
    // ✅ Sorting Logic FIXED
    // -----------------------------
    let departmentEntries = Object.entries(adminDashboardData.departments);

    if (sortOption === "department") {
        departmentEntries.sort((a, b) => a[0].localeCompare(b[0]));
    }

    if (sortOption === "value") {
        departmentEntries.sort((a, b) => b[1] - a[1]);
    }

    // Extract sorted labels + values
    const departmentLabels = departmentEntries.map((entry) => entry[0]);
    const departmentValues = departmentEntries.map((entry) => entry[1]);

    return (
        <div className="admin-main flex-1 p-4 sm:p-6 md:p-8 overflow-auto mb-16 md:mb-0">
            {/* ================= STAT CARDS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
                <StatCard
                    icon={<FaUsers size={24} />}
                    label="Verified Students"
                    value={adminDashboardData.verifiedStudents}
                    description="Total verified students"
                />

                <StatCard
                    icon={<FaDollarSign size={24} />}
                    label="Total Paid"
                    value={adminDashboardData.totalPaid}
                    description="Total paid students"
                />

                <StatCard
                    icon={<FaFileInvoiceDollar size={24} />}
                    label="Paid Obligations"
                    value={adminDashboardData.paidObligations}
                    description="Obligations paid"
                />
            </div>

            {/* ================= BAR GRAPH ================= */}
            <div
                className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow w-full"
                style={{ height: "420px" }}
            >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-700">
                        Engineering Department Statistics
                    </h2>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2 text-primary cursor-pointer">
                        <FaSortAmountDown />

                        <select
                            className="border border-gray-300 rounded p-1 text-sm"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="department">Sort A-Z</option>
                            <option value="value">Sort by Highest</option>
                        </select>
                    </div>
                </div>

                {/* Chart */}
                <Bar
                    data={{
                        labels: departmentLabels,
                        datasets: [
                            {
                                label: "Number of Students",
                                data: departmentValues,

                                // ✅ Dark Orange Primary Bar Color
                                backgroundColor: "#C2410C",

                                borderRadius: 8,
                                barThickness: 40,
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,

                        plugins: {
                            legend: {
                                display: false,
                            },
                        },

                        scales: {
                            x: {
                                ticks: {
                                    color: "#444",
                                    font: {
                                        size: 12,
                                    },
                                },
                            },
                            y: {
                                ticks: {
                                    color: "#444",
                                    font: {
                                        size: 12,
                                    },
                                },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
}

/* ================= STAT CARD ================= */
export function StatCard({
    icon,
    label,
    value,
    description,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    description: string;
}) {
    return (
        <div className="bg-primary text-white rounded-lg p-4 sm:p-6 flex flex-col justify-between shadow relative min-w-[150px]">
            <div className="absolute top-3 right-3">{icon}</div>

            <div className="text-2xl sm:text-3xl md:text-4xl font-bold mt-4">
                {value}
            </div>

            <div className="mt-2 text-sm sm:text-base">{label}</div>

            <div className="text-xs sm:text-sm opacity-80">{description}</div>
        </div>
    );
}
