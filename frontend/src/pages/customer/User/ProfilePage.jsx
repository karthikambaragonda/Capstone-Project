import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    UserCircleIcon,
    Bars3Icon,
    XMarkIcon,
    UserIcon,
    ChartBarIcon,
    ShoppingBagIcon,
    Cog8ToothIcon
} from "@heroicons/react/24/outline";

export default function ProfilePage() {
    const { user, setUser } = useAuth();
    const location = useLocation();

    const [mobileSidebar, setMobileSidebar] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [updatedAt, setUpdatedAt] = useState("");

    const [resetMsg, setResetMsg] = useState("");
    const [toggleLoading, setToggleLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
                password: "",
                confirmPassword: "",
            });
            setUpdatedAt(new Date().toLocaleString());
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            await axios.put(
                "/api/profile",
                {
                    email: formData.email,
                    password: formData.password || undefined,
                },
                { withCredentials: true }
            );

            const updatedUser = { ...user, email: formData.email };
            setUser(updatedUser);
            setSuccess("Your profile has been updated.");
            setUpdatedAt(new Date().toLocaleString());

            setFormData((prev) => ({
                ...prev,
                password: "",
                confirmPassword: "",
            }));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const resetPersonalization = async () => {
        setToggleLoading(true);
        try {
            await axios.delete("/api/recommendations/reset", {
                withCredentials: true,
            });
            setResetMsg("Your personalization data has been cleared.");
            setTimeout(() => setResetMsg(""), 3000);
        } catch (err) {
            console.error("Reset error:", err);
        }
        setToggleLoading(false);
    };

    // Sidebar links
    const sidebarLinks = [
        { name: "Profile", path: "/customer/profile", icon: <UserIcon className="h-5" /> },
        { name: "Shopping Analysis", path: "/customer/analytics", icon: <ChartBarIcon className="h-5" /> },
        { name: "My Orders", path: "/customer/orders", icon: <ShoppingBagIcon className="h-5" /> },
        { name: "Settings", path: "/customer/personalization", icon: <Cog8ToothIcon className="h-5" /> },
    ];

    return (
        <div className="flex min-h-screen bg-white-100">

            {/* -------------------------------
                MOBILE TOP BAR
            -------------------------------- */}
            <div className="lg:hidden fixed top-0 left-0 w-full bg-white shadow-sm px-4 py-3 flex items-center justify-between z-40">
                <h1 className="text-lg font-semibold">Account</h1>
                <Bars3Icon
                    className="h-7 w-7 text-gray-700"
                    onClick={() => setMobileSidebar(true)}
                />
            </div>

            {/* -------------------------------
                SIDEBAR - DESKTOP
            -------------------------------- */}
            <div className="hidden lg:flex flex-col w-64 h-screen bg-transparent border-whiite border-gray-200 p-6 fixed top-0 left-0">

                <h2 className="text-xl font-semibold mb-8">My Account</h2>

                <nav className="space-y-1">
                    {sidebarLinks.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition 
                                ${location.pathname === item.path
                                    ? "bg-black text-white shadow"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* -------------------------------
                SIDEBAR - MOBILE DRAWER
            -------------------------------- */}
            {mobileSidebar && (
                <div className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                    onClick={() => setMobileSidebar(false)}>
                </div>
            )}

            <div className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-all duration-300 
                ${mobileSidebar ? "translate-x-0" : "-translate-x-full"}`}>

                <div className="flex items-center justify-between px-4 py-4 border-b">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <XMarkIcon
                        className="h-7 w-7 text-gray-700"
                        onClick={() => setMobileSidebar(false)}
                    />
                </div>

                <nav className="p-4 space-y-1">
                    {sidebarLinks.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileSidebar(false)}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition 
                                ${location.pathname === item.path
                                    ? "bg-black text-white shadow"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* -------------------------------
                MAIN CONTENT AREA
            -------------------------------- */}
            <div className="flex-1 lg:ml-64 px-5 sm:px-8 py-20 lg:py-12">

                <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-200 px-10 py-12">

                    {/* PROFILE HEADER */}
                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="relative">
                            <UserCircleIcon className="h-28 w-28 text-gray-300" />
                            <span className="absolute bottom-1 right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white"></span>
                        </div>

                        <h1 className="text-3xl font-semibold text-gray-900 mt-4">
                            {formData.username}
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">Manage your account</p>
                    </div>

                    {/* MESSAGES */}
                    {success && (
                        <div className="flex items-center bg-green-50 border border-green-200 rounded-xl p-4 mb-5 shadow-sm">
                            <CheckCircleIcon className="h-6 w-6 text-green-500" />
                            <p className="ml-3 text-green-700 text-sm font-medium">{success}</p>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center bg-red-50 border border-red-200 rounded-xl p-4 mb-5 shadow-sm">
                            <ExclamationCircleIcon className="h-6 w-6 text-red-500" />
                            <p className="ml-3 text-red-700 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-7">

                        <div>
                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-black focus:border-black transition"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Leave blank to keep current"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-black focus:border-black transition"
                            />
                        </div>

                        {formData.password && (
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-black focus:border-black transition"
                                />
                            </div>
                        )}

                        <p className="text-gray-400 text-xs">Last updated: {updatedAt}</p>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 rounded-xl text-white font-semibold transition shadow 
                                ${loading ? "bg-gray-400" : "bg-black hover:bg-gray-900 active:scale-95"}
                            `}
                        >
                            {loading ? "Updating..." : "Save Changes"}
                        </button>
                    </form>

                
                </div>
            </div>
        </div>
    );
}
