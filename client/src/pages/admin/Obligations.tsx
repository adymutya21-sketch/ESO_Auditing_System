import React, { useEffect, useState } from "react";
import {
    FaPlus,
    FaList,
    FaEdit,
    FaTrash,
    FaMinus,
    FaSort,
    FaClipboardList,
} from "react-icons/fa";

type Obligation = {
    id: number;
    title: string;
    notes: string;

    dueDate: string;
    dueTime: string;
    frequency: string;

    createdBy: string;
    status: "Active" | "Inactive";

    price: number; //NEW FIELD

    createdOn: string;
    lastModified: string;
};

const Obligations = () => {
    // Default Obligations
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
            price: 0,
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
            price: 150.5,
            createdOn: "2026-01-05",
            lastModified: "2026-01-12",
        },
    ];

    // State
    const [obligations, setObligations] = useState<Obligation[]>([]);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<number[]>([]);
    const [mode, setMode] = useState<"list" | "edit">("list");
    const [sortOption, setSortOption] = useState("Newest");

    const [activeObligation, setActiveObligation] =
        useState<Obligation | null>(null);

    //SAVE TO LOCALSTORAGE FOREVER
    function saveObligations(updated: Obligation[]) {
        const raw = localStorage.getItem("user");
        if (!raw) return;

        const userData = JSON.parse(raw);

        if (!userData.admin) userData.admin = {};

        //Store permanently inside user.admin.obligations
        userData.admin.obligations = updated;

        localStorage.setItem("user", JSON.stringify(userData));

        // Update UI state
        setObligations(updated);
    }

    //LOAD ON FIRST RENDER
    useEffect(() => {
        const raw = localStorage.getItem("user");

        if (!raw) return;

        const userData = JSON.parse(raw);

        if (!userData.admin) userData.admin = {};

        // If obligations missing → inject defaults
        if (!userData.admin.obligations) {
            userData.admin.obligations = defaultObligations;
            localStorage.setItem("user", JSON.stringify(userData));
        }

        setObligations(userData.admin.obligations);
    }, []);

    // Select Logic
    function toggleSelect(id: number) {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    }

    // Toggle Select All
    function toggleSelectAll() {
        if (selected.length === obligations.length) {
            setSelected([]);
        } else {
            setSelected(obligations.map((o) => o.id));
        }
    }

    function deleteSelected() {
        if (!window.confirm("Delete all selected obligations?")) return;

        const updated = obligations.filter((o) => !selected.includes(o.id));
        saveObligations(updated);
        setSelected([]);
    }

    // Add / Edit
    function openAdd() {
        setActiveObligation({
            id: Date.now(),
            title: "",
            notes: "",
            dueDate: "",
            dueTime: "",
            frequency: "One-time",
            createdBy: "Admin",
            status: "Active",
            price: 0,
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

        let updated: Obligation[];

        const exists = obligations.find((o) => o.id === activeObligation.id);

        if (exists) {
            updated = obligations.map((o) =>
                o.id === activeObligation.id
                    ? {
                        ...activeObligation,
                        lastModified: new Date().toLocaleDateString(),
                    }
                    : o
            );
        } else {
            updated = [...obligations, activeObligation];
        }

        saveObligations(updated);

        setMode("list");
        setActiveObligation(null);
    }

    function deleteObligation(id: number) {
        if (!window.confirm("Delete this obligation?")) return;

        const updated = obligations.filter((o) => o.id !== id);
        saveObligations(updated);

        setMode("list");
        setActiveObligation(null);
    }

    // Filtering + Sorting
    let filtered = obligations.filter((o) =>
        o.title.toLowerCase().includes(search.toLowerCase())
    );

    if (sortOption === "A-Z") {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortOption === "Newest") {
        filtered.sort((a, b) => b.id - a.id);
    }

    // UI
    return (
        <div className="p-4 sm:p-6 md:p-10">
            <h1 className="font-bold text-gray-800 text-2xl sm:text-4xl mb-4">
                Obligations
            </h1>

            {/* ================= TOP BAR ================= */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6 ">
                <input
                    className="border rounded-lg px-3 py-2 w-full h-12 sm:w-1/2 text-sm"
                    placeholder="Search obligations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {mode === "list" ? (
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={openAdd}
                            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                            <FaPlus /> Add
                        </button>

                        <button
                            onClick={toggleSelectAll}
                            className="bg-gray-200 px-4 py-2 rounded-lg text-sm"
                        >
                            Select All
                        </button>

                        {selected.length > 0 && (
                            <button
                                onClick={deleteSelected}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                            >
                                <FaTrash />
                            </button>
                        )}

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
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            setMode("list");
                            setActiveObligation(null);
                        }}
                        className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <FaList /> Back
                    </button>
                )}
            </div>

            {/* ================= EMPTY STATE ================= */}
            {mode === "list" && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-20 text-gray-400 opacity-60">
                    <FaClipboardList className="text-5xl mb-3" />
                    <p className="text-lg font-semibold">
                        No obligations yet — add one to get started.
                    </p>
                </div>
            )}

            {/* ================= LIST MODE ================= */}
            {mode === "list" &&
                filtered.map((o) => (
                    <div
                        key={o.id}
                        className="bg-gray-100 rounded-lg p-6 shadow relative mb-4"
                    >
                        <input
                            type="checkbox"
                            checked={selected.includes(o.id)}
                            onChange={() => toggleSelect(o.id)}
                            className="absolute top-4 left-4 w-5 h-5"
                        />

                        <button
                            onClick={() => openEdit(o)}
                            className="absolute top-4 right-4 text-primary text-lg"
                        >
                            <FaEdit />
                        </button>

                        <h2 className="font-bold text-lg pl-8">{o.title}</h2>
                        <p className="text-sm text-gray-600 pl-8">{o.notes}</p>

                        <p className="text-sm text-gray-700 pl-8 mt-2">
                            Price: <b>₱{o.price.toFixed(2)}</b>
                        </p>

                        <button
                            onClick={() => deleteObligation(o.id)}
                            className="absolute bottom-4 right-4 text-primary text-lg"
                        >
                            <FaTrash />
                        </button>
                    </div>
                ))}

            {/* ================= EDIT MODE ================= */}
            {mode === "edit" && activeObligation && (
                <div className="bg-gray-100 rounded-lg p-6 shadow relative">
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
                            setActiveObligation({
                                ...activeObligation,
                                title: e.target.value,
                            })
                        }
                    />

                    {/* Notes */}
                    <textarea
                        className="border rounded-lg px-3 py-2 w-full mb-4"
                        placeholder="Notes / Description"
                        value={activeObligation.notes}
                        onChange={(e) =>
                            setActiveObligation({
                                ...activeObligation,
                                notes: e.target.value,
                            })
                        }
                    />

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4 w-40">
                        <span className="text-lg font-bold text-gray-700">₱</span>
                        <input
                            type="number"
                            step="0.01"
                            className="border rounded-lg px-3 py-2 w-full"
                            placeholder="Enter price"
                            value={activeObligation.price}
                            onChange={(e) =>
                                setActiveObligation({
                                    ...activeObligation,
                                    price: parseFloat(e.target.value),
                                })
                            }
                        />
                    </div>

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
                        placeholder="Created By"
                        value={activeObligation.createdBy}
                        onChange={(e) =>
                            setActiveObligation({
                                ...activeObligation,
                                createdBy: e.target.value,
                            })
                        }
                    />

                    {/* Status */}
                    <select
                        className="border rounded-lg px-3 py-2 w-full mb-6"
                        value={activeObligation.status}
                        onChange={(e) =>
                            setActiveObligation({
                                ...activeObligation,
                                status: e.target.value as "Active" | "Inactive",
                            })
                        }
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>

                    {/* Buttons */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={saveObligation}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg"
                        >
                            Save
                        </button>

                        <button
                            onClick={() => deleteObligation(activeObligation.id)}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg"
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
