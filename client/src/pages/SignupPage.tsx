import React, { useState } from "react";
import { IoArrowBackOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

interface SignupProps {
    onCancel: () => void;
    state: any;
    dispatch: React.Dispatch<any>;
}

export default function Signup({ onCancel, state, dispatch }: SignupProps) {
    const signupData = state.signup;

    const [showPassword, setShowPassword] = useState(false);
    const [showRetype, setShowRetype] = useState(false);
    const [error, setError] = useState("");

    // Suggested year & sections
    const yearSectionSuggestions = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!signupData.password || !signupData.retypePassword) {
            setError("Please enter and retype your password.");
            return;
        }

        if (signupData.password !== signupData.retypePassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!signupData.firstName || !signupData.lastName || !signupData.email) {
            setError("Please fill in all required fields.");
            return;
        }

        if (!signupData.course || !signupData.yearSection) {
            setError("Please select course and year/section.");
            return;
        }

        const usersRaw = localStorage.getItem("users");
        const users = usersRaw ? JSON.parse(usersRaw) : [];

        const exists = users.find(
            (user: any) =>
                user.email === signupData.email || user.studentNumber === signupData.studentNumber
        );

        if (exists) {
            setError("Email or Student Number already exists.");
            return;
        }

        // Combine course + year/section only when saving
        const newUser = {
            firstName: signupData.firstName,
            lastName: signupData.lastName,
            email: signupData.email,
            studentNumber: signupData.studentNumber,
            courseSection: `${signupData.course} ${signupData.yearSection}`,
            gender: signupData.gender === "other" ? signupData.otherGender : signupData.gender,
            phone: signupData.phone,
            password: signupData.password,
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("currentUser", JSON.stringify(newUser));

        alert("Signup successful ✅");

        dispatch({ type: "RESET_SIGNUP" });
        onCancel();
    };

    return (
        <div className="signup-container w-full h-full flex justify-center items-center">
            <div
                className="relative w-[700px] bg-black/50 backdrop-blur-md rounded-xl p-6 text-white flex flex-col gap-4"
                style={{ maxHeight: "600px" }}
            >
                {/* Back Button */}
                <button
                    className="absolute top-4 right-4 text-white hover:text-orange-400"
                    onClick={onCancel}
                >
                    <IoArrowBackOutline size={24} />
                </button>

                <h2 className="text-[clamp(1.5rem,4vw,2rem)] font-bold text-center">Sign Up</h2>

                <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4 overflow-y-auto">
                    {/* First & Last Name */}
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="flex-1 flex flex-col">
                            <label className="mb-1 text-sm">First Name</label>
                            <input
                                required
                                type="text"
                                placeholder="Enter your first name"
                                value={signupData.firstName}
                                onChange={(e) =>
                                    dispatch({ type: "SIGNUP_CHANGE", field: "firstName", value: e.target.value })
                                }
                                className="w-full rounded-md p-3 text-black"
                            />
                        </div>
                        <div className="flex-1 flex flex-col">
                            <label className="mb-1 text-sm">Last Name</label>
                            <input
                                required
                                type="text"
                                placeholder="Enter your last name"
                                value={signupData.lastName}
                                onChange={(e) =>
                                    dispatch({ type: "SIGNUP_CHANGE", field: "lastName", value: e.target.value })
                                }
                                className="w-full rounded-md p-3 text-black"
                            />
                        </div>
                    </div>

                    {/* Email & Student Number */}
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="flex-1 flex flex-col">
                            <label className="mb-1 text-sm">Email</label>
                            <input
                                required
                                type="email"
                                placeholder="Enter email"
                                value={signupData.email}
                                onChange={(e) =>
                                    dispatch({ type: "SIGNUP_CHANGE", field: "email", value: e.target.value })
                                }
                                className="w-full rounded-md p-3 text-black"
                            />
                        </div>
                        <div className="flex-1 flex flex-col">
                            <label className="mb-1 text-sm">Student Number</label>
                            <input
                                required
                                type="text"
                                placeholder="Enter student number"
                                value={signupData.studentNumber}
                                onChange={(e) =>
                                    dispatch({ type: "SIGNUP_CHANGE", field: "studentNumber", value: e.target.value })
                                }
                                className="w-full rounded-md p-3 text-black"
                            />
                        </div>
                    </div>

                    {/* Course & Year/Section */}
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="flex-1 flex flex-col">
                            <label className="mb-1 text-sm">Course</label>
                            <select
                                required
                                value={signupData.course || ""}
                                onChange={(e) =>
                                    dispatch({ type: "SIGNUP_CHANGE", field: "course", value: e.target.value })
                                }
                                className="w-full rounded-md p-3 text-black"
                            >
                                <option value="">Select Course</option>
                                <option value="Computer Engineering">Computer Engineering</option>
                                <option value="Electrical Engineering">Electrical Engineering</option>
                                <option value="Electronics Engineering">Electronics Engineering</option>
                                <option value="Mechanical Engineering">Mechanical Engineering</option>
                                <option value="Civil Engineering">Civil Engineering</option>
                            </select>
                        </div>

                        <div className="flex-1 flex flex-col">
                            <label className="mb-1 text-sm">Year & Section</label>
                            <input
                                type="text"
                                placeholder="Ex: 4A, 3B"
                                list="year-section-suggestions"
                                value={signupData.yearSection || ""}
                                onChange={(e) =>
                                    dispatch({ type: "SIGNUP_CHANGE", field: "yearSection", value: e.target.value })
                                }
                                className="w-full rounded-md p-3 text-black"
                            />
                            <datalist id="year-section-suggestions">
                                {yearSectionSuggestions.map((ys) => (
                                    <option key={ys} value={ys} />
                                ))}
                            </datalist>
                        </div>
                    </div>

                    {/* Gender & Phone */}
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="flex-1 flex flex-col">
                            <label className="mb-1 text-sm">Gender</label>
                            <select
                                value={signupData.gender}
                                onChange={(e) =>
                                    dispatch({ type: "SIGNUP_CHANGE", field: "gender", value: e.target.value })
                                }
                                className="w-full rounded-md p-3 text-black"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>

                            {signupData.gender === "other" && (
                                <input
                                    type="text"
                                    placeholder="Please specify"
                                    value={signupData.otherGender}
                                    onChange={(e) =>
                                        dispatch({ type: "SIGNUP_CHANGE", field: "otherGender", value: e.target.value })
                                    }
                                    className="w-full mt-2 rounded-md p-3 text-black"
                                />
                            )}
                        </div>

                        <div className="flex-1 flex flex-col">
                            <label className="mb-1 text-sm">Phone Number</label>
                            <input
                                type="tel"
                                placeholder="Enter phone number"
                                value={signupData.phone}
                                onChange={(e) =>
                                    dispatch({ type: "SIGNUP_CHANGE", field: "phone", value: e.target.value })
                                }
                                className="w-full rounded-md p-3 text-black"
                            />
                        </div>
                    </div>

                    {/* Password & Retype */}
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="flex-1 flex flex-col relative">
                            <label className="mb-1 text-sm">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                autoComplete="new-password"
                                value={signupData.password}
                                onChange={(e) =>
                                    dispatch({ type: "SIGNUP_CHANGE", field: "password", value: e.target.value })
                                }
                                className="w-full rounded-md p-3 text-black"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-[38px] text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col relative">
                            <label className="mb-1 text-sm">Retype Password</label>
                            <input
                                type={showRetype ? "text" : "password"}
                                placeholder="Retype password"
                                autoComplete="new-password"
                                value={signupData.retypePassword}
                                onChange={(e) =>
                                    dispatch({ type: "SIGNUP_CHANGE", field: "retypePassword", value: e.target.value })
                                }
                                className="w-full rounded-md p-3 text-black"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-[38px] text-gray-600"
                                onClick={() => setShowRetype(!showRetype)}
                            >
                                {showRetype ? <IoEyeOffOutline /> : <IoEyeOutline />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-md bg-primary p-3 font-bold hover:bg-orange-500 transition"
                    >
                        Sign Up
                    </button>
                </form>

                {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}

                <p className="text-sm text-center mt-2 ">
                    Already have an account?{" "}
                    <span className="cursor-pointer  text-primary" onClick={onCancel}>
                        Sign in here
                    </span>
                </p>
            </div>
        </div>
    );
}
