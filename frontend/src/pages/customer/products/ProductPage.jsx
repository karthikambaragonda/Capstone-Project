import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    StarIcon,
    HeartIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/solid';
import ProductCard from '../../../components/customer/ProductCard';
import { motion, AnimatePresence } from "framer-motion";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts';

// ---------------- IOS BANNER ----------------
const IOSBanner = ({ message, show }) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -60, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="
                        fixed top-4 left-1/2 -translate-x-1/2
                        px-6 py-3 rounded-2xl 
                        backdrop-blur-xl bg-white/90 
                        border border-gray-200 shadow-xl
                        flex items-center gap-3 z-[9999]
                    "
                >
                    <motion.div
                        initial={{ scale: 0.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 12 }}
                    >
                        <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    </motion.div>

                    <span className="font-semibold text-gray-900 text-sm">
                        {message}
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ---------------- PRICE HISTORY MODAL ----------------
function PriceHistoryModal({ open, onClose, productName, data, loading, error }) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center 
                               bg-black/40 backdrop-blur-md p-6"
                >
                    <motion.div
                        initial={{ y: 20, scale: 0.96 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: 20, scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 200, damping: 22 }}
                        className="bg-white/90 backdrop-blur-xl w-full max-w-3xl 
                                   rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.1)]
                                   border border-white/40 p-6 relative"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between pb-4 border-b border-gray-200/50">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Price History</h3>
                                <p className="text-sm text-gray-500">{productName}</p>
                            </div>
                            <button
                                onClick={onClose}
                                aria-label="Close"
                                className="text-gray-500 hover:text-gray-800 text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div className="mt-4">
                            {loading ? (
                                <div className="flex items-center justify-center h-56">
                                    <div className="animate-spin h-10 w-10 border-2 
                                                    border-gray-300 border-t-black rounded-full"></div>
                                </div>
                            ) : error ? (
                                <div className="p-4 bg-red-50 text-red-700 rounded-xl">
                                    {error}
                                </div>
                            ) : data.length === 0 ? (
                                <div className="p-4 text-gray-600">No price history available.</div>
                            ) : (
                                <div className="h-72">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={data}>

                                            {/* Apple-style Grid */}
                                            <CartesianGrid
                                                strokeDasharray="4 4"
                                                vertical={false}
                                                stroke="rgba(0,0,0,0.08)"
                                            />

                                            {/* Axes */}
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fontSize: 12, fill: "#6b7280" }}
                                                tickMargin={10}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12, fill: "#6b7280" }}
                                                tickFormatter={(v) => `₹${v}`}
                                            />

                                            {/* Tooltip */}
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: "12px",
                                                    border: "1px solid #e5e7eb",
                                                    background: "white",
                                                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                                }}
                                                formatter={(val) => `₹${Number(val).toLocaleString()}`}
                                            />

                                            {/* Gradients */}
                                            <defs>
                                                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
                                                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                                                </linearGradient>

                                                <linearGradient id="baseGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#6b7280" stopOpacity={0.4} />
                                                    <stop offset="100%" stopColor="#6b7280" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>

                                            {/* Price Line */}
                                            <Line
                                                type="monotone"
                                                dataKey="price"
                                                stroke="#2563eb"
                                                strokeWidth={3}
                                                dot={{
                                                    r: 5,
                                                    fill: "#2563eb",
                                                    stroke: "#fff",
                                                    strokeWidth: 2,
                                                    className: "shadow-lg"
                                                }}
                                                activeDot={{
                                                    r: 7,
                                                    fill: "#2563eb",
                                                    stroke: "#fff",
                                                    strokeWidth: 3,
                                                }}
                                                name="Price"
                                                fillOpacity={1}
                                                fill="url(#priceGradient)"
                                            />

                                            {/* Base Price Line */}
                                            <Line
                                                type="monotone"
                                                dataKey="base_price"
                                                stroke="#9ca3af"
                                                strokeWidth={2}
                                                strokeDasharray="5 5"
                                                dot={false}
                                                name="Base Price"
                                                fillOpacity={1}
                                                fill="url(#baseGradient)"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="mt-5 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 
                                           rounded-xl text-sm text-gray-700"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ---------------- MAIN PAGE ----------------
