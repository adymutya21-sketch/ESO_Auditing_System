import React, { useEffect, useState } from "react";
import { FaSortAmountDown } from "react-icons/fa";
import "../../../styles/index.css";


// REVIEWME
// TODO Search Student must be long in desktop and phone
// TODO verified button must be unverifiable
// TODO Tablet mode is not respnosive

/* ================= TYPES ================= */
type Student = {
    id: number;
    name: string;
    studentNumber: string;
    course: string;
    section: string;
    yearLevel: string;

    evaluationsDone: number;
    evaluationsTotal: number;

    obligationsDone: number;
    obligationsTotal: number;

    paymentStatus: "Paid" | "Unpaid";
    verified: boolean;
};

const courses = [
    "Computer Engineering",
    "Electrical Engineering",
    "Electronics Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
];

/* ================= COMPONENT ================= */
const StudentList = () => {
    /* ================= DEFAULT STUDENTS ================= */
    const defaultStudents: Student[] = [
        {
            id: 1,
            name: "Juan Dela Cruz",
            studentNumber: "2023-0001",
            course: "Computer Engineering",
            section: "A",
            yearLevel: "3rd Year",
            evaluationsDone: 2,
            evaluationsTotal: 3,
            obligationsDone: 3,
            obligationsTotal: 3,
            paymentStatus: "Paid",
            verified: false,
        },
        {
            id: 2,
            name: "Maria Santos",
            studentNumber: "2023-0002",
            course: "Electrical Engineering",
            section: "B",
            yearLevel: "3rd Year",
            evaluationsDone: 3,
            evaluationsTotal: 3,
            obligationsDone: 3,
            obligationsTotal: 3,
            paymentStatus: "Paid",
            verified: true,
        },
        {
            id: 3,
            name: "Pedro Ramirez",
            studentNumber: "2023-0003",
            course: "Mechanical Engineering",
            section: "C",
            yearLevel: "4th Year",
            evaluationsDone: 1,
            evaluationsTotal: 3,
            obligationsDone: 2,
            obligationsTotal: 3,
            paymentStatus: "Unpaid",
            verified: false,
        },
    ];

    /* ================= STATE ================= */
    const [students, setStudents] = useState<Student[]>([]);

    const [search, setSearch] = useState("");

    // Dropdown Sort States
    const [courseSort, setCourseSort] = useState("all");
    const [basicSort, setBasicSort] = useState("none");
    const [statusSort, setStatusSort] = useState("none");

    /* ================= LOAD FROM USER OBJECT ================= */
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            // Create user object fully
            const newUser = {
                admin: {
                    students: defaultStudents,
                },
            };

            localStorage.setItem("user", JSON.stringify(newUser));
            setStudents(defaultStudents);
            return;
        }

        const userData = JSON.parse(storedUser);

        if (userData.admin?.students) {
            setStudents(userData.admin.students);
        } else {
            userData.admin.students = defaultStudents;
            localStorage.setItem("user", JSON.stringify(userData));
            setStudents(defaultStudents);
        }
    }, []);

    /* ================= SAVE BACK TO USER ================= */
    useEffect(() => {
        if (students.length === 0) return;

        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;

        const userData = JSON.parse(storedUser);

        userData.admin.students = students;

        localStorage.setItem("user", JSON.stringify(userData));
    }, [students]);

    /* ================= VERIFY RULES ================= */
    function canVerify(student: Student) {
        return (
            student.evaluationsDone === student.evaluationsTotal &&
            student.obligationsDone === student.obligationsTotal &&
            student.paymentStatus === "Paid"
        );
    }

    function handleVerify(student: Student) {
        if (!canVerify(student)) {
            alert("Cannot verify. Requirements not complete.");
            return;
        }

        setStudents((prev) =>
            prev.map((s) =>
                s.id === student.id ? { ...s, verified: true } : s
            )
        );
    }

    function handleVerifyAll() {
        setStudents((prev) =>
            prev.map((s) => (canVerify(s) ? { ...s, verified: true } : s))
        );
    }

    /* ================= FILTERING ================= */
    let filteredStudents = students.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    /* ===== COURSE FILTER ===== */
    if (courseSort !== "all") {
        filteredStudents = filteredStudents.filter(
            (s) => s.course === courseSort
        );
    }

    /* ===== BASIC SORT ===== */
    if (basicSort === "az")
        filteredStudents.sort((a, b) => a.name.localeCompare(b.name));

    if (basicSort === "za")
        filteredStudents.sort((a, b) => b.name.localeCompare(a.name));

    if (basicSort === "year")
        filteredStudents.sort((a, b) =>
            a.yearLevel.localeCompare(b.yearLevel)
        );

    if (basicSort === "section")
        filteredStudents.sort((a, b) =>
            a.section.localeCompare(b.section)
        );

    /* ===== STATUS SORT ===== */
    if (statusSort === "verified")
        filteredStudents = filteredStudents.filter((s) => s.verified);

    if (statusSort === "unverified")
        filteredStudents = filteredStudents.filter((s) => !s.verified);

    if (statusSort === "paid")
        filteredStudents = filteredStudents.filter(
            (s) => s.paymentStatus === "Paid"
        );

    if (statusSort === "unpaid")
        filteredStudents = filteredStudents.filter(
            (s) => s.paymentStatus === "Unpaid"
        );

    if (statusSort === "evalComplete")
        filteredStudents = filteredStudents.filter(
            (s) => s.evaluationsDone === s.evaluationsTotal
        );

    if (statusSort === "obligationComplete")
        filteredStudents = filteredStudents.filter(
            (s) => s.obligationsDone === s.obligationsTotal
        );

    /* ================= CSV DOWNLOAD ================= */
    function downloadCSV() {
        const headers = [
            "Name",
            "Student Number",
            "Course",
            "Year Level",
            "Section",
            "Evaluations",
            "Obligations",
            "Payment",
            "Verified",
        ];

        const rows = filteredStudents.map((s) => [
            s.name,
            s.studentNumber,
            s.course,
            s.yearLevel,
            s.section,
            `${s.evaluationsDone}/${s.evaluationsTotal}`,
            `${s.obligationsDone}/${s.obligationsTotal}`,
            s.paymentStatus,
            s.verified ? "Yes" : "No",
        ]);

        const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "students.csv";
        link.click();
    }

    /* ================= UI ================= */
    return (
        <div className="p-4 sm:p-6 md:p-10 bg-gray-50 min-h-screen">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
                <h1 className="font-bold text-gray-800 text-2xl sm:text-4xl">
                    Student List
                </h1>

                <div className="flex gap-2">
                    <button
                        onClick={downloadCSV}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm"
                    >
                        Download Excel
                    </button>

                    <button
                        onClick={handleVerifyAll}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        Verify All
                    </button>
                </div>
            </div>

            {/* SEARCH + DROPDOWNS */}
            <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
                {/* SEARCH */}
                <input
                    type="text"
                    placeholder="Search student..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm w-full lg:w-1/3"
                />

                {/* DROPDOWNS */}
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-2/3 justify-end">
                    {/* COURSE FILTER */}
                    <select
                        value={courseSort}
                        onChange={(e) => setCourseSort(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm bg-white"
                    >
                        <option value="all">All Courses</option>
                        {courses.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>

                    {/* BASIC SORT */}
                    <select
                        value={basicSort}
                        onChange={(e) => setBasicSort(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm bg-white"
                    >
                        <option value="none">Sort (Basic)</option>
                        <option value="az">Name A–Z</option>
                        <option value="za">Name Z–A</option>
                        <option value="year">By Year Level</option>
                        <option value="section">By Section</option>
                    </select>

                    {/* STATUS SORT */}
                    <select
                        value={statusSort}
                        onChange={(e) => setStatusSort(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm bg-white"
                    >
                        <option value="none">Sort (Status)</option>
                        <option value="verified">Verified</option>
                        <option value="unverified">Unverified</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                        <option value="evalComplete">Eval Complete</option>
                        <option value="obligationComplete">
                            Obligations Complete
                        </option>
                    </select>
                </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto rounded-xl shadow bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-200 text-gray-800">
                        <tr>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-center">Student No.</th>
                            <th className="p-3 text-center">Course</th>
                            <th className="p-3 text-center">Year</th>
                            <th className="p-3 text-center">Section</th>
                            <th className="p-3 text-center">Evaluation</th>
                            <th className="p-3 text-center">Obligation</th>
                            <th className="p-3 text-center">Payment</th>
                            <th className="p-3 text-center">Verify</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredStudents.map((s) => (
                            <tr
                                key={s.id}
                                className="border-b hover:bg-gray-50"
                            >
                                <td className="p-3">{s.name}</td>
                                <td className="p-3 text-center">{s.studentNumber}</td>
                                <td className="p-3 text-center">{s.course}</td>
                                <td className="p-3 text-center">{s.yearLevel}</td>
                                <td className="p-3 text-center">{s.section}</td>

                                <td className="p-3 text-center">
                                    {s.evaluationsDone}/{s.evaluationsTotal}
                                </td>

                                <td className="p-3 text-center">
                                    {s.obligationsDone}/{s.obligationsTotal}
                                </td>

                                <td
                                    className={`p-3 text-center font-semibold ${s.paymentStatus === "Paid"
                                        ? "text-green-600"
                                        : "text-red-500"
                                        }`}
                                >
                                    {s.paymentStatus}
                                </td>

                                <td className="p-3 text-center">
                                    {s.verified ? (
                                        <span className="text-green-600 font-bold">
                                            Verified
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => handleVerify(s)}
                                            className="bg-primary text-white px-3 py-1 rounded-lg"
                                        >
                                            Verify
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentList;
