import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";

export default function ProfilePage() {
    const { user, setUser } = useAuth();
    const location = useLocation();

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

    return (
        <div className="min-h-screen bg-gray-50 pb-20 px-4 sm:px-6 pt-10 py-12">

            {/* Segmented Control Tabs (Apple Style) */}
            <div className="max-w-2xl mx-auto mb-8">
                <div className="bg-white border border-gray-200 rounded-2xl p-1 flex shadow-sm">
                    <Link
                        to="/customer/profile"
                        className={`flex-1 text-center py-2 rounded-xl font-medium text-sm transition 
                            ${location.pathname === "/customer/profile"
                                ? "bg-black text-white shadow"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        Profile
                    </Link>

                    <Link
                        to="/customer/analytics"
                        className={`flex-1 text-center py-2 rounded-xl font-medium text-sm transition 
                            ${location.pathname === "/customer/analytics"
                                ? "bg-black text-white shadow"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        Shopping Analysis
                    </Link>

                    <Link
                        to="/customer/orders"
                        className={`flex-1 text-center py-2 rounded-xl font-medium text-sm transition 
                            ${location.pathname === "/customer/orders"
                                ? "bg-black text-white shadow"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        My Orders
                    </Link>
                </div>
            </div>

            {/* Frosted Card */}
            <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl border border-gray-200 p-10">

                {/* Profile Header */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="relative">
                        <UserCircleIcon className="h-24 w-24 text-gray-300" />
                        <span className="absolute right-0 bottom-0 h-4 w-4 bg-green-400 rounded-full border-2 border-white"></span>
                    </div>

                    <h1 className="text-3xl font-semibold text-gray-900 mt-4">
                        {formData.username}
                    </h1>

                    <p className="text-gray-500 text-sm mt-1">
                        Manage  account 
                    </p>
                </div>

                {/* Success Message (iMessage bubble style) */}
                {success && (
                    <div className="flex items-center bg-green-50 border border-green-200 rounded-xl p-4 mb-4 shadow-sm">
                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                        <p className="ml-3 text-green-700 text-sm font-medium">{success}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="flex items-center bg-red-50 border border-red-200 rounded-xl p-4 mb-4 shadow-sm">
                        <ExclamationCircleIcon className="h-6 w-6 text-red-500" />
                        <p className="ml-3 text-red-700 text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Update Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* EMAIL */}
                    <div>
                        <label className="text-sm text-gray-600">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label className="text-sm text-gray-600">New Password</label>
                        <input
                            name="password"
                            type="password"
                            className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                            placeholder="Leave blank to keep current"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                    </div>

                    {formData.password && (
                        <div>
                            <label className="text-sm text-gray-600">
                                Confirm New Password
                            </label>
                            <input
                                name="confirmPassword"
                                type="password"
                                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}

                    {/* Last updated */}
                    <p className="text-gray-400 text-xs mt-4">
                        Last updated: {updatedAt}
                    </p>

                    {/* Save Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-xl text-white font-bold shadow transition 
                                ${loading
                                    ? "bg-blue-300"
                                    : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                                }`}
                        >
                            {loading ? "Updating..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Sticky Bottom Save Button (Mobile) */}
            <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 shadow-lg">
                <button
                    onClick={handleSubmit}
                    className="w-full py-3 bg-black text-white rounded-xl font-semibold active:scale-95 transition"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}
