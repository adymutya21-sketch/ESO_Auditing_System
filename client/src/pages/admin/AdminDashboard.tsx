import React, { useEffect, useState } from "react";

// REVIEWME
// TODO Make Icon primary color
// TODO Make the bar graph horizontal

import {
    FaUsers,
    FaDollarSign,
    FaFileInvoiceDollar,
    FaSortAmountDown,
} from "react-icons/fa";

import { Bar, Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";

import {
    CircularProgressbar,
    buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";
import "../../../styles/index.css";

/* ================= TYPES ================= */
type DepartmentData = {
    verifiedStudents: number;
    totalPaid: number;
    paidObligations: number;
    totalStudents: number;
};

const departmentKeys = [
    "ComputerEngineering",
    "ElectricalEngineering",
    "MechanicalEngineering",
    "ElectronicsEngineering",
    "CivilEngineering",
];

/* ================= MAIN DASHBOARD ================= */
export default function AdminDashboard() {
    const primaryOrange = "#C2410C";

    /* ================= STATE ================= */
    const [selectedDept, setSelectedDept] = useState("ComputerEngineering");

    const [departmentsData, setDepartmentsData] = useState<{
        [key: string]: DepartmentData;
    }>({
        ComputerEngineering: {
            verifiedStudents: 30,
            totalPaid: 28,
            paidObligations: 25,
            totalStudents: 35,
        },
        ElectricalEngineering: {
            verifiedStudents: 22,
            totalPaid: 18,
            paidObligations: 15,
            totalStudents: 30,
        },
        MechanicalEngineering: {
            verifiedStudents: 14,
            totalPaid: 10,
            paidObligations: 9,
            totalStudents: 25,
        },
        ElectronicsEngineering: {
            verifiedStudents: 18,
            totalPaid: 15,
            paidObligations: 13,
            totalStudents: 28,
        },
        CivilEngineering: {
            verifiedStudents: 10,
            totalPaid: 8,
            paidObligations: 6,
            totalStudents: 20,
        },
    });

    /* ================= LOCAL STORAGE LOAD ================= */
    useEffect(() => {
        const userRaw = localStorage.getItem("user");

        if (!userRaw) {
            localStorage.setItem(
                "user",
                JSON.stringify({
                    admin: {
                        departments: departmentsData,
                    },
                })
            );
            return;
        }

        const userData = JSON.parse(userRaw);

        if (userData.admin?.departments) {
            setDepartmentsData(userData.admin.departments);
        }
    }, []);

    /* ================= LOCAL STORAGE SAVE ================= */
    useEffect(() => {
        const userRaw = localStorage.getItem("user");
        if (!userRaw) return;

        const userData = JSON.parse(userRaw);

        userData.admin.departments = departmentsData;

        localStorage.setItem("user", JSON.stringify(userData));
    }, [departmentsData]);

    /* ================= CURRENT DEPARTMENT ================= */
    const deptStats = departmentsData[selectedDept];

    const verifiedPercent = Math.round(
        (deptStats.verifiedStudents / deptStats.totalStudents) * 100
    );

    /* ================= BAR CHART ================= */
    const barChartData = {
        labels: departmentKeys.map((key) =>
            key.replace(/([A-Z])/g, " $1").trim()
        ),
        datasets: [
            {
                label: "Verified Students",
                data: departmentKeys.map(
                    (key) => departmentsData[key].verifiedStudents
                ),
                backgroundColor: primaryOrange,
                borderRadius: 8,
                barThickness: 28,
            },
        ],
    };

    /* ================= DOUGHNUT ================= */
    const doughnutData = {
        labels: ["Paid", "Unpaid"],
        datasets: [
            {
                data: [
                    deptStats.totalPaid,
                    deptStats.totalStudents - deptStats.totalPaid,
                ],
                backgroundColor: [primaryOrange, "#E5E7EB"],
                borderWidth: 0,
            },
        ],
    };

    return (
        <div className="p-4 sm:p-6 md:p-10 bg-gray-50 min-h-screen">
            {/* ================= HEADER ================= */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Admin Dashboard
                </h1>

                {/* Department Selector */}
                <div className="flex items-center gap-2 bg-white shadow px-4 py-2 rounded-lg">
                    <FaSortAmountDown className="text-gray-500" />
                    <select
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="outline-none text-sm bg-transparent"
                    >
                        {departmentKeys.map((key) => (
                            <option key={key} value={key}>
                                {key.replace(/([A-Z])/g, " $1").trim()}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ================= STAT CARD GRID ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                {/* BIG VERIFIED CARD */}
                <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <h2 className="font-semibold text-gray-700 text-lg">
                            Verified Students
                        </h2>
                        <FaUsers size={22} className="text-gray-400" />
                    </div>

                    {/* Taco Meter */}
                    <div className="w-32 h-32 mx-auto mt-6">
                        <CircularProgressbar
                            value={verifiedPercent}
                            text={`${verifiedPercent}%`}
                            styles={buildStyles({
                                pathColor: primaryOrange,
                                textColor: "#111827",
                                trailColor: "#F3F4F6",
                            })}
                        />
                    </div>

                    {/* Footer */}
                    <p className="text-center text-gray-500 text-sm mt-4">
                        {deptStats.verifiedStudents} out of {deptStats.totalStudents} students
                        verified
                    </p>
                </div>

                {/* SMALL CARD 1 */}
                <StatMiniCard
                    title="Total Paid"
                    icon={<FaDollarSign />}
                    value={deptStats.totalPaid}
                    percent={Math.round(
                        (deptStats.totalPaid / deptStats.totalStudents) * 100
                    )}
                    color={primaryOrange}
                />

                {/* SMALL CARD 2 */}
                <StatMiniCard
                    title="Paid Obligations"
                    icon={<FaFileInvoiceDollar />}
                    value={deptStats.paidObligations}
                    percent={Math.round(
                        (deptStats.paidObligations / deptStats.totalStudents) * 100
                    )}
                    color={primaryOrange}
                />
            </div>

            {/* ================= CHARTS ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* BAR GRAPH */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="font-semibold text-gray-700 mb-4">
                        Verified Students by Department
                    </h2>

                    <div className="h-[320px] w-full">
                        <Bar
                            data={barChartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                            }}
                        />
                    </div>
                </div>

                {/* PAYMENT GRAPH */}
                <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
                    <h2 className="font-semibold text-gray-700 mb-4">
                        Payment Distribution
                    </h2>

                    <div className="h-[320px] flex justify-center items-center">
                        <Doughnut
                            data={doughnutData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ================= MINI CARD COMPONENT ================= */
function StatMiniCard({
    title,
    icon,
    value,
    percent,
    color,
}: {
    title: string;
    icon: React.ReactNode;
    value: number;
    percent: number;
    color: string;
}) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-start">
                <h2 className="font-semibold text-gray-700 text-lg">{title}</h2>
                <div className="text-gray-400 text-xl">{icon}</div>
            </div>

            {/* Value */}
            <div className="mt-6">
                <p className="text-3xl font-bold text-gray-800">{value}</p>
                <p className="text-sm text-gray-500 mt-1">
                    {percent}% completion rate
                </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-5">
                <div
                    className="h-2 rounded-full"
                    style={{
                        width: `${percent}%`,
                        backgroundColor: color,
                    }}
                ></div>
            </div>
        </div>
    );
}
