import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    HeartIcon,
    TrashIcon,
    BellIcon,
    PencilIcon,
    XCircleIcon,
    ChartBarIcon
} from "@heroicons/react/24/outline";

import {
    LineChart,
    Line,
    XAxis,
    Tooltip,
    YAxis,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [alertLoading, setAlertLoading] = useState({});
    const [alertSuccess, setAlertSuccess] = useState({});
    const [priceHistoryMap, setPriceHistoryMap] = useState({}); // <-- map: productId -> [{date, price}, ...]
    const [priceHistory, setPriceHistory] = useState([]); // used for modal chart
    const [showChartModal, setShowChartModal] = useState(false);
    const [chartProductName, setChartProductName] = useState("");

    // Helper: determine short-term trend from history array
    const getTrend = (history) => {
        // history: [{date, price}, ...] ordered ascending
        if (!history || history.length < 2) return null;
        const last = Number(history[history.length - 1].price);
        const prev = Number(history[history.length - 2].price);
        if (isNaN(last) || isNaN(prev)) return null;
        if (last < prev) return "down";
        if (last > prev) return "up";
        return "same";
    };

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const wishlistRes = await axios.get("/api/wishlist");
                const alertsRes = await axios.get("/api/price-alerts");

                const alertsMap = {};
                alertsRes.data.forEach((a) => {
                    alertsMap[a.product_id] = a;
                });

                const items = wishlistRes.data || [];
                setWishlist(items);
                setAlertSuccess(alertsMap);

                // Minimal-change approach: fetch price history per item (small loop)
                // build a map product_id -> history array
                const historyMap = {};
                await Promise.all(
                    items.map(async (item) => {
                        try {
                            const res = await axios.get(`/api/products/${item.product_id}/price-history`);
                            // Ensure format: array of {date, price}
                            historyMap[item.product_id] = Array.isArray(res.data)
                                ? res.data.map(entry => ({ date: entry.date, price: Number(entry.price) || 0 }))
                                : [];
                        } catch (err) {
                            historyMap[item.product_id] = [];
                        }
                    })
                );

                setPriceHistoryMap(historyMap);

            } catch (err) {
                console.error(err);
                setError("Failed to load wishlist.");
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    const removeFromWishlist = async (productId) => {
        const prev = [...wishlist];
        setWishlist(prev.filter((i) => i.product_id !== productId));

        try {
            await axios.delete(`/api/wishlist/remove/${productId}`);
        } catch (err) {
            console.error(err);
            setError("Failed to remove item.");
            setWishlist(prev);
        }
    };

    const addPriceAlert = async (productId, price) => {
        setAlertLoading((p) => ({ ...p, [productId]: true }));
        try {
            const res = await axios.post("/api/price-alerts", {
                product_id: productId,
                target_price: price,
            });
            window.location.reload();
            setAlertSuccess((p) => ({ ...p, [productId]: res.data }));
        } catch (err) {
            console.error(err);
            setError("Failed to set price alert.");
        } finally {
            setAlertLoading((p) => ({ ...p, [productId]: false }));
        }
    };

    const modifyAlert = async (alertId, productId, newPrice) => {
        setAlertLoading((p) => ({ ...p, [productId]: true }));
        try {
            const res = await axios.put(`/api/price-alerts/${alertId}`, {
                target_price: newPrice,
            });
            setAlertSuccess((p) => ({ ...p, [productId]: res.data }));
            window.location.reload();
        } catch (err) {
            console.error(err);
            setError("Failed to update alert.");
        } finally {
            setAlertLoading((p) => ({ ...p, [productId]: false }));
        }
    };

    const deleteAlert = async (alertId, productId) => {
        setAlertLoading((p) => ({ ...p, [productId]: true }));
        try {
            await axios.delete(`/api/price-alerts/${alertId}`);
            setAlertSuccess((prev) => {
                const x = { ...prev };
                delete x[productId];
                return x;
            });
            window.location.reload();
        } catch (err) {
            console.error(err);
            setError("Failed to delete alert.");
        } finally {
            setAlertLoading((p) => ({ ...p, [productId]: false }));
        }
    };

    // Fetch price history for modal (keeps existing behavior)
    const openPriceHistory = async (productId, name) => {
        setChartProductName(name);
        try {
            const res = await axios.get(`/api/products/${productId}/price-history`);
            const arr = Array.isArray(res.data)
                ? res.data.map(entry => ({ date: entry.date, price: Number(entry.price) || 0 }))
                : [];
            // If no data, provide a friendly fallback so chart doesn't break
            setPriceHistory(arr.length ? arr : [{ date: new Date().toISOString().slice(0, 10), price: 0 }]);
            setShowChartModal(true);
        } catch (err) {
            console.error(err);
            setPriceHistory([{ date: new Date().toISOString().slice(0, 10), price: 0 }]);
            setShowChartModal(true);
            setError("Failed to fetch price history.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-10 w-10 border-[3px] border-gray-300 border-t-black rounded-full"></div>
            </div>
        );
    }

    const WishlistCard = ({ product }) => {
        const alert = alertSuccess[product.product_id];
        const [inputVisible, setInputVisible] = useState(false);
        const [modifyMode, setModifyMode] = useState(false);
        const [priceInput, setPriceInput] = useState(product.price);

        const saveAlert = () => {
            if (modifyMode) {
                modifyAlert(alert.id, product.product_id, priceInput);
                setModifyMode(false);
            } else {
                addPriceAlert(product.product_id, priceInput);
                setInputVisible(false);
            }
        };

        // Compute trend using priceHistoryMap
        const historyForProduct = priceHistoryMap[product.product_id] || [];
        const trend = getTrend(historyForProduct);

        return (
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-md transition-all p-4 relative">

                {/* IMAGE */}
                <Link to={`/customer/products/${product.product_id}`}>
                    <div className="rounded-2xl bg-gray-50 flex items-center justify-center h-44 border">
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>

                    <h3 className="mt-4 text-gray-900 font-semibold text-lg tracking-tight">
                        {product.name}
                    </h3>

                    {/* PRICE + TREND */}
                    <p className="text-gray-600 mt-1 text-sm flex items-center gap-2">
                        <span>₹{product.price}</span>

                        {trend === "down" && (
                            <span className="text-green-600 text-xs font-semibold flex items-center gap-1">
                                <span className="text-lg">📉</span>
                                Falling
                            </span>
                        )}

                        {trend === "up" && (
                            <span className="text-red-600 text-xs font-semibold flex items-center gap-1">
                                <span className="text-lg">📈</span>
                                Rising
                            </span>
                        )}

                        {trend === "same" && (
                            <span className="text-gray-400 text-xs font-medium flex items-center gap-1">
                                — stable
                            </span>
                        )}
                    </p>
                </Link>

                {/* TOP RIGHT ACTION BUTTONS */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">

                    {/* Remove */}
                    <button
                        onClick={() => removeFromWishlist(product.product_id)}
                        className="bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>

                    {/* Add/Edit price alert */}
                    {!alert && !inputVisible && (
                        <button
                            onClick={() => setInputVisible(true)}
                            className="bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100"
                        >
                            <BellIcon className="h-5 w-5" />
                        </button>
                    )}

                    {/* Edit existing alert */}
                    {alert && !modifyMode && (
                        <button
                            onClick={() => {
                                setModifyMode(true);
                                setPriceInput(alert.target_price);
                            }}
                            className="bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100"
                        >
                            <PencilIcon className="h-5 w-5" />
                        </button>
                    )}

                    {/* Delete alert */}
                    {alert && (
                        <button
                            onClick={() => deleteAlert(alert.id, product.product_id)}
                            className="bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100"
                        >
                            <XCircleIcon className="h-5 w-5" />
                        </button>
                    )}

                    {/* 📈 Price history popover button */}
                    <button
                        onClick={() => openPriceHistory(product.product_id, product.name)}
                        className="bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100"
                    >
                        <ChartBarIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* PRICE INPUT */}
                {(inputVisible || modifyMode) && (
                    <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between">
                        <input
                            type="number"
                            value={priceInput}
                            onChange={(e) => setPriceInput(e.target.value)}
                            className="w-1/2 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-black"
                        />
                        <button
                            onClick={saveAlert}
                            disabled={alertLoading[product.product_id]}
                            className="px-4 py-2 bg-black text-white rounded-xl ml-3"
                        >
                            {alertLoading[product.product_id] ? "…" : "Save"}
                        </button>
                    </div>
                )}

                {/* EXISTING ALERT */}
                {alert && !modifyMode && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-sm text-green-700">
                        Alert: ₹{alert.target_price}
                    </div>
                )}

                {/* TRIGGERED ALERT */}
                {alert && product.price <= alert.target_price && (
                    <div className="mt-2 bg-green-600 text-white rounded-xl px-3 py-2 text-sm">
                        Price dropped to ₹{product.price}!
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">

            {/* PAGE TITLE */}
            <h1 className="text-4xl font-semibold tracking-tight mb-10">
                Your Wishlist
            </h1>

            {/* MAIN LAYOUT WRAPPER */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

                {/* LEFT — PRODUCTS GRID (takes 3/4 on desktop) */}
                <div className="lg:col-span-3">

                    {wishlist.length === 0 ? (
                        <div className="text-center py-20 bg-white border border-gray-200 rounded-3xl">
                            <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 mb-6">Your wishlist is empty</p>
                            <Link
                                to="/customer/allproducts"
                                className="bg-black text-white px-8 py-3 rounded-2xl inline-block hover:bg-gray-900"
                            >
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {wishlist.map((p) => (
                                <WishlistCard key={p.product_id} product={p} />
                            ))}
                        </div>
                    )}
                </div>

                {/* RIGHT — INFO BOX */}
                <div className="lg:col-span-1">

                    <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 shadow-sm sticky top-24">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            Stay Updated 🔔
                        </h2>

                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                            Add <span className="font-medium text-black">Price Alerts</span> to any
                            product in your wishlist. You'll be notified instantly via email when
                            the price drops below your target.
                        </p>

                        <p className="text-gray-500 text-xs">
                            You can also view detailed price history charts for each product.
                        </p>
                    </div>
                </div>
            </div>

            {/* ACTIVE PRICE ALERTS — FULL WIDTH */}
            {Object.keys(alertSuccess).length > 0 && (
                <div className="mt-16 bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6">Active Price Alerts</h2>

                    <div className="space-y-3">
                        {wishlist
                            .filter((w) => alertSuccess[w.product_id])
                            .map((item) => {
                                const a = alertSuccess[item.product_id];
                                return (
                                    <div
                                        key={a.id}
                                        className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-gray-600 text-sm">
                                                Target Price: ₹{a.target_price}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() =>
                                                openPriceHistory(item.product_id, item.name)
                                            }
                                            className="text-blue-600 text-sm font-medium hover:underline"
                                        >
                                            View Chart →
                                        </button>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}

            {/* PRICE HISTORY MODAL */}
            {showChartModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 ">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 relative">

                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
                            onClick={() => setShowChartModal(false)}
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-semibold mb-4">
                            Price History – {chartProductName}
                        </h2>

                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={priceHistory}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="price"
                                        stroke="#2563eb"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: "#2563eb" }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );

}
