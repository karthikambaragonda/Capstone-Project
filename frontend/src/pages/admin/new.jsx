import { useEffect, useState } from "react";
import {
    UsersIcon,
    ShoppingBagIcon,
    CubeIcon,
    ChartBarIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

import {
    LineChart,
    Line,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    YAxis,
    BarChart,
    Bar,
} from "recharts";

import api from "../../utils/axios";

export default function AdminDashboardHome() {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [salesByCategory, setSalesByCategory] = useState([]);
    const [customerGrowth, setCustomerGrowth] = useState([]);
    const [lowStock, setLowStock] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [
                    s,
                    orders,
                    top,
                    catSales,
                    growth,
                    lowStockList
                ] = await Promise.all([
                    api.get("/api/admin/stats"),
                    api.get("/api/admin/recent-orders"),
                    api.get("/api/admin/top-products"),
                    api.get("/api/admin/sales-by-category"),
                    api.get("/api/admin/customer-growth"),
                    api.get("/api/admin/low-stock")
                ]);

                setStats(s.data);
                setRecentOrders(orders.data);
                setTopProducts(top.data);
                setSalesByCategory(catSales.data);
                setCustomerGrowth(growth.data);
                setLowStock(lowStockList.data);

            } catch (err) {
                console.error("Dashboard loading failed", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading || !stats) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#f5f5f7]">
                <div className="animate-spin h-10 w-10 text-gray-700 border-2 border-gray-400 rounded-full border-t-black"></div>
            </div>
        );
    }

    return (
        <div className="p-10 bg-[#f5f5f7] min-h-screen space-y-10">

            {/* HEADER */}
            <header>
                <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
                    Admin Dashboard
                </h1>
                <p className="text-gray-500 text-sm mt-1">Apple Pro Admin Layout</p>
            </header>

            {/* KPI CARDS */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <KPI icon={<UsersIcon className="h-6 w-6" />} label="Total Users" value={stats.total_users} />
                <KPI icon={<CubeIcon className="h-6 w-6" />} label="Total Products" value={stats.total_products} />
                <KPI icon={<ShoppingBagIcon className="h-6 w-6" />} label="Total Orders" value={stats.total_orders} />
                <KPI icon={<ChartBarIcon className="h-6 w-6" />} label="Total Revenue" value={`₹${stats.total_revenue}`} />
            </section>

            {/* SALES BY CATEGORY + CUSTOMER GROWTH */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 📈 Sales by Category */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm col-span-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Sales by Category
                    </h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesByCategory}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="total_sales" fill="#1f2937" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 🛍️ Customer Growth */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm col-span-2">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Customer Growth
                    </h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={customerGrowth}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: "#2563eb" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </section>

            {/* 📦 LOW STOCK ALERTS */}
            <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Low Stock Alerts</h2>
                <p className="text-gray-500 text-sm mb-4">Products below safe inventory level</p>

                {lowStock.length === 0 ? (
                    <p className="text-gray-600">All products are in healthy stock.</p>
                ) : (
                    <div className="space-y-3">
                        {lowStock.map((p, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border">
                                <div className="flex items-center gap-3">
                                    <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                                    <div>
                                        <p className="font-medium text-gray-900">{p.name}</p>
                                        <p className="text-gray-500 text-sm">Current Stock: {p.stock_quantity}</p>
                                    </div>
                                </div>
                                <span className="text-red-600 font-bold">Low</span>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* TOP + CHART + RECENT ORDERS */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Revenue Chart */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm col-span-2">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Revenue (Last 12 Months)
                    </h2>

                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.revenueGraph}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: "#2563eb" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Top Selling Products
                    </h2>

                    <div className="space-y-4">
                        {topProducts.map((p, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition"
                            >
                                <div>
                                    <p className="font-medium text-gray-900">{p.name}</p>
                                    <p className="text-gray-500 text-sm">Sold {p.total_sold} pcs</p>
                                </div>
                                <span className="text-gray-800 font-semibold">₹{p.total_revenue}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* RECENT ORDERS */}
            <section className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-5">
                    Recent Orders
                </h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {recentOrders.map((o) => (
                                <tr key={o.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-gray-500 font-mono">{o.id}</td>
                                    <td className="px-6 py-4 text-gray-900">{o.username}</td>
                                    <td className="px-6 py-4 text-gray-700">₹{o.amount}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${o.status === "delivered"
                                                    ? "bg-green-100 text-green-700"
                                                    : o.status === "processing"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {o.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {new Date(o.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

/* KPI COMPONENT */
function KPI({ icon, label, value }) {
    return (
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-2xl text-gray-700">{icon}</div>
                <div>
                    <p className="text-gray-500 text-sm">{label}</p>
                    <p className="text-2xl font-semibold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
}
