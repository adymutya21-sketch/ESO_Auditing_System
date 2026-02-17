import { useState, useReducer, useEffect } from "react";
import "../../styles/index.css";
import Signup from "./SignupPage";
import { useNavigate } from "react-router-dom";

// TODO: Login and Signup logic
// Assets
import logo from "../assets/ESO_Logo.png";
import MarSU_BG from "../assets/MarSU_BG.png";

// ----------------------------
// Types
// ----------------------------
interface SigninState {
    email: string;
    password: string;
}

interface SignupState {
    firstName: string;
    lastName: string;
    course: string;
    yearSection: string;
    studentNumber: string;
    phone: string;
    gender: string;
    otherGender: string;
    email: string;
    password: string;
    retypePassword: string;
}

export interface FormState {
    signin: SigninState;
    signup: SignupState;
}

export type FormAction =
    | { type: "SIGNIN_CHANGE"; field: keyof SigninState; value: string }
    | { type: "SIGNUP_CHANGE"; field: keyof SignupState; value: string }
    | { type: "RESET_SIGNIN" }
    | { type: "RESET_SIGNUP" };

// ----------------------------
// Initial State
// ----------------------------
const initialState: FormState = {
    signin: { email: "", password: "" },
    signup: {
        firstName: "",
        lastName: "",
        course: "",
        yearSection: "",
        studentNumber: "",
        phone: "",
        gender: "",
        otherGender: "",
        email: "",
        password: "",
        retypePassword: "",
    },
};

// ----------------------------
// Reducer
// ----------------------------
function formReducer(state: FormState, action: FormAction): FormState {
    switch (action.type) {
        case "SIGNIN_CHANGE":
            return {
                ...state,
                signin: { ...state.signin, [action.field]: action.value },
            };

        case "SIGNUP_CHANGE":
            return {
                ...state,
                signup: { ...state.signup, [action.field]: action.value },
            };

        case "RESET_SIGNIN":
            return { ...state, signin: initialState.signin };

        case "RESET_SIGNUP":
            return { ...state, signup: initialState.signup };

        default:
            return state;
    }
}

// ----------------------------
// LandingPage Component
// ----------------------------
const LandingPage = () => {
    const [showSignup, setShowSignup] = useState(false);
    const [state, dispatch] = useReducer(formReducer, initialState);
    const [signinError, setSigninError] = useState("");

    const navigate = useNavigate();

    // ----------------------------
    // Show Signup Toggle
    // ----------------------------
    const handleShowSignup = () => {
        setSigninError("");
        setShowSignup(true);
    };

    const handleCloseSignup = () => {
        setShowSignup(false);
    };

    // ----------------------------
    // LOGIN Logic + Redirect
    // ----------------------------
    const handleSigninSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSigninError("");

        const { email, password } = state.signin;

        if (!email || !password) {
            setSigninError("Please enter both email and password.");
            return;
        }

        // Load users from localStorage
        const usersRaw = localStorage.getItem("users");
        const users: any[] = usersRaw ? JSON.parse(usersRaw) : [];

        // Find user
        const foundUser = users.find(
            (user) =>
                user.email === email.trim() && user.password === password.trim()
        );

        if (!foundUser) {
            setSigninError(
                "Invalid email or password. Please try again or sign up first."
            );
            return;
        }

        // Save current user
        localStorage.setItem("currentUser", JSON.stringify(foundUser));



        dispatch({ type: "RESET_SIGNIN" });

        // ----------------------------
        // Redirect Logic
        // ----------------------------
        if (foundUser.email === "admin@gmail.com") {
            navigate("/admin");
        } else {
            navigate("/student");
        }
    };

    // ----------------------------
    // Auto Setup Admin Account
    // ----------------------------
    useEffect(() => {
        const usersRaw = localStorage.getItem("users");
        let users: any[] = usersRaw ? JSON.parse(usersRaw) : [];

        // Check if admin exists already
        const adminExists = users.find(
            (user) =>
                user.email === "admin@gmail.com" && user.password === "admin"
        );

        // If not, add admin
        if (!adminExists) {
            users.push({
                email: "admin@gmail.com",
                password: "admin",
                role: "admin",
            });

            localStorage.setItem("users", JSON.stringify(users));
        }

        // Remove previous session
        localStorage.removeItem("currentUser");
    }, []);

    return (
        <div className="landing-page relative h-screen w-screen bg-black overflow-auto">
            {/* Background */}
            <div
                className="landing-bg absolute md:fixed inset-0 bg-cover bg-center z-0 min-h-screen md:h-[clamp(700px,100vh,820px)]"
                style={{ backgroundImage: `url(${MarSU_BG})` }}
            />

            {/* Overlay */}
            <div className="landing-overlay absolute md:fixed inset-0 bg-black bg-opacity-60 z-0" />

            {/* Header */}
            <header className="landing-header relative z-10 flex h-[80px] w-full items-center justify-between bg-primary px-6 text-white">
                <div className="landing-header-center font-bold text-[clamp(14px,1.5vw,50px)]">
                    Marinduque State University
                </div>
                <button className="hover:underline text-[clamp(14px,1.5vw,50px)]">
                    More Info
                </button>
            </header>

            {/* Main */}
            <main className="landing-main relative z-10 flex h-[700px] overflow-y-auto flex-col items-center mt-2 md:flex-row px-4 md:px-0">
                {/* Logo */}
                <div className="logo-container flex w-[60%] items-center justify-center">
                    <img
                        src={logo}
                        alt="Logo"
                        className="object-contain md:translate-x-6"
                        style={{
                            width: "clamp(130px,28vw,320px)",
                            height: "clamp(130px,28vw,320px)",
                        }}
                    />
                </div>

                {/* Form Container */}
                <div className="landing-form-container w-[90%] md:w-[80%] flex flex-col text-white">
                    {showSignup ? (
                        <Signup
                            onCancel={handleCloseSignup}
                            state={state}
                            dispatch={dispatch}
                        />
                    ) : (
                        <>
                            <h1 className="mb-6 font-bold text-[clamp(30px,4vw,70px)] leading-[1.2]">
                                Engineering Student Organization (ESO)
                                <br />
                                Auditing System
                            </h1>

                            {/* Sign In Form */}
                            <form
                                onSubmit={handleSigninSubmit}
                                className="flex flex-col gap-4"
                            >
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={state.signin.email}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "SIGNIN_CHANGE",
                                            field: "email",
                                            value: e.target.value,
                                        })
                                    }
                                    className="w-[clamp(280px,30vw,400px)] rounded-md p-3 text-black"
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={state.signin.password}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "SIGNIN_CHANGE",
                                            field: "password",
                                            value: e.target.value,
                                        })
                                    }
                                    className="w-[clamp(280px,30vw,400px)] rounded-md p-3 text-black"
                                />

                                <button
                                    type="submit"
                                    className="w-[clamp(200px,30vw,230px)] rounded-md bg-primary p-3 font-bold hover:bg-orange-500 transition"
                                >
                                    Login
                                </button>

                                {/* Error */}
                                {signinError && (
                                    <p className="text-red-400 text-sm mt-2">{signinError}</p>
                                )}
                            </form>

                            {/* Signup Toggle */}
                            <p className="mt-2 text-sm">
                                Does not have an account?{" "}
                                <span
                                    className="cursor-pointer text-primary"
                                    onClick={handleShowSignup}
                                >
                                    Sign up here
                                </span>
                            </p>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
