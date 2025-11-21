import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await axios.get('/api/cart');
                setCart(res.data);
            } catch (err) {
                setError('Failed to load cart');
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    const updateQuantity = async (itemId, newQuantity) => {
        try {
            await axios.put(`/api/cart/update/${itemId}`, { quantity: newQuantity });
            const res = await axios.get('/api/cart');
            setCart(res.data);
        } catch {
            setError('Failed to update quantity');
        }
    };

    useEffect(() => {
        const fetchQuantity = async () => {
            axios.get('/api/cart/count', { withCredentials: true })
                .then(res => setQuantity(res.data.count));

            const id = setInterval(() => {
                axios.get('/api/cart/count', { withCredentials: true })
                    .then(res => setQuantity(res.data.count));
            }, 1000);

            return () => clearInterval(id);
        };
        fetchQuantity();
    }, []);

    const removeItem = async (itemId) => {
        try {
            await axios.delete(`/api/cart/remove/${itemId}`);
            const res = await axios.get('/api/cart');
            setCart(res.data);
        } catch {
            setError('Failed to remove item');
        }
    };

    if (loading) {
        return (
            <div className="text-center py-32 text-gray-600 text-xl">Loading your bag…</div>
        );
    }

    return (
        <div className="w-full bg-[#fafafa] min-h-screen py-20 px-4">

            {/* HEADER Apple Style */}
            <h1 className="text-4xl font-semibold text-center text-gray-900 mb-12 tracking-tight">
                Your Bag
            </h1>

            {error && (
                <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                    {error}
                </div>
            )}

            {/* EMPTY CART */}
            {cart?.items?.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-gray-200 max-w-xl mx-auto">
                    <p className="text-gray-500 text-lg mb-6">Your bag is empty</p>
                    <Link
                        to="/customer/allproducts"
                        className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-900 transition"
                    >
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* LEFT - CART ITEMS */}
                    <div className="lg:col-span-2 space-y-6">
                        {cart?.items?.map(item => (
                            <div
                                key={item.id}
                                className="bg-white rounded-3xl border border-gray-200 p-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6"
                            >
                                {/* IMAGE */}
                                <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl border border-gray-200 p-2">
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                {/* NAME + PRICE */}
                                <div className="flex-grow text-center sm:text-left">
                                    <div className="text-lg font-medium text-gray-900">
                                        {item.name}
                                    </div>
                                    <div className="text-gray-500 mt-1">
                                        ₹{Number(item.price)}
                                    </div>
                                </div>

                                {/* QTY + TOTAL + DELETE */}
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                                    {/* QTY SELECT Apple Style */}
                                    <select
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                        className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>

                                    {/* TOTAL */}
                                    <div className="text-lg font-semibold text-gray-900">
                                        ₹{(item.price * item.quantity).toFixed(2)}
                                    </div>

                                    {/* DELETE Apple Style */}
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-gray-500 hover:text-red-600 transition p-2"
                                    >
                                        <TrashIcon className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT - ORDER SUMMARY (APPLE STYLE PANE) */}
                    <div className="bg-white rounded-3xl border border-gray-200 p-8 h-fit">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
                            Order Summary
                        </h2>

                        <div className="space-y-5 text-gray-700">

                            {/* SUBTOTAL */}
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900">
                                    ₹{cart?.items?.reduce((sum, i) => sum + i.price * i.quantity, 0)}
                                </span>
                            </div>

                            {/* SHIPPING */}
                            <div className="flex justify-between text-sm">
                                <span>Shipping</span>
                                <span className="font-medium text-gray-900">Free</span>
                            </div>

                            {/* TAX */}
                            <div className="flex justify-between text-sm">
                                <span>Tax</span>
                                <span className="font-medium text-gray-900">₹0.00</span>
                            </div>

                            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                                <span className="text-lg font-semibold">Total</span>
                                <span className="text-xl font-semibold text-gray-900">
                                    ₹{cart?.items?.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* CHECKOUT BUTTON */}
                        <Link
                            to="/customer/checkout"
                            className="mt-8 block bg-black text-white text-center py-3 rounded-xl text-sm font-medium hover:bg-gray-900 transition"
                        >
                            Continue to Checkout
                        </Link>
                    </div>

                </div>
            )}
        </div>
    );
}
