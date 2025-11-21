import { useEffect, useState } from "react";
import axios from "axios";

export default function RewardsHistory() {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get("/api/rewards/history", { withCredentials: true });
                setHistory(res.data);
            } catch (err) {
                setError("Failed to load history. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const formatRewardType = (type) => {
        switch (type) {
            case "points_earned":
                return "💰 Points Earned";
            case "reward_redeemed":
                return "🎁 Reward Redeemed";
            case "spin_the_wheel":
                return "🎡 Spin the Wheel";
            default:
                return type;
        }
    };

    if (isLoading) {
        return (
            <div className="p-12 max-w-lg mx-auto text-center text-gray-500">
                Loading history…
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 max-w-lg mx-auto text-center text-red-500 bg-white border border-gray-200 rounded-3xl shadow-sm">
                {error}
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="p-12 max-w-lg mx-auto text-center text-gray-500 bg-white border border-gray-200 rounded-3xl shadow-sm">
                <p className="text-xl mb-1">No rewards history</p>
                <p className="text-sm">Start earning points to see your history here.</p>
            </div>
        );
    }

    return (
        <div className="bg-[#f5f5f7] min-h-screen p-6 sm:p-10 font-[system-ui]">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-semibold mb-8 text-gray-900 tracking-tight">
                    Rewards History
                </h1>

                <div className="space-y-4">
                    {history.map((row) => (
                        <div
                            key={row.id}
                            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex justify-between items-center hover:shadow-md transition"
                        >
                            {/* Left section */}
                            <div>
                                <p className="text-gray-900 font-medium text-base">
                                    {formatRewardType(row.type)}
                                </p>

                                <p className="text-gray-500 text-sm mt-1">
                                    {row.description || "No details available"}
                                </p>

                                <p className="text-gray-400 text-xs mt-2">
                                    {new Date(row.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Points */}
                            <div className="text-right">
                                <p className={`text-lg font-semibold ${row.points > 0 ? "text-green-600" : "text-gray-700"}`}>
                                    {row.points > 0 ? `+${row.points}` : row.points}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
