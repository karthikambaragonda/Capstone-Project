import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    PieChart, Pie, BarChart, Bar, ComposedChart, Line,
    Tooltip, XAxis, YAxis, ResponsiveContainer, Cell, Legend,
    CartesianGrid    // ⬅️ ADD THIS
} from "recharts";


export default function DashboardPage() {
    const [analytics, setAnalytics] = useState(null);
    const [updatedAt, setUpdatedAt] = useState("");

    const COLORS = ["#111827", "#2563EB", "#34C759", "#F97316", "#EF4444"];

    useEffect(() => {
        axios.get("/api/analytics/summary", { withCredentials: true })
            .then(res => {
                setAnalytics(res.data);
                setUpdatedAt(new Date().toLocaleString());
            })
            .catch(err => console.error(err));
    }, []);

    if (!analytics)
        return (
            <div className="flex justify-center items-center h-screen bg-[#f5f5f7]">
                <div className="animate-spin h-10 w-10 border-2 border-gray-400 rounded-full border-t-black"></div>
            </div>
        );

    return (
        <div className="p-10 bg-[#f5f5f7] min-h-screen space-y-10">

            {/* HEADER */}
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
                        Analytics Dashboard
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Your personal shopping insights
                    </p>
                </div>

                <Link
                    to="/customer/profile"
                    className="px-5 py-2.5 bg-black text-white rounded-2xl shadow-sm hover:bg-gray-900 transition"
                >
                    ← Back to Profile
                </Link>
            </header>

            <p className="text-gray-500 text-sm">Last Updated: {updatedAt}</p>

            {/* SUMMARY CARDS */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard label="Total Spend" value={`₹${analytics.totalSpend}`} />
                <SummaryCard label="Total Discounts" value={`₹${analytics.savings.discounts}`} />
                <SummaryCard label="Redeemed Points" value={analytics.savings.redeemedPoints} />
            </section>

            {/* SPEND CHART + CATEGORY PIE */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Monthly Spending Chart */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Monthly Spending
                    </h2>

                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={analytics.monthlySpend}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(v) => `₹${v}`} />
                                <Legend />
                                <Bar dataKey="amount" fill="#1f2937" radius={[8, 8, 0, 0]} />
                                <Line type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={3} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Categories Pie */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Top Categories
                    </h2>

                    <div className="h-72 flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analytics.topCategories}
                                    dataKey="total_qty"
                                    nameKey="category"
                                    outerRadius={110}
                                    label
                                >
                                    {analytics.topCategories.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>

                                <Tooltip formatter={(v, n) => [`${v} items`, n]} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>

            {/* INSIGHT BLOCK */}
            <section className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Insights</h2>

                <ul className="space-y-2 text-gray-700 text-lg">
                    <li>• Most active month: <b>{analytics.monthlySpend.at(-1)?.month}</b></li>
                    <li>• Top category: <b>{analytics.topCategories[0]?.category}</b></li>
                    <li>• Total discounts saved: <b>₹{analytics.savings.discounts}</b></li>
                    <li>• Reward points used: <b>{analytics.savings.redeemedPoints}</b></li>
                </ul>
            </section>

            {/* TOP DAYS CHART */}
            {analytics.topDays && (
                <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Top Spending Days
                    </h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.topDays}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip formatter={(v) => `₹${v}`} />
                                <Legend />
                                <Bar dataKey="amount" fill="#2563EB" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            )}
        </div>
    );
}

/* ---------- Summary Card Component ---------- */
function SummaryCard({ label, value }) {
    return (
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
            <p className="text-gray-500 text-sm">{label}</p>
            <p className="text-3xl font-semibold text-gray-900 mt-2">{value}</p>
        </div>
    );
}
