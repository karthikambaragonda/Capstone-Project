// AdminDashboardWithAnalytics.jsx
import { useEffect, useState, useMemo } from "react";
import {
    UsersIcon,
    ShoppingBagIcon,
    CubeIcon,
    ChartBarIcon,
    ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import api from "../../utils/axios";

/* ------------------ Styles & small helpers ------------------ */
const cardBase = "bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition";
const small = (txt) => <p className="text-sm text-gray-500">{txt}</p>;
const palette = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

function KPI({ icon, label, value }) {
    return (
        <div className={`${cardBase} flex items-center gap-4`}>
            <div className="p-3 bg-gray-100 rounded-2xl text-gray-700">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
            </div>
        </div>
    );
}

/* ------------------ Main component ------------------ */
export default function AdminDashboardWithAnalytics() {
    const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'analytics'
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [salesByCategory, setSalesByCategory] = useState([]);
    const [customerGrowth, setCustomerGrowth] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [forecast, setForecast] = useState(null);
    const [productPerf, setProductPerf] = useState(null);
    const [anomalies, setAnomalies] = useState(null);
    const [weeklyActive, setWeeklyActive] = useState(null);
    const [orderStatusCount, setOrderStatusCount] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                // fetch core dashboard endpoints
                const [
                    statsRes,
                    ordersRes,
                    topRes,
                    catRes,
                    growthRes,
                    lowStockRes,
                    forecastRes,
                    perfRes,
                    anomaliesRes,
                    weeklyActiveRes,
                    orderStatusRes,
                ] = await Promise.allSettled([
                    api.get("/api/admin/stats"),
                    api.get("/api/admin/recent-orders"),
                    api.get("/api/admin/top-products"),
                    api.get("/api/admin/sales-by-category"),
                    api.get("/api/admin/customer-growth"),
                    api.get("/api/admin/low-stock"),
                    api.get("/api/admin/ai/sales-forecast"),
                    api.get("/api/admin/ai/product-performance"),
                    api.get("/api/admin/ai/anomalies"),
                    api.get("/api/admin/weekly-active-users").catch(() => null), // optional
                    api.get("/api/admin/order-status-count").catch(() => null), // optional
                ]);

                // helper to handle settled results
                const settle = (res) => {
                    if (!res) return null;
                    if (res.status === "fulfilled") return res.value.data;
                    setErrors(prev => ({ ...prev, [res.reason?.config?.url || "unknown"]: res.reason?.message || "Failed" }));
                    return null;
                };

                setStats(settle(statsRes));
                setRecentOrders(settle(ordersRes) || []);
                setTopProducts(settle(topRes) || []);
                setSalesByCategory(settle(catRes) || []);
                setCustomerGrowth(settle(growthRes) || []);
                setLowStock(settle(lowStockRes) || []);
                setForecast(settle(forecastRes));
                setProductPerf(settle(perfRes));
                setAnomalies(settle(anomaliesRes));
                setWeeklyActive(settle(weeklyActiveRes));
                setOrderStatusCount(settle(orderStatusRes));
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading || !stats) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f5f5f7]">
                <div className="animate-spin h-10 w-10 border-2 border-gray-300 rounded-full border-t-black"></div>
            </div>
        );
    }

    return (
        <div className="p-10 bg-[#f5f5f7] min-h-screen space-y-10">
            <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-semibold tracking-tight text-gray-900">Admin • Pro Dashboard</h1>
                    <p className="text-gray-500 mt-1">Overview · Analytics · AI Insights</p>
                </div>

                {/* Tab switcher */}
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-white border border-gray-200 shadow-sm p-1 flex">
                        <TabBtn active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>Overview</TabBtn>
                        <TabBtn active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")}>Analytics</TabBtn>
                        <TabBtn active={activeTab === "ai"} onClick={() => setActiveTab("ai")}>AI Insights</TabBtn>
                    </div>
                </div>
            </header>

            {/* CONTENT */}
            {activeTab === "overview" && (
                <Overview
                    stats={stats}
                    recentOrders={recentOrders}
                    topProducts={topProducts}
                    lowStock={lowStock}
                    salesByCategory={salesByCategory}
                    customerGrowth={customerGrowth}
                />
            )}

            {activeTab === "analytics" && (
                <Analytics
                    salesByCategory={salesByCategory}
                    customerGrowth={customerGrowth}
                    weeklyActive={weeklyActive}
                    orderStatusCount={orderStatusCount}
                    forecast={forecast}
                    topProducts={topProducts}
                />
            )}

            {activeTab === "ai" && (
                <AIInsights
                    forecast={forecast}
                    productPerf={productPerf}
                    anomalies={anomalies}
                // churn / others can be added similarly
                />
            )}
        </div>
    );
}

