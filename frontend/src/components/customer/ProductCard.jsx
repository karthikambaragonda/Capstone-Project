import { Link } from 'react-router-dom';
import { StarIcon, HeartIcon, ShoppingCartIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";

// 🍏 iOS-Style Top Banner Component
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
                    {/* Success Icon Animation */}
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

export default function ProductCard({ product }) {
    const [ratingData, setRatingData] = useState({ average_rating: 0, review_count: 0 });
    const [isInWishlist, setIsInWishlist] = useState(false);

    // 🍏 Banner State
    const [banner, setBanner] = useState({ show: false, message: "" });

    const showBanner = (msg) => {
        setBanner({ show: true, message: msg });
        setTimeout(() => setBanner({ show: false, message: "" }), 2000);
    };

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const res = await axios.get(`/api/products/${product.id}`);
                setRatingData({
                    average_rating: res.data.average_rating,
                    review_count: res.data.review_count
                });
            } catch (err) {
                console.error(err);
            }
        };

        const checkWishlist = async () => {
            try {
                const res = await axios.get('/api/wishlist', { withCredentials: true });
                const wishlistIds = res.data.map(item => item.product_id);
                setIsInWishlist(wishlistIds.includes(product.id));
            } catch (err) {
                console.error('Wishlist fetch error:', err);
            }
        };

        fetchRatings();
        checkWishlist();
    }, [product.id]);

    const addToCart = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/cart/add', { productId: product.id, quantity: 1 }, { withCredentials: true });
            showBanner("Added to Cart");
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err) {
            console.error(err);
            showBanner("Failed to Add");
        }
    };

    const addToWishlist = async (e) => {
        e.preventDefault();
        try {
            if (isInWishlist) {
                showBanner("Already in Wishlist");
                return;
            }
            await axios.post('/api/wishlist/add', { productId: product.id }, { withCredentials: true });
            setIsInWishlist(true);
            showBanner("Added to Wishlist");
        } catch (err) {
            console.error(err);
            showBanner("Failed to Add");
        }
    };

    return (
        <>
            {/* 🍏 iOS Banner */}
            <IOSBanner message={banner.message} show={banner.show} />

            <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="group bg-white rounded-3xl border border-gray-200 
                shadow-sm hover:shadow-md 
                transition-all duration-300 overflow-hidden"
            >
                <Link to={`/customer/products/${product.id}`} className="block">

                    {/* IMAGE */}
                    <div className="relative w-full h-56 bg-white flex items-center justify-center overflow-hidden">
                        <img
                            src={product.image_url || "https://via.placeholder.com/300"}
                            alt={product.name}
                            className="w-full h-full object-contain p-6 
                            transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Wishlist */}
                        <button
                            onClick={addToWishlist}
                            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm 
                            border border-gray-200 p-2 rounded-full shadow-sm
                            hover:bg-white transition"
                        >
                            <HeartIcon className={`h-5 w-5 ${isInWishlist ? "text-red-500" : "text-gray-500"}`} />
                        </button>
                    </div>

                    {/* CONTENT */}
                    <div className="p-5 space-y-3">

                        <h3 className="text-lg font-semibold text-gray-900 tracking-tight line-clamp-1">
                            {product.name}
                        </h3>

                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <StarIcon
                                    key={rating}
                                    className={`h-4 w-4 ${rating <= Math.round(ratingData.average_rating || 0)
                                        ? "text-yellow-400"
                                        : "text-gray-200"
                                        }`}
                                />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">
                                {ratingData.review_count}
                            </span>
                        </div>

                        <p className="text-2xl font-semibold text-gray-900">
                            ₹{Number(product.price)}
                        </p>

                        <div className="flex justify-between items-center pt-2">
                            <button
                                onClick={addToCart}
                                className="flex items-center gap-2 bg-black text-white 
                                px-4 py-2 rounded-xl text-sm font-medium 
                                hover:bg-gray-900 transition"
                            >
                                <ShoppingCartIcon className="h-4 w-4" />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </Link>
            </motion.div>
        </>
    );
}
