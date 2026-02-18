import React, { useEffect, useState } from "react";
import { FaSortAmountDown } from "react-icons/fa";
import "../../../styles/index.css";

// REVIEWME
// TODO Fix the UI

type Student = {
    id: number;
    name: string;
    studentNumber: string;
    course: string;
    section: string;

    evaluationsDone: number;
    evaluationsTotal: number;

    obligationsDone: number;
    obligationsTotal: number;

    paymentStatus: "Paid" | "Unpaid";

    verified: boolean;
};

const StudentList = () => {
    // -----------------------------
    // Default Dummy Students
    // -----------------------------
    const defaultStudents: Student[] = [
        {
            id: 1,
            name: "Juan Dela Cruz",
            studentNumber: "2023-0001",
            course: "Computer Engineering",
            section: "A",
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
            evaluationsDone: 1,
            evaluationsTotal: 3,
            obligationsDone: 2,
            obligationsTotal: 3,
            paymentStatus: "Unpaid",
            verified: false,
        },
    ];

    // -----------------------------
    // LocalStorage
    // -----------------------------
    const [students, setStudents] = useState<Student[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("students");

        if (stored) {
            setStudents(JSON.parse(stored));
        } else {
            localStorage.setItem("students", JSON.stringify(defaultStudents));
            setStudents(defaultStudents);
        }
    }, []);

    useEffect(() => {
        if (students.length > 0) {
            localStorage.setItem("students", JSON.stringify(students));
        }
    }, [students]);

    // -----------------------------
    // UI States
    // -----------------------------
    const [search, setSearch] = useState("");

    // Single Sort Dropdown State
    const [sortOption, setSortOption] = useState("all");

    // Modals
    const [evaluationModal, setEvaluationModal] = useState<Student | null>(null);
    const [obligationModal, setObligationModal] = useState<Student | null>(null);
    const [unverifyModal, setUnverifyModal] = useState<Student | null>(null);

    // -----------------------------
    // Verify Rules
    // -----------------------------
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

    function handleUnverify(student: Student) {
        setStudents((prev) =>
            prev.map((s) =>
                s.id === student.id ? { ...s, verified: false } : s
            )
        );
        setUnverifyModal(null);
    }

    // -----------------------------
    // Filtering + Sorting
    // -----------------------------
    let filteredStudents = students.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    // Sort Dropdown Filters
    if (sortOption === "evalComplete") {
        filteredStudents = filteredStudents.filter(
            (s) => s.evaluationsDone === s.evaluationsTotal
        );
    }

    if (sortOption === "obligationComplete") {
        filteredStudents = filteredStudents.filter(
            (s) => s.obligationsDone === s.obligationsTotal
        );
    }

    if (sortOption === "paid") {
        filteredStudents = filteredStudents.filter(
            (s) => s.paymentStatus === "Paid"
        );
    }

    if (sortOption === "unpaid") {
        filteredStudents = filteredStudents.filter(
            (s) => s.paymentStatus === "Unpaid"
        );
    }

    if (sortOption === "verified") {
        filteredStudents = filteredStudents.filter((s) => s.verified);
    }

    if (sortOption === "unverified") {
        filteredStudents = filteredStudents.filter((s) => !s.verified);
    }

    // Sorting Name
    if (sortOption === "az") {
        filteredStudents.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortOption === "za") {
        filteredStudents.sort((a, b) => b.name.localeCompare(a.name));
    }

    // Sorting by Course
    if (sortOption === "course") {
        filteredStudents.sort((a, b) => a.course.localeCompare(b.course));
    }

    // Sorting by Section
    if (sortOption === "section") {
        filteredStudents.sort((a, b) => a.section.localeCompare(b.section));
    }

    // -----------------------------
    // Download CSV
    // -----------------------------
    function downloadCSV() {
        const headers = [
            "Name",
            "Student Number",
            "Course",
            "Section",
            "Evaluations",
            "Obligations",
            "Payment",
            "Verified",
        ];

        const rows = students.map((s) => [
            s.name,
            s.studentNumber,
            s.course,
            s.section,
            `${s.evaluationsDone}/${s.evaluationsTotal}`,
            `${s.obligationsDone}/${s.obligationsTotal}`,
            s.paymentStatus,
            s.verified ? "Yes" : "No",
        ]);

        const csvContent =
            [headers, ...rows].map((r) => r.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "students.csv";
        link.click();
    }

    return (
        <div className="p-4 sm:p-6 md:p-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
                <h1 className="font-bold text-gray-800 text-2xl sm:text-4xl">
                    Student List
                </h1>

                <button
                    onClick={downloadCSV}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm"
                >
                    Download Excel
                </button>
            </div>

            {/* Search + Sort */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {/* Search */}
                <input
                    type="text"
                    placeholder="Search student..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm w-full sm:w-1/2"
                />

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white w-full sm:w-1/2">
                    <FaSortAmountDown className="text-gray-500" />

                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="w-full outline-none text-sm bg-transparent"
                    >
                        <option value="all">Sort By...</option>

                        <option value="az">Name A-Z</option>
                        <option value="za">Name Z-A</option>

                        <option value="course">By Course</option>
                        <option value="section">By Section</option>

                        <option value="evalComplete">Complete Evaluation (3/3)</option>
                        <option value="obligationComplete">Complete Obligation (3/3)</option>

                        <option value="paid">Paid Students</option>
                        <option value="unpaid">Unpaid Students</option>

                        <option value="verified">Verified Students</option>
                        <option value="unverified">Unverified Students</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="w-full text-sm">
                    <thead className="bg-gray-300 text-gray-800">
                        <tr>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3">Student No.</th>
                            <th className="p-3">Course</th>
                            <th className="p-3">Section</th>
                            <th className="p-3">Evaluation</th>
                            <th className="p-3">Obligation</th>
                            <th className="p-3">Payment</th>
                            <th className="p-3">Verification</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredStudents.map((student) => (
                            <tr
                                key={student.id}
                                className="bg-gray-100 border-b hover:bg-gray-200"
                            >
                                <td className="p-3">{student.name}</td>
                                <td className="p-3 text-center">{student.studentNumber}</td>
                                <td className="p-3 text-center">{student.course}</td>
                                <td className="p-3 text-center">{student.section}</td>

                                {/* Evaluation Modal */}
                                <td
                                    onClick={() => setEvaluationModal(student)}
                                    className="p-3 text-center text-blue-600 cursor-pointer underline"
                                >
                                    {student.evaluationsDone}/{student.evaluationsTotal}
                                </td>

                                {/* Obligation Modal */}
                                <td
                                    onClick={() => setObligationModal(student)}
                                    className="p-3 text-center text-blue-600 cursor-pointer underline"
                                >
                                    {student.obligationsDone}/{student.obligationsTotal}
                                </td>

                                {/* Payment */}
                                <td
                                    className={`p-3 text-center font-semibold ${student.paymentStatus === "Paid"
                                        ? "text-green-600"
                                        : "text-red-500"
                                        }`}
                                >
                                    {student.paymentStatus}
                                </td>

                                {/* Verification */}
                                <td className="p-3 text-center">
                                    {student.verified ? (
                                        <button
                                            onClick={() => setUnverifyModal(student)}
                                            className="bg-green-600 text-white px-3 py-1 rounded-lg"
                                        >
                                            Verified
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleVerify(student)}
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

            {/* ================= Evaluation Modal ================= */}
            {evaluationModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-6 w-[90%] sm:w-[400px]">
                        <h2 className="font-bold text-lg mb-3">Evaluation Details</h2>

                        <p>
                            Student: <b>{evaluationModal.name}</b>
                        </p>
                        <p>
                            Completed:{" "}
                            <b>
                                {evaluationModal.evaluationsDone}/
                                {evaluationModal.evaluationsTotal}
                            </b>
                        </p>

                        <button
                            className="mt-5 bg-primary text-white px-4 py-2 rounded-lg"
                            onClick={() => setEvaluationModal(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* ================= Obligation Modal ================= */}
            {obligationModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-6 w-[90%] sm:w-[400px]">
                        <h2 className="font-bold text-lg mb-3">Obligation Details</h2>

                        <p>
                            Student: <b>{obligationModal.name}</b>
                        </p>
                        <p>
                            Completed:{" "}
                            <b>
                                {obligationModal.obligationsDone}/
                                {obligationModal.obligationsTotal}
                            </b>
                        </p>

                        <button
                            className="mt-5 bg-primary text-white px-4 py-2 rounded-lg"
                            onClick={() => setObligationModal(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* ================= Unverify Modal ================= */}
            {unverifyModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-6 w-[90%] sm:w-[400px]">
                        <h2 className="font-bold text-lg mb-4">Unverify Student?</h2>

                        <p>
                            Are you sure you want to unverify{" "}
                            <b>{unverifyModal.name}</b>?
                        </p>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                className="px-4 py-2 rounded-lg bg-gray-300"
                                onClick={() => setUnverifyModal(null)}
                            >
                                No
                            </button>

                            <button
                                className="px-4 py-2 rounded-lg bg-red-600 text-white"
                                onClick={() => handleUnverify(unverifyModal)}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentList;
