import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";

export default function CheckoutPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [availablePoints, setAvailablePoints] = useState(0);
    const [redeemPoints, setRedeemPoints] = useState(0);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        paymentMethod: "credit_card",
    });

    useEffect(() => {
        const load = async () => {
            try {
                const [cartRes, pointsRes] = await Promise.all([
                    axios.get("/api/cart"),
                    axios.get("/api/rewards/"),
                ]);
                setCart(cartRes.data);
                setAvailablePoints(pointsRes.data.points || 0);
            } catch (err) {
                setError("Failed to load checkout data");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRedeemChange = (e) => {
        const value = parseInt(e.target.value, 10) || 0;
        const subtotal =
            cart?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ||
            0;
        setRedeemPoints(Math.min(value, availablePoints, subtotal));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.paymentMethod === "credit_card" || formData.paymentMethod === "UPI") {
            return navigate("/customer/payment", {
                state: { formData, redeemPoints, cart },
            });
        }

        try {
            await axios.post("/api/orders/create", {
                ...formData,
                redeemPoints,
            });
            navigate("/customer/orders");
        } catch (err) {
            setError("Failed to place order");
        }
    };

    if (loading)
        return <div className="text-center py-32 text-gray-500 text-xl">Loading…</div>;

    if (error)
        return <div className="text-center text-red-600 py-10">{error}</div>;

    const subtotal =
        cart?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
    const discount = redeemPoints;
    const finalTotal = Math.max(subtotal - discount, 0);

    const paymentMethods = [
        {
            id: "credit_card",
            name: "Credit/Debit Card",
            icon: <FaCreditCard className="text-gray-700 text-xl mr-2" />,
        },
        { id: "UPI", name: "UPI (Google Pay, PhonePe, etc.)" },
        {
            id: "cod",
            name: "Cash on Delivery",
            icon: <FaMoneyBillWave className="text-gray-700 text-xl mr-2" />,
        },
    ];

    return (
        <div className="w-full bg-[#fafafa] min-h-screen py-20 px-4">
            <h1 className="text-4xl font-semibold text-center tracking-tight mb-12">
                Checkout
            </h1>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* ---------------- LEFT: SHIPPING FORM ---------------- */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 p-10 space-y-10">

                    <form onSubmit={handleSubmit}>

                        {/* SHIPPING INFO */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-6 tracking-tight">Shipping Information</h2>

                            <div className="space-y-5">
                                {["name", "email", "address"].map((field) => (
                                    <div key={field}>
                                        <label className="text-gray-700 text-sm mb-1 block capitalize">
                                            {field}
                                        </label>
                                        <input
                                            type={field === "email" ? "email" : "text"}
                                            name={field}
                                            value={formData[field]}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-black"
                                            required
                                        />
                                    </div>
                                ))}

                                {/* CITY STATE ZIP */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {["city", "state", "zip"].map((field) => (
                                        <div key={field}>
                                            <label className="text-gray-700 text-sm mb-1 block capitalize">
                                                {field}
                                            </label>
                                            <input
                                                type="text"
                                                name={field}
                                                value={formData[field]}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-black"
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* ---------------- PAYMENT METHOD ---------------- */}
                        <section className="pt-10">
                            <h2 className="text-2xl font-semibold mb-6 tracking-tight">
                                Payment Method
                            </h2>

                            <div className="space-y-4">
                                {paymentMethods.map((method) => (
                                    <label
                                        key={method.id}
                                        className="
                                            flex items-center gap-4
                                            border border-gray-300 rounded-2xl
                                            p-4 cursor-pointer bg-white
                                            hover:bg-gray-50 transition
                                        "
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={method.id}
                                            checked={formData.paymentMethod === method.id}
                                            onChange={handleInputChange}
                                            className="h-5 w-5 text-black"
                                        />

                                        <span className="flex items-center text-gray-800 text-base">
                                            {method.icon}
                                            {method.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        <button
                            type="submit"
                            className="mt-10 w-full bg-black text-white text-lg font-medium py-4 rounded-2xl hover:bg-gray-900 transition"
                        >
                            Place Order
                        </button>
                    </form>
                </div>

                {/* ---------------- RIGHT: ORDER SUMMARY ---------------- */}
                <div className="bg-white rounded-3xl border border-gray-200 p-10 h-fit space-y-8">

                    <h2 className="text-2xl font-semibold tracking-tight">Order Summary</h2>

                    {/* CART ITEMS */}
                    <div className="space-y-5">
                        {cart?.items?.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center border-b border-gray-200 pb-4"
                            >
                                <div className="flex items-center">
                                    <img
                                        src={item.image_url}
                                        className="w-16 h-16 rounded-2xl object-cover"
                                        alt={item.name}
                                    />
                                    <div className="ml-4">
                                        <h3 className="text-gray-900 font-medium">{item.name}</h3>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>

                                <p className="font-semibold text-gray-900">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* PRICING SUMMARY */}
                    <div className="space-y-4 text-gray-700">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Available Points</span>
                            <span className="font-semibold">{availablePoints}</span>
                        </div>

                        {/* Redeem Input Apple Style */}
                        <div className="flex justify-between items-center">
                            <label className="text-gray-700">Redeem Points</label>
                            <input
                                type="number"
                                value={redeemPoints}
                                min="0"
                                max={availablePoints}
                                onChange={handleRedeemChange}
                                className="w-28 border border-gray-300 rounded-xl px-3 py-1 text-right focus:ring-2 focus:ring-black"
                            />
                        </div>

                        {redeemPoints > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>- ₹{discount.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="border-t border-gray-300 pt-4 flex justify-between items-center">
                            <span className="text-xl font-semibold text-gray-900">Total</span>
                            <span className="text-2xl font-bold">₹{finalTotal.toFixed(2)}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