export default function ProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);

    const [reviews, setReviews] = useState([]);
    const [newStar, setNewStar] = useState(5);
    const [newText, setNewText] = useState('');
    const [reviewsLoading, setReviewsLoading] = useState(true);

    const [banner, setBanner] = useState({ show: false, message: "" });

    const [sentimentBased, setSentimentBased] = useState({
        positive: [], neutral: [], poor: []
    });

    // Price history modal state
    const [chartOpen, setChartOpen] = useState(false);
    const [chartData, setChartData] = useState([]);
    const [chartLoading, setChartLoading] = useState(false);
    const [chartError, setChartError] = useState('');

    const showBanner = (msg) => {
        setBanner({ show: true, message: msg });
        setTimeout(() => setBanner({ show: false, message: "" }), 2000);
    };

    // ---------------- LOAD PRODUCT ----------------
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/products/${id}`);
                setProduct(res.data);
                // track view (optional)
                await axios.post('/api/user/track-view', { product_id: id }, { withCredentials: true }).catch(() => { });
            } catch (err) {
                setError(err?.response?.data?.message || "Product not found");
            }
            setLoading(false);
        };
        load();
    }, [id]);

    // ---------------- REVIEWS ----------------
    const fetchReviews = async () => {
        setReviewsLoading(true);
        try {
            const res = await axios.get(`/api/products/${id}/reviews`);
            setReviews(res.data);
        } catch {
            // ignore
        }
        setReviewsLoading(false);
    };
    useEffect(() => { fetchReviews(); }, [id]);

    // ---------------- SENTIMENT PRODUCTS ----------------
    useEffect(() => {
        const load = async () => {
            try {
                const res = await axios.get(`/api/recommendations/sentiment-based/${id}`, { withCredentials: true });
                setSentimentBased(res.data);
            } catch { }
        };
        load();
    }, [id]);

    // ---------------- PRICE HISTORY FETCH ----------------
    const openPriceChart = async () => {
        setChartOpen(true);
        setChartLoading(true);
        setChartError('');
        try {
            const res = await axios.get(`/api/products/${id}/price-history`);
            // Expect array of { date, price, base_price? }
            // Normalize: ensure base_price exists for each point (fallback to product.base_price)
            const data = (res.data || []).map((r) => ({
                date: r.date || (new Date(r.created_at || r.timestamp).toISOString().slice(0, 10)),
                price: Number(r.price || r.current_price || 0),
                base_price: Number(r.base_price ?? product?.base_price ?? 0)
            }));
            setChartData(data);
        } catch (err) {
            console.error("Price history error:", err);
            setChartError("Failed to load price history.");
        } finally {
            setChartLoading(false);
        }
    };

    // ---------------- ACTIONS ----------------
    const addToCart = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/cart/add', { productId: product.id, quantity }, { withCredentials: true });
            showBanner("Added to Cart");
            setTimeout(() => window.location.reload(), 1200);
        } catch (err) {
            console.error(err);
            showBanner("Failed to Add");
        }
    };

    const addToWishlist = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/wishlist/add', { productId: product.id }, { withCredentials: true });
            showBanner("Added to Wishlist");
        } catch (err) {
            console.error(err);
            showBanner("Failed to Add");
        }
    };

    const submitReview = async () => {
        if (!newText) return showBanner("Please write a review");
        try {
            await axios.post(`/api/products/${id}/reviews`, { star: newStar, text: newText }, { withCredentials: true });
            setNewText('');
            setNewStar(5);
            fetchReviews();
            showBanner("Review submitted");
        } catch (err) {
            console.error(err);
            showBanner("Failed to submit");
        }
    };

    // ---------------- RENDER ----------------
    if (loading) return <div className="text-center py-24 text-gray-500">Loading…</div>;
    if (error) return <div className="text-center py-24 text-red-600">{error}</div>;

    // discount calculation
    const basePrice = Number(product.base_price ?? 0);
    const currPrice = Number(product.price ?? 0);
    let discount = null;
    if (basePrice > 0 && currPrice < basePrice) {
        discount = Math.round(((basePrice - currPrice) / basePrice) * 100);
    }

    // trend label
    const trendLabel = basePrice === 0 ? '⚪ Stable' :
        currPrice > basePrice ? { label: `📈 `, color: 'text-red-500' } :
            currPrice < basePrice ? { label: `📉`, color: 'text-green-600' } :
                { label: '⚪ Stable', color: 'text-gray-500' };

    return (
        <>
            <IOSBanner message={banner.message} show={banner.show} />

            <div className="w-full bg-[#fafafa] min-h-screen pb-32">

                {/* HEADER */}
                <div className="max-w-6xl mx-auto px-4 lg:px-0 py-16 grid grid-cols-1 md:grid-cols-2 gap-16">

                    {/* IMAGE */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center bg-white rounded-3xl border border-gray-200 p-10"
                    >
                        <img
                            src={product.image_url || "https://via.placeholder.com/600x400?text=No+image"}
                            className="w-full max-h-[450px] object-contain"
                            alt={product.name}
                        />
                    </motion.div>

                    {/* DETAILS */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="space-y-6"
                    >
                        <h1 className="text-4xl font-semibold tracking-tight">{product.name}</h1>

                        {/* Ratings */}
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map(num => (
                                <StarIcon
                                    key={num}
                                    className={`h-5 w-5 ${num <= Math.round(product.average_rating ?? 0) ? "text-yellow-400" : "text-gray-300"}`}
                                />
                            ))}
                            <span className="text-gray-600">{(product.average_rating ?? 0).toFixed(1)}</span>
                            <span className="text-gray-400 text-sm">({product.review_count ?? 0} reviews)</span>
                        </div>

                        {/* Price row with chart button */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-baseline gap-3">
                                {/* Current Price */}
                                <span className="text-3xl font-semibold tracking-tight">
                                    ₹{currPrice.toFixed(2)}
                                </span>

                                {/* Base Price strike-through (if present) */}
                                {basePrice > 0 && (
                                    <span className="text-gray-400 line-through text-lg">
                                        ₹{basePrice.toFixed(2)}
                                    </span>
                                )}

                                {/* Discount badge */}
                                {discount !== null && (
                                    <span className="ml-2 px-2 py-1 text-sm rounded-full bg-green-50 text-green-700 font-medium">
                                        -{discount}%
                                    </span>
                                )}
                            </div>

                            {/* Trend */}
                            <div className={`text-sm font-medium ${trendLabel.color ?? ''}`}>
                                {typeof trendLabel === 'string' ? trendLabel : trendLabel.label}
                            </div>

                            {/* View Chart button */}
                            <button
                                onClick={openPriceChart}
                                className="ml-auto inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md text-sm"
                            >
                                View Price Chart
                            </button>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600">{product.description}</p>

                        {/* Quantity */}
                        <div>
                            <label className="text-gray-700 text-sm mb-1 block">Quantity</label>
                            <select
                                value={quantity}
                                onChange={e => setQuantity(Number(e.target.value))}
                                className="border border-gray-300 rounded-xl px-4 py-2 bg-white"
                            >
                                {[...Array(10)].map((_, i) => (
                                    <option key={i} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button onClick={addToCart} className="flex-1 bg-black text-white rounded-xl py-3 font-medium">
                                Add to Bag
                            </button>

                            <button
                                onClick={addToWishlist}
                                className="p-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                            >
                                <HeartIcon className="h-6 w-6 text-gray-700" />
                            </button>
                        </div>

                        {/* Info */}
                        <div className="pt-6 border-t border-gray-200 space-y-2">
                            <h3 className="font-medium">Product Details</h3>
                            <ul className="text-gray-600 text-sm space-y-1 list-disc pl-6">
                                <li>Stock: {product.stock_quantity ?? '—'}</li>
                                <li>30-day return policy</li>
                                <li>Fast delivery options</li>
                            </ul>
                        </div>
                    </motion.div>
                </div>

                {/* REVIEWS */}
                <div className="max-w-4xl mx-auto px-4 pt-12">
                    <h2 className="text-3xl font-semibold mb-6">Customer Reviews</h2>

                    {/* Write Review */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 mb-10">
                        <h3 className="font-medium text-gray-800">Write a Review</h3>

                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map(num => (
                                <StarIcon
                                    key={num}
                                    className={`h-6 w-6 cursor-pointer ${num <= newStar ? "text-yellow-400" : "text-gray-300"}`}
                                    onClick={() => setNewStar(num)}
                                />
                            ))}
                            <span className="text-gray-500 text-sm">{newStar} / 5</span>
                        </div>

                        <textarea
                            rows={4}
                            className="w-full border border-gray-300 rounded-xl p-3"
                            placeholder="Share your experience..."
                            value={newText}
                            onChange={e => setNewText(e.target.value)}
                        />

                        <button
                            onClick={submitReview}
                            className="bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-900 transition"
                        >
                            Submit Review
                        </button>
                    </div>

                    {/* Display Reviews */}
                    {reviewsLoading ? (
                        <p className="text-gray-500">Loading reviews...</p>
                    ) : reviews.length === 0 ? (
                        <p className="text-gray-500">No reviews yet.</p>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map(r => (
                                <div key={r.id} className="border-b border-gray-200 pb-4">
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map(num => (
                                            <StarIcon
                                                key={num}
                                                className={`h-5 w-5 ${num <= r.review_star ? "text-yellow-400" : "text-gray-300"}`}
                                            />
                                        ))}
                                        <span className="text-gray-600 text-sm">{r.user_name}</span>
                                        <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-700 mt-1">{r.review_text}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* SENTIMENT RECOMMENDATIONS */}
                <div className="max-w-6xl mx-auto px-4 mt-16 space-y-14">
                    <h2 className="text-3xl font-semibold">You May Also Like</h2>

                    {sentimentBased.positive.length > 0 && (
                        <div>
                            <h3 className="text-xl font-medium mb-4">Top Picks</h3>
                            <div className="flex overflow-x-auto gap-5 pb-4">
                                {sentimentBased.positive.map(p => <ProductCard key={p.id} product={p} />)}
                            </div>
                        </div>
                    )}

                    {sentimentBased.neutral.length > 0 && (
                        <div>
                            <h3 className="text-xl font-medium mb-4">Similar Products</h3>
                            <div className="flex overflow-x-auto gap-5 pb-4">
                                {sentimentBased.neutral.map(p => <ProductCard key={p.id} product={p} />)}
                            </div>
                        </div>
                    )}

                    {sentimentBased.poor.length > 0 && (
                        <div>
                            <h3 className="text-xl font-medium mb-4">Customers Disliked</h3>
                            <div className="flex overflow-x-auto gap-5 pb-4">
                                {sentimentBased.poor.map(p => <ProductCard key={p.id} product={p} />)}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Price history modal instance */}
            <PriceHistoryModal
                open={chartOpen}
                onClose={() => setChartOpen(false)}
                productName={product.name}
                data={chartData}
                loading={chartLoading}
                error={chartError}
            />
        </>
    );
}
