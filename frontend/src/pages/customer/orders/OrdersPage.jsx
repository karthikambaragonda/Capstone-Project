import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    ClockIcon,
    CheckCircleIcon,
    TruckIcon,
    HomeIcon,
    ShoppingCartIcon,
    XCircleIcon,
    ArrowUturnLeftIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const getStatusColor = (status) => {
    switch (status) {
        case "pending": return "text-yellow-600";
        case "processing": return "text-blue-600";
        case "shipped": return "text-purple-600";
        case "delivered": return "text-green-600";
        case "cancelled": return "text-red-600";
        case "returned": return "text-orange-600";
        default: return "text-gray-600";
    }
};

const getStatusIcon = (status) => {
    const base = "h-5 w-5";
    switch (status) {
        case "pending": return <ClockIcon className={`${base} text-yellow-500`} />;
        case "processing": return <CheckCircleIcon className={`${base} text-blue-500`} />;
        case "shipped": return <TruckIcon className={`${base} text-purple-500`} />;
        case "delivered": return <HomeIcon className={`${base} text-green-500`} />;
        case "cancelled": return <XCircleIcon className={`${base} text-red-500`} />;
        case "returned": return <ArrowUturnLeftIcon className={`${base} text-orange-500`} />;
        default: return <ClockIcon className={`${base} text-gray-500`} />;
    }
};

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [expanded, setExpanded] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get("/api/orders");
                setOrders(res.data);
                setFilteredOrders(res.data);
            } catch {
                setError("Unable to load orders.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    useEffect(() => {
        setFilteredOrders(
            activeTab === "all"
                ? orders
                : orders.filter((o) => o.status === activeTab)
        );
    }, [activeTab, orders]);

    const handleCancel = async () => {
        if (!orderToCancel) return;
        try {
            await axios.put(`/api/admin/orders/${orderToCancel.id}/status`, {
                status: "cancelled",
            });

            setOrders((prev) =>
                prev.map((o) =>
                    o.id === orderToCancel.id ? { ...o, status: "cancelled" } : o
                )
            );

            toast.success("Order cancelled.");
        } catch {
            toast.error("Failed to cancel order.");
            console.log(error);
        } finally {
            setShowModal(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-500">
                Loading orders…
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 font-[system-ui]">
            <ToastContainer />

            {/* ------------------------------
                HEADER (Back button on right)
            ------------------------------- */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-semibold tracking-tight">
                    Your Orders
                </h1>

                <Link
                    to="/customer/profile"
                    className="px-5 py-2.5 bg-black text-white rounded-2xl shadow-sm hover:bg-gray-900 transition whitespace-nowrap"
                >
                    ← Back to Profile
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b pb-3 mb-8 text-gray-600 text-sm overflow-x-auto">
                {["all", "pending", "processing", "shipped", "delivered", "cancelled", "returned"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 capitalize ${activeTab === tab
                            ? "border-b-2 border-black text-black font-medium"
                            : "text-gray-500 hover:text-black"
                            }`}
                    >
                        {tab} ({orders.filter((o) => tab === "all" || o.status === tab).length})
                    </button>
                ))}
            </div>

            {/* Empty */}
            {filteredOrders.length === 0 && (
                <div className="text-center py-20 bg-white border border-gray-200 rounded-3xl">
                    <ShoppingCartIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg text-gray-600">No orders found</p>
                    <Link
                        to="/customer"
                        className="inline-block mt-6 bg-black text-white px-8 py-3 rounded-2xl"
                    >
                        Shop Products
                    </Link>
                </div>
            )}

            {/* Orders list */}
            <div className="space-y-6">
                {filteredOrders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm"
                    >
                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-gray-800 font-medium">Order #{order.id}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`text-sm ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>

                                {order.status === "pending" && (
                                    <button
                                        onClick={() => {
                                            setOrderToCancel(order);
                                            setShowModal(true);
                                        }}
                                        className="text-red-600 hover:text-red-700 text-sm"
                                    >
                                        Cancel
                                    </button>
                                )}

                                <button
                                    onClick={() =>
                                        setExpanded(expanded === order.id ? null : order.id)
                                    }
                                    className="p-1 text-gray-600 hover:text-black"
                                >
                                    {expanded === order.id ? (
                                        <ChevronUpIcon className="h-5 w-5" />
                                    ) : (
                                        <ChevronDownIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* ITEMS */}
                        <div className="divide-y divide-gray-200">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center py-4 gap-4"
                                >
                                    <img
                                        src={item.image_url}
                                        className="w-16 h-16 rounded-xl object-cover border"
                                    />
                                    <div className="flex-1">
                                        <p className="text-gray-800 font-medium">
                                            {item.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-medium">
                                        ₹{(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* FOOTER */}
                        <div className="mt-4 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                {getStatusIcon(order.status)}
                                <span>
                                    {order.status === "pending" && "Processing soon"}
                                    {order.status === "processing" && "Being packed"}
                                    {order.status === "shipped" && "On the way"}
                                    {order.status === "delivered" && "Delivered"}
                                    {order.status === "cancelled" && "Cancelled"}
                                    {order.status === "returned" && "Returned"}
                                </span>
                            </div>

                            <div className="text-right">
                                <p className="text-sm text-gray-500">
                                    Subtotal: ₹{order.subtotal}
                                </p>
                                {order.discount > 0 && (
                                    <p className="text-sm text-green-600">
                                        Discount: -₹{order.discount}
                                    </p>
                                )}
                                <p className="text-lg font-semibold">
                                    Total: ₹{order.total}
                                </p>
                            </div>
                        </div>

                        {/* EXPANDED INFO */}
                        {expanded === order.id && (
                            <div className="mt-6 border-t pt-4 text-sm text-gray-600">
                                <p><strong>Address:</strong> {order.shipping_address}</p>
                                <p className="mt-2"><strong>Payment:</strong> {order.payment_method}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* CANCEL MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center border border-gray-200">
                        <XCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Cancel Order?</h2>
                        <p className="text-gray-600 mb-6">
                            This action cannot be undone.
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={handleCancel}
                                className="flex-1 bg-red-600 text-white py-2 rounded-2xl"
                            >
                                Yes, Cancel
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 border border-gray-300 py-2 rounded-2xl"
                            >
                                No, Go Back
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
