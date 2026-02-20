import React, { useEffect, useState } from "react";

// REVIEWME
// TODO Fix the UI
// ✅ FIXED Toggle button overlap in phone mode

const AdminSettings = () => {
    // Local State
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [bio, setBio] = useState("");

    // Load Settings from LocalStorage
    useEffect(() => {
        const raw = localStorage.getItem("user");
        if (!raw) return;

        const userData = JSON.parse(raw);

        // ✅ If settings does not exist, create default
        if (!userData.admin.settings) {
            userData.admin.settings = {
                notifications: true,
                darkMode: false,
                personalInfo: {
                    fullName: "Default Admin",
                    email: "admin@gmail.com",
                    phone: "",
                    bio: "",
                },
            };

            localStorage.setItem("user", JSON.stringify(userData));
        }

        // Load values into React state
        setNotifications(userData.admin.settings.notifications);
        setDarkMode(userData.admin.settings.darkMode);

        setFullName(userData.admin.settings.personalInfo.fullName);
        setEmail(userData.admin.settings.personalInfo.email);
        setPhone(userData.admin.settings.personalInfo.phone);
        setBio(userData.admin.settings.personalInfo.bio);
    }, []);

    // Save Settings
    const handleSave = () => {
        const raw = localStorage.getItem("user");
        if (!raw) return;

        const userData = JSON.parse(raw);

        userData.admin.settings = {
            notifications,
            darkMode,
            personalInfo: {
                fullName,
                email,
                phone,
                bio,
            },
        };

        localStorage.setItem("user", JSON.stringify(userData));

        alert("✅ Settings saved successfully!");
    };

    // Reset to Default
    const handleReset = () => {
        setNotifications(true);
        setDarkMode(false);

        setFullName("Default Admin");
        setEmail("admin@gmail.com");
        setPhone("");
        setBio("");

        alert("🔄 Reset to default values (click Save to apply)");
    };

    return (
        <div className="w-full min-h-screen flex flex-col  items-start p-4 sm:p-6">
            {/* Title */}
            <h1 className="text-gray-800 text-3xl font-bold mb-8">
                Admin Settings
            </h1>

            {/* Settings Container */}
            <div className="w-full max-w-5xl bg-gray-200 rounded-2xl shadow-lg p-6 md:p-10">
                {/* ----------------------------
            Toggle Section
        ---------------------------- */}
                <div className="space-y-6">
                    {/* Notifications Toggle */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-gray-700 p-4 rounded-xl">
                        <div>
                            <h2 className="font-semibold text-lg text-white">
                                Notifications
                            </h2>
                            <p className="text-sm text-gray-300">
                                Enable or disable admin notifications
                            </p>
                        </div>

                        {/* ✅ FIXED TOGGLE */}
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`relative flex-shrink-0 w-[56px] h-[30px] rounded-full transition ${notifications ? "bg-primary" : "bg-gray-500"
                                }`}
                        >
                            <span
                                className={`absolute top-[4px] left-[4px] w-[22px] h-[22px] bg-white rounded-full shadow-md transition-transform duration-300 ${notifications ? "translate-x-[26px]" : "translate-x-0"
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Dark Mode Toggle */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-gray-700 p-4 rounded-xl">
                        <div>
                            <h2 className="font-semibold text-lg text-white">
                                Dark Mode
                            </h2>
                            <p className="text-sm text-gray-300">
                                Switch between light and dark theme
                            </p>
                        </div>

                        {/* ✅ FIXED TOGGLE */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`relative flex-shrink-0 w-[56px] h-[30px] rounded-full transition ${darkMode ? "bg-primary" : "bg-gray-500"
                                }`}
                        >
                            <span
                                className={`absolute top-[4px] left-[4px] w-[22px] h-[22px] bg-white rounded-full shadow-md transition-transform duration-300 ${darkMode ? "translate-x-[26px]" : "translate-x-0"
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* ----------------------------
            Personal Information
        ---------------------------- */}
                <div className="mt-10">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">
                        Edit Personal Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div className="flex flex-col">
                            <label className="text-sm mb-1 text-gray-800">
                                Full Name
                            </label>
                            <input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="p-3 rounded-lg text-black outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Enter full name"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col">
                            <label className="text-sm mb-1 text-gray-800">
                                Email
                            </label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="p-3 rounded-lg text-black outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Enter email"
                            />
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col">
                            <label className="text-sm mb-1 text-gray-800">
                                Phone Number
                            </label>
                            <input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="p-3 rounded-lg text-black outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Enter phone number"
                            />
                        </div>

                        {/* Bio */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="text-sm mb-1 text-gray-800">
                                Bio
                            </label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="p-3 rounded-lg text-black min-h-[100px] outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Write something about yourself..."
                            />
                        </div>
                    </div>
                </div>

                {/* ----------------------------
            Buttons
        ---------------------------- */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 mt-10">
                    {/* Reset */}
                    <button
                        onClick={handleReset}
                        className="px-6 py-3 rounded-xl bg-gray-600 text-white hover:bg-gray-500 transition w-full sm:w-auto"
                    >
                        Reset to Default
                    </button>

                    {/* Save */}
                    <button
                        onClick={handleSave}
                        className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-orange-500 transition w-full sm:w-auto"
                    >
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