/* ------------------ Tab Button ------------------ */
function TabBtn({ children, onClick, active }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${active ? "bg-black text-white shadow" : "text-gray-600"}`}
        >
            {children}
        </button>
    );
}

/* ------------------ Overview panel ------------------ */
function Overview({ stats, recentOrders, topProducts, lowStock, salesByCategory, customerGrowth }) {
    return (
        <div className="space-y-8">
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <KPI icon={<UsersIcon className="h-6 w-6" />} label="Total Users" value={stats.total_users || "—"} />
                <KPI icon={<CubeIcon className="h-6 w-6" />} label="Total Products" value={stats.total_products || "—"} />
                <KPI icon={<ShoppingBagIcon className="h-6 w-6" />} label="Total Orders" value={stats.total_orders || "—"} />
                <KPI icon={<ChartBarIcon className="h-6 w-6" />} label="Monthly Revenue" value={`₹${stats.total_revenue || 0}`} />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className={`${cardBase} col-span-2`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue (Last 12 months)</h3>
                    {stats.revenueGraph?.length ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats.revenueGraph}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : small("Revenue graph not available")}
                </div>

                <div className={cardBase}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
                    <div className="space-y-3">
                        {topProducts.length ? topProducts.map((p, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition">
                                <div>
                                    <p className="font-medium text-gray-900">{p.name}</p>
                                    <p className="text-sm text-gray-500">Sold {p.total_sold} pcs</p>
                                </div>
                                <div className="text-gray-800 font-semibold">₹{p.total_revenue}</div>
                            </div>
                        )) : small("No top products data")}
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className={cardBase}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs text-gray-500">ID</th>
                                    <th className="px-4 py-2 text-left text-xs text-gray-500">User</th>
                                    <th className="px-4 py-2 text-left text-xs text-gray-500">Amount</th>
                                    <th className="px-4 py-2 text-left text-xs text-gray-500">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentOrders.length ? recentOrders.map(o => (
                                    <tr key={o.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-mono text-gray-500">{o.id}</td>
                                        <td className="px-4 py-3 text-gray-900">{o.username}</td>
                                        <td className="px-4 py-3 text-gray-700">₹{o.amount}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${o.status === "delivered" ? "bg-green-100 text-green-700" : o.status === "processing" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>
                                                {o.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan="4" className="p-6 text-gray-500">No recent orders.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={cardBase}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory & Categories</h3>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Low stock</p>
                            {lowStock.length ? lowStock.map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                                    <div>
                                        <p className="text-gray-900 font-medium">{p.name}</p>
                                        <p className="text-sm text-gray-500">Stock: {p.stock_quantity}</p>
                                    </div>
                                    <span className="text-red-600 font-semibold">Low</span>
                                </div>
                            )) : small("All products healthy")}
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-2">Sales by category</p>
                            {salesByCategory.length ? (
                                <div className="h-28">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={salesByCategory}>
                                            <XAxis dataKey="category" />
                                            <Tooltip />
                                            <Bar dataKey="total_sales" radius={[6, 6, 0, 0]} fill="#2563eb" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : small("No category data")}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

/* ------------------ Analytics tab ------------------ */
function Analytics({ salesByCategory, customerGrowth, weeklyActive, orderStatusCount, forecast, topProducts }) {
    const sales = (salesByCategory || []).map(s => ({ category: s.category || s.name, total_sales: s.total_sales || s.value || 0 }));
    const growth = customerGrowth || [];
    const forecastHistory = forecast?.history || [];
    const forecastPred = forecast?.forecast || [];

    // prepare orderStatus pie data fallback
    const statusData = orderStatusCount ? Object.keys(orderStatusCount).map((k, i) => ({ name: k, value: orderStatusCount[k], color: palette[i % palette.length] })) : null;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className={cardBase + " lg:col-span-2"}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue + Forecast (historical + AI prediction)</h3>
                    <div className="h-72">
                        {forecastHistory.length || forecastPred.length ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={[...forecastHistory, ...forecastPred].slice(-180)}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                    <YAxis />
                                    <Tooltip />
                                    <Line dataKey="revenue" data={forecastHistory} name="History" stroke="#2563eb" strokeWidth={2} dot={false} />
                                    <Line dataKey="revenue" data={forecastPred} name="Forecast" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="6 6" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : small("No forecast data found")}
                    </div>
                </div>

                <div className={cardBase}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
                    {statusData ? (
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={3}>
                                        {statusData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                                    </Pie>
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : small("Order status breakdown not available")}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className={cardBase}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
                    {sales.length ? (
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={sales}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                                    <XAxis dataKey="category" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="total_sales" fill="#1f2937" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : small("No sales by category")}
                </div>

                <div className={cardBase}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Growth (months)</h3>
                    {growth.length ? (
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={growth}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line dataKey="users" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : small("No growth data")}
                </div>

                <div className={cardBase}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Active Users</h3>
                    {weeklyActive?.length ? (
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyActive}>
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="active" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : small("WAU data not available")}
                </div>
            </div>

            <div className={`${cardBase}`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Velocity (heat-style)</h3>
                {topProducts?.length ? (
                    <ProductHeatGrid products={topProducts} />
                ) : small("No product data")}
            </div>
        </div>
    );
}

/* ------------------ AI Insights tab ------------------ */
function AIInsights({ forecast, productPerf, anomalies }) {
    return (
        <div className="space-y-6">
            <div className={cardBase}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Sales Forecast</h3>
                {forecast?.history?.length ? (
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[...forecast.history, ...forecast.forecast]}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line dataKey="revenue" data={forecast.history} stroke="#2563eb" strokeWidth={2} dot={false} />
                                <Line dataKey="revenue" data={forecast.forecast} stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="6 6" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : small("AI forecast not available")}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={cardBase}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Performance Score</h3>
                    {productPerf?.products?.length ? (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {productPerf.products.map(p => (
                                <div key={p.product_id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                                    <div>
                                        <p className="font-medium text-gray-900">{p.name}</p>
                                        <p className="text-sm text-gray-500">Score {p.score} • {p.category}</p>
                                    </div>
                                    <div className="text-sm text-gray-700">{p.qty_30} / 30d</div>
                                </div>
                            ))}
                        </div>
                    ) : small("No performance data")}
                </div>

                <div className={cardBase}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Detected Anomalies</h3>
                    {anomalies?.anomalies?.length ? (
                        <div className="space-y-3">
                            {anomalies.anomalies.map(a => (
                                <div key={a.date} className="bg-gray-50 p-3 rounded-xl">
                                    <p className="font-medium text-gray-900">{a.date}</p>
                                    <p className="text-sm text-gray-500">Revenue: ₹{a.revenue} • z={a.zscore}</p>
                                </div>
                            ))}
                        </div>
                    ) : small("No anomalies detected")}
                </div>
            </div>
        </div>
    );
}

/* ------------------ Small helper components ------------------ */
function ProductHeatGrid({ products = [] }) {
    // color mapping based on amount sold / revenue — normalize and show 5 steps
    const values = products.map(p => p.total_sold || p.qty_30 || p.revenue || 0);
    const min = Math.min(...values, 0);
    const max = Math.max(...values, 1);

    const colorFor = (v) => {
        const t = Math.round(((v - min) / (max - min)) * 4);
        const cols = ["#eef2ff", "#ddd6fe", "#c7b3ff", "#a78bfa", "#7c3aed"];
        return cols[Math.max(0, Math.min(cols.length - 1, t))];
    };

    const top = products.slice(0, 12); // show first 12 in a grid
    return (
        <div className="grid grid-cols-3 gap-3">
            {top.map((p, idx) => (
                <div key={idx} className="rounded-2xl p-3 flex flex-col gap-2" style={{ background: colorFor(values[idx]) }}>
                    <div className="text-sm text-gray-700 font-medium truncate">{p.name}</div>
                    <div className="text-xs text-gray-600">Sold: <span className="font-semibold">{p.total_sold || p.qty_30 || 0}</span></div>
                </div>
            ))}
        </div>
    );
}
