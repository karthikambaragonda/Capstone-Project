import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

export default function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { formData, redeemPoints, cart } = location.state || {};

    useEffect(() => {
        // Redirect back if page accessed directly without checkout data
        if (!formData || !cart) {
            navigate('/checkout');
        }
    }, [formData, cart, navigate]);

    if (!formData || !cart) return null;

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalTotal = Math.max(subtotal - redeemPoints, 0);

    const handlePaymentConfirm = async () => {
        try {
            await axios.post('/api/orders/create', {
                ...formData,
                redeemPoints,
                paymentStatus: 'paid'
            });
            navigate('/customer/orders');
        } catch (err) {
            alert('Payment failed. Please try again.', err);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex justify-center items-center p-6 font-sans">
            <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-8">
                <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
                    Payment Page
                </h1>

                <div className="space-y-4 mb-6 text-gray-700">
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Payment Method:</strong> {formData.paymentMethod}</p>
                    <p><strong>Redeemed Points:</strong> {redeemPoints}</p>
                    <p><strong>Total Amount:</strong> ₹{finalTotal.toFixed(2)}</p>
                </div>

                <button
                    onClick={handlePaymentConfirm}
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                >
                    Confirm Payment
                </button>

                <button
                    onClick={() => navigate(-1)}
                    className="w-full mt-3 bg-gray-200 text-gray-800 font-medium py-2 rounded-lg hover:bg-gray-300 transition duration-200"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}

// import { useLocation, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import axios from "axios";
// import { FaCreditCard } from "react-icons/fa";

// export default function PaymentPage() {
//     const location = useLocation();
//     const navigate = useNavigate();

//     const { formData, redeemPoints, cart } = location.state || {};

//     const [cardData, setCardData] = useState({
//         cardNumber: "",
//         expiry: "",
//         cvv: "",
//         nameOnCard: "",
//     });

//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);

//     if (!cart) {
//         return <div className="text-center py-32 text-gray-600">Invalid Payment Session</div>;
//     }

//     const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
//     const finalTotal = subtotal - redeemPoints;

//     const handleInput = (e) => {
//         const { name, value } = e.target;
//         setCardData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handlePayment = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             await axios.post("/api/orders/create", {
//                 ...formData,
//                 redeemPoints,
//                 paymentStatus: "paid",
//             });

//             navigate("/customer/orders");
//         } catch (err) {
//             setError("Payment failed. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="w-full bg-[#fafafa] min-h-screen py-20 px-4">

//             {/* HEADER */}
//             <h1 className="text-4xl font-semibold text-center tracking-tight mb-12">
//                 Payment
//             </h1>

//             <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

//                 {/* LEFT — PAYMENT FORM */}
//                 <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 p-10 space-y-10">

//                     <h2 className="text-2xl font-semibold tracking-tight mb-6">Card Details</h2>

//                     {error && (
//                         <div className="text-red-600 bg-red-50 border border-red-200 rounded-xl p-4 text-sm">
//                             {error}
//                         </div>
//                     )}

//                     <form onSubmit={handlePayment} className="space-y-6">

//                         {/* NAME */}
//                         <div>
//                             <label className="block text-gray-700 text-sm mb-1">
//                                 Name on Card
//                             </label>
//                             <input
//                                 type="text"
//                                 name="nameOnCard"
//                                 value={cardData.nameOnCard}
//                                 onChange={handleInput}
//                                 required
//                                 className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-black"
//                             />
//                         </div>

//                         {/* CARD NUMBER */}
//                         <div>
//                             <label className="block text-gray-700 text-sm mb-1">
//                                 Card Number
//                             </label>
//                             <input
//                                 type="text"
//                                 name="cardNumber"
//                                 value={cardData.cardNumber}
//                                 onChange={handleInput}
//                                 maxLength="16"
//                                 required
//                                 className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-black tracking-widest"
//                             />
//                         </div>

//                         {/* EXP + CVV */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                             <div>
//                                 <label className="block text-gray-700 text-sm mb-1">
//                                     Expiry (MM/YY)
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="expiry"
//                                     value={cardData.expiry}
//                                     onChange={handleInput}
//                                     required
//                                     className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-black"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-gray-700 text-sm mb-1">
//                                     CVV
//                                 </label>
//                                 <input
//                                     type="password"
//                                     name="cvv"
//                                     value={cardData.cvv}
//                                     onChange={handleInput}
//                                     required
//                                     maxLength="3"
//                                     className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-black"
//                                 />
//                             </div>
//                         </div>

//                         {/* PAY BUTTON */}
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full bg-black text-white text-lg font-medium py-4 rounded-2xl hover:bg-gray-900 transition"
//                         >
//                             {loading ? "Processing…" : "Pay ₹" + finalTotal.toFixed(2)}
//                         </button>

//                     </form>
//                 </div>

//                 {/* RIGHT — ORDER SUMMARY */}
//                 <div className="bg-white rounded-3xl border border-gray-200 p-10 h-fit space-y-8">

//                     <h2 className="text-2xl font-semibold tracking-tight mb-4">Order Summary</h2>

//                     <div className="space-y-4">
//                         {cart.items.map((item) => (
//                             <div
//                                 key={item.id}
//                                 className="flex justify-between items-center border-b border-gray-200 pb-4"
//                             >
//                                 <div className="flex items-center">
//                                     <img
//                                         src={item.image_url}
//                                         className="w-14 h-14 rounded-xl object-cover"
//                                         alt={item.name}
//                                     />
//                                     <div className="ml-4">
//                                         <h3 className="text-gray-900 font-medium">{item.name}</h3>
//                                         <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
//                                     </div>
//                                 </div>

//                                 <span className="font-semibold text-gray-900">
//                                     ₹{(item.price * item.quantity).toFixed(2)}
//                                 </span>
//                             </div>
//                         ))}
//                     </div>

//                     <div className="space-y-4 pt-4 text-gray-700">
//                         <div className="flex justify-between">
//                             <span>Subtotal</span>
//                             <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
//                         </div>

//                         <div className="flex justify-between">
//                             <span>Redeemed Points</span>
//                             <span className="font-semibold text-green-600">
//                                 - ₹{redeemPoints}
//                             </span>
//                         </div>

//                         <div className="border-t border-gray-300 pt-4 flex justify-between items-center">
//                             <span className="text-xl font-semibold text-gray-900">Total</span>
//                             <span className="text-2xl font-bold text-gray-900">
//                                 ₹{finalTotal.toFixed(2)}
//                             </span>
//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     );
// }
