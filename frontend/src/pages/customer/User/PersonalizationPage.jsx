import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function PersonalizationPage() {
    const [toggleLoading, setToggleLoading] = useState(false);
    const [resetMsg, setResetMsg] = useState("");

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

    return (
        <div className="min-h-screen bg-gray-50 px-5 sm:px-8 py-14">

            {/* Back Button */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-semibold tracking-tight">
                    Personalization Settings
                </h1>

                <Link
                    to="/customer/profile"
                    className="px-5 py-2.5 bg-black text-white rounded-2xl shadow-sm hover:bg-gray-900 transition"
                >
                    ← Back to Profile
                </Link>
            </div>

            {/* Card */}
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-200 p-10">

                <p className="text-gray-600 text-sm mb-6">
                    Manage your recommendation and personalization data.
                </p>

                <button
                    onClick={resetPersonalization}
                    disabled={toggleLoading}
                    className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2.5 rounded-xl transition shadow"
                >
                    {toggleLoading ? "Resetting..." : "Reset Personalization"}
                </button>

                {resetMsg && (
                    <p className="text-xs text-green-600 mt-3">{resetMsg}</p>
                )}

            </div>
        </div>
    );
}
