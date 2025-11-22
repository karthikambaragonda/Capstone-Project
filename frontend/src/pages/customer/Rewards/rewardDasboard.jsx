import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaSpinner, FaGift, FaHistory } from "react-icons/fa";

const tiers = [
    { name: "Bronze", minPoints: 0, icon: "🥉" },
    { name: "Silver", minPoints: 1000, icon: "🥈" },
    { name: "Gold", minPoints: 5000, icon: "🥇" },
    { name: "Platinum", minPoints: 15000, icon: "💎" },
];

const getTierInfo = (points) => {
    let currentTier = tiers[0];

    for (let t of tiers) {
        if (points >= t.minPoints) currentTier = t;
        else break;
    }

    const nextTier = tiers.find((t) => t.minPoints > currentTier.minPoints);
    const pointsToNext = nextTier ? nextTier.minPoints - points : 0;

    const progress = nextTier
        ? ((points - currentTier.minPoints) /
            (nextTier.minPoints - currentTier.minPoints)) * 100
        : 100;

    return { currentTier, nextTier, pointsToNext, progress: Math.min(progress, 100) };
};

export default function RewardsDashboard() {
    const [points, setPoints] = useState(null);
    const [animated, setAnimated] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("/api/rewards", { withCredentials: true })
            .then((res) => setPoints(res.data.points))
            .catch(() => setError("Unable to load rewards."));
    }, []);

    useEffect(() => {
        if (points !== null) {
            let current = 0;
            const increment = points / 60;

            const timer = setInterval(() => {
                current += increment;
                if (current >= points) {
                    setAnimated(points);
                    clearInterval(timer);
                } else {
                    setAnimated(Math.ceil(current));
                }
            }, 16);

            return () => clearInterval(timer);
        }
    }, [points]);

    if (error) {
        return (
            <div className="text-center bg-white border border-gray-200 rounded-3xl max-w-md mx-auto p-8 mt-16 text-red-600">
                {error}
            </div>
        );
    }

    if (points === null) {
        return (
            <div className="text-center bg-white border border-gray-200 rounded-3xl max-w-md mx-auto p-8 mt-16">
                <FaSpinner className="animate-spin mx-auto text-3xl text-gray-600 mb-3" />
                <p className="text-gray-600">Loading rewards…</p>
            </div>
        );
    }

    const tier = getTierInfo(points);

    return (
        <div className="bg-[#f5f5f7] min-h-screen p-6 sm:p-10 font-[system-ui] bg-white">

            {/* ===================== GRID LAYOUT ===================== */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-1 ">

                {/* LEFT SIDE – MAIN CONTENT */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm max-w-2xl mx-auto p-10">

                        <h1 className="text-4xl font-semibold text-center mb-10 tracking-tight">
                            Rewards
                        </h1>

                        {/* Tier Card */}
                        <div className="border border-gray-300 rounded-3xl p-6 text-center shadow-sm mb-10">
                            <p className="text-gray-600 text-sm tracking-wide">Current Tier</p>
                            <p className="text-4xl font-bold mt-2">
                                {tier.currentTier.name} {tier.currentTier.icon}
                            </p>

                            {tier.nextTier ? (
                                <p className="text-gray-500 mt-1 text-sm">
                                    {tier.pointsToNext} points to reach{" "}
                                    <span className="font-semibold">{tier.nextTier.name}</span>
                                </p>
                            ) : (
                                <p className="text-gray-500 mt-1 text-sm">
                                    You've reached the highest tier.
                                </p>
                            )}
                        </div>

                        {/* Points Counter */}
                        <div className="text-center mb-12">
                            <p className="text-6xl font-semibold text-gray-900 tracking-tight">
                                {animated}
                            </p>
                            <p className="text-gray-500 mt-1">Total Points</p>
                        </div>

                        {/* Progress Bar */}
                        {tier.nextTier && (
                            <div className="mb-12">
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-gray-900 h-full rounded-full transition-all duration-700"
                                        style={{ width: `${tier.progress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>{tier.currentTier.minPoints} pts</span>
                                    <span>{tier.nextTier.minPoints} pts</span>
                                </div>
                            </div>
                        )}

                        {/* Benefits */}
                        <div className="border border-gray-200 rounded-2xl p-6 mb-10">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                Tier Benefits
                            </h3>

                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li>• {tier.currentTier.name} tier exclusive privileges</li>
                                <li>• Free shipping on all orders</li>
                                {tier.nextTier && (
                                    <li>
                                        • Unlock higher discounts in{" "}
                                        <span className="font-semibold">
                                            {tier.nextTier.name}
                                        </span>{" "}
                                        tier
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4">
                            <Link to="/customer/rewards/spin">
                                <button className="w-full bg-black text-white py-3 rounded-2xl text-sm mb-5 font-medium hover:bg-gray-900 transition">
                                    <FaGift className="inline mr-2" />
                                    Daily Spin
                                </button>
                            </Link>

                            <Link to="/customer/rewards/history">
                                <button className="w-full bg-gray-900 text-white py-3 rounded-2xl text-sm font-medium hover:bg-black transition">
                                    <FaHistory className="inline mr-2" />
                                    View History
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE – INFO CARD */}
                <div className="lg:col-span-0">
                    <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 shadow-sm sticky top-24">

                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            Rewards & Loyalty 🎁
                        </h2>

                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                            Earn points every time you shop and unlock exclusive
                            <span className="font-medium text-black"> loyalty tiers</span>.
                            Higher tiers give you more benefits, faster rewards, and special perks.
                        </p>

                        <p className="text-gray-500 text-xs leading-relaxed mb-3">
                            Track your tier progress using the visual Apple-style progress bar.
                            See exactly how many points you need for the next tier.
                        </p>

                        <p className="text-gray-500 text-xs leading-relaxed mb-3">
                            Use Daily Spin to earn bonus points every day, and check your complete
                            rewards history anytime.
                        </p>

                        <p className="text-gray-800 text-xs font-medium">
                            ✨ You can also redeem your reward points at checkout to save on your purchase.
                        </p>

                    </div>
                </div>


            </div>
        </div>
    );
}
