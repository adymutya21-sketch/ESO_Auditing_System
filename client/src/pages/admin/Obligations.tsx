import React, { useEffect, useState } from "react";
import { FaPlus, FaList, FaEdit, FaTrash, FaMinus, FaSort } from "react-icons/fa";
import "../../../styles/index.css";


// REVIEWME
// TODO Fix the UI


type Obligation = {
    id: number;
    title: string;
    notes: string;

    dueDate: string;
    dueTime: string;
    frequency: string;

    createdBy: string;
    status: "Active" | "Inactive";

    createdOn: string;
    lastModified: string;
};

const Obligations = () => {
    // -----------------------------
    // Default Obligations
    // -----------------------------
    const defaultObligations: Obligation[] = [
        {
            id: 1,
            title: "Submit Clearance Form",
            notes: "All students must submit clearance before finals.",
            dueDate: "2026-03-01",
            dueTime: "17:00",
            frequency: "One-time",
            createdBy: "Admin",
            status: "Active",
            createdOn: "2026-01-01",
            lastModified: "2026-01-10",
        },
        {
            id: 2,
            title: "Library Return Requirement",
            notes: "Return all borrowed books before verification.",
            dueDate: "2026-03-10",
            dueTime: "15:00",
            frequency: "Semester",
            createdBy: "Admin",
            status: "Active",
            createdOn: "2026-01-05",
            lastModified: "2026-01-12",
        },
    ];

    // -----------------------------
    // LocalStorage under "admin"
    // -----------------------------
    const [obligations, setObligations] = useState<Obligation[]>([]);

    useEffect(() => {
        const storedAdmin = localStorage.getItem("admin");

        if (storedAdmin) {
            const parsed = JSON.parse(storedAdmin);

            if (parsed.obligations) {
                setObligations(parsed.obligations);
            } else {
                parsed.obligations = defaultObligations;
                localStorage.setItem("admin", JSON.stringify(parsed));
                setObligations(defaultObligations);
            }
        } else {
            const newAdmin = {
                verifiedStudents: 120,
                totalPaid: 95,
                paidObligations: 75,
                departments: {},
                obligations: defaultObligations,
            };
            localStorage.setItem("admin", JSON.stringify(newAdmin));
            setObligations(defaultObligations);
        }
    }, []);

    useEffect(() => {
        const storedAdmin = localStorage.getItem("admin");
        if (storedAdmin) {
            const parsed = JSON.parse(storedAdmin);
            parsed.obligations = obligations;
            localStorage.setItem("admin", JSON.stringify(parsed));
        }
    }, [obligations]);

    // -----------------------------
    // UI States
    // -----------------------------
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<number[]>([]);
    const [mode, setMode] = useState<"list" | "edit">("list");
    const [sortOption, setSortOption] = useState("Newest");

    const [activeObligation, setActiveObligation] =
        useState<Obligation | null>(null);

    // -----------------------------
    // Checkbox Select
    // -----------------------------
    function toggleSelect(id: number) {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    }

    function toggleSelectAll() {
        if (selected.length === obligations.length) {
            setSelected([]);
        } else {
            setSelected(obligations.map((o) => o.id));
        }
    }

    function deleteSelected() {
        if (!window.confirm("Delete all selected obligations?")) return;

        setObligations((prev) => prev.filter((o) => !selected.includes(o.id)));
        setSelected([]);
    }

    // -----------------------------
    // Add / Edit
    // -----------------------------
    function openAdd() {
        setActiveObligation({
            id: Date.now(),
            title: "",
            notes: "",
            dueDate: "",
            dueTime: "",
            frequency: "One-time",
            createdBy: "",
            status: "Active",
            createdOn: new Date().toLocaleDateString(),
            lastModified: new Date().toLocaleDateString(),
        });
        setMode("edit");
    }

    function openEdit(obligation: Obligation) {
        setActiveObligation({ ...obligation });
        setMode("edit");
    }

    function saveObligation() {
        if (!activeObligation) return;

        setObligations((prev) => {
            const exists = prev.find((o) => o.id === activeObligation.id);

            if (exists) {
                return prev.map((o) =>
                    o.id === activeObligation.id
                        ? {
                            ...activeObligation,
                            lastModified: new Date().toLocaleDateString(),
                        }
                        : o
                );
            }

            return [...prev, activeObligation];
        });

        setMode("list");
        setActiveObligation(null);
    }

    function deleteObligation(id: number) {
        if (!window.confirm("Delete this obligation?")) return;
        setObligations((prev) => prev.filter((o) => o.id !== id));
        setMode("list");
    }

    // -----------------------------
    // Filtering + Sorting
    // -----------------------------
    let filtered = obligations.filter((o) =>
        o.title.toLowerCase().includes(search.toLowerCase())
    );

    if (sortOption === "A-Z") {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortOption === "Newest") {
        filtered.sort((a, b) => b.id - a.id);
    }

    return (
        <div className="p-4 sm:p-6 md:p-10">
            <h1 className="font-bold text-gray-800 text-2xl sm:text-4xl mb-3">
                Obligations
            </h1>

            {/* ================= TOP BAR ================= */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
                <input
                    className="border rounded-lg px-3 py-2 w-full sm:w-1/2 text-sm"
                    placeholder="Search obligations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="flex gap-2 items-center flex-wrap">
                    {mode === "list" ? (
                        <>
                            <button
                                onClick={openAdd}
                                className="bg-primary text-white px-3 py-2 rounded-lg flex items-center gap-2"
                            >
                                <FaPlus /> Add
                            </button>

                            <button
                                onClick={toggleSelectAll}
                                className="bg-gray-200 px-3 py-2 rounded-lg text-sm"
                            >
                                Select All
                            </button>

                            {selected.length > 0 && (
                                <button
                                    onClick={deleteSelected}
                                    className="bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-2"
                                >
                                    <FaTrash /> Delete Selected
                                </button>
                            )}

                            {/* Sort */}
                            <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-white">
                                <FaSort className="text-gray-500" />
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="text-sm outline-none"
                                >
                                    <option value="Newest">Newest</option>
                                    <option value="A-Z">Title A-Z</option>
                                </select>
                            </div>
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                setMode("list");
                                setActiveObligation(null);
                            }}
                            className="bg-primary text-white px-3 py-2 rounded-lg flex items-center gap-2"
                        >
                            <FaList /> List
                        </button>
                    )}
                </div>
            </div>

            {/* ================= LIST MODE ================= */}
            {mode === "list" && (
                <div className="flex flex-col gap-4">
                    {filtered.map((o) => (
                        <div
                            key={o.id}
                            className="bg-gray-100 rounded-lg p-6 shadow relative flex flex-col gap-2"
                        >
                            {/* Checkbox */}
                            <input
                                type="checkbox"
                                checked={selected.includes(o.id)}
                                onChange={() => toggleSelect(o.id)}
                                className="absolute top-4 left-4 w-5 h-5"
                            />

                            {/* Edit */}
                            <button
                                onClick={() => openEdit(o)}
                                className="absolute top-4 right-4 text-primary text-lg"
                            >
                                <FaEdit />
                            </button>

                            <h2 className="font-bold text-lg pl-8">{o.title}</h2>
                            <p className="text-sm text-gray-600 pl-8">{o.notes}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-sm pl-8">
                                <div>
                                    <p>
                                        <b>Due Date:</b> {o.dueDate}
                                    </p>
                                    <p>
                                        <b>Due Time:</b> {o.dueTime}
                                    </p>
                                    <p>
                                        <b>Frequency:</b> {o.frequency}
                                    </p>
                                </div>

                                <div>
                                    <p>
                                        <b>Created By:</b> {o.createdBy}
                                    </p>
                                    <p>
                                        <b>Created On:</b> {o.createdOn}
                                    </p>
                                    <p>
                                        <b>Last Modified:</b> {o.lastModified}
                                    </p>
                                </div>
                            </div>

                            {/* Delete */}
                            <button
                                onClick={() => deleteObligation(o.id)}
                                className="absolute bottom-4 right-4 text-primary text-lg"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* ================= EDIT MODE ================= */}
            {mode === "edit" && activeObligation && (
                <div className="bg-gray-100 rounded-lg p-6 shadow relative">
                    {/* Exit */}
                    <button
                        onClick={() => {
                            setMode("list");
                            setActiveObligation(null);
                        }}
                        className="absolute top-4 right-4 text-primary text-xl"
                    >
                        <FaMinus />
                    </button>

                    <h2 className="font-bold text-xl mb-5">Obligation Details</h2>

                    {/* Title */}
                    <input
                        className="border rounded-lg px-3 py-2 w-full mb-3"
                        placeholder="Obligation Title"
                        value={activeObligation.title}
                        onChange={(e) =>
                            setActiveObligation({ ...activeObligation, title: e.target.value })
                        }
                    />

                    {/* Notes */}
                    <textarea
                        className="border rounded-lg px-3 py-2 w-full mb-4"
                        placeholder="Notes / Description"
                        value={activeObligation.notes}
                        onChange={(e) =>
                            setActiveObligation({ ...activeObligation, notes: e.target.value })
                        }
                    />

                    {/* Due Date + Time + Frequency */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                        <input
                            type="date"
                            className="border rounded-lg px-3 py-2"
                            value={activeObligation.dueDate}
                            onChange={(e) =>
                                setActiveObligation({
                                    ...activeObligation,
                                    dueDate: e.target.value,
                                })
                            }
                        />

                        <input
                            type="time"
                            className="border rounded-lg px-3 py-2"
                            value={activeObligation.dueTime}
                            onChange={(e) =>
                                setActiveObligation({
                                    ...activeObligation,
                                    dueTime: e.target.value,
                                })
                            }
                        />

                        <select
                            className="border rounded-lg px-3 py-2"
                            value={activeObligation.frequency}
                            onChange={(e) =>
                                setActiveObligation({
                                    ...activeObligation,
                                    frequency: e.target.value,
                                })
                            }
                        >
                            <option value="One-time">One-time</option>
                            <option value="Semester">Semester</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>

                    {/* Created By */}
                    <input
                        className="border rounded-lg px-3 py-2 w-full mb-4"
                        placeholder="Created By (Name)"
                        value={activeObligation.createdBy}
                        onChange={(e) =>
                            setActiveObligation({
                                ...activeObligation,
                                createdBy: e.target.value,
                            })
                        }
                    />

                    {/* Summary */}
                    <p className="text-sm text-gray-600 mb-6">
                        <b>Created On:</b> {activeObligation.createdOn} <br />
                        <b>Last Modified:</b> {activeObligation.lastModified}
                    </p>

                    {/* Bottom Buttons */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={saveObligation}
                            className="bg-green-600 text-white px-5 py-2 rounded-lg"
                        >
                            Save
                        </button>

                        <button
                            onClick={() => deleteObligation(activeObligation.id)}
                            className="bg-red-600 text-white px-5 py-2 rounded-lg"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Obligations;
