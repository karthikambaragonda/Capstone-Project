import { useState, useEffect } from 'react';
import api from '../../../utils/axios';
import {
    TrashIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/api/admin/orders');
                setOrders(res.data);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
                setError('Failed to fetch orders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
        } catch {
            setError("Couldn't update order. Try again.");
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("Delete this order permanently?")) return;

        try {
            await api.delete(`/api/orders/${orderId}`);
            setOrders(orders.filter(o => o.id !== orderId));
        } catch {
            setError("Failed to delete order.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                >
                    <ArrowPathIcon className="h-10 w-10 text-gray-600" />
                </motion.div>
                <p className="ml-4 text-lg text-gray-600">Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="p-8 min-h-screen">

            {/* Apple-style page title */}
            <h1 className="text-4xl font-semibold text-gray-900 mb-8 tracking-tight">
                Orders Management
            </h1>

            {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-6">
                    {error}
                </div>
            )}

            {/* Glass Card Wrapper */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-xl bg-white/70 border border-gray-200/70 shadow-xl rounded-3xl overflow-hidden"
            >
                <div className="overflow-x-auto rounded-3xl">
                    <table className="min-w-full text-left">

                        {/* Table Header */}
                        <thead className="bg-gray-50/80 backdrop-blur-xl">
                            <tr>
                                {["Order ID", "Customer", "Amount", "Status", "Date", "Actions"].map((head, idx) => (
                                    <th
                                        key={idx}
                                        className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                                    >
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-100">
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        whileHover={{ backgroundColor: "#f8f8f8" }}
                                        className="transition-all"
                                    >
                                        <td className="px-6 py-4 text-sm font-mono text-gray-700">
                                            #{order.id}
                                        </td>

                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {order.username}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            ₹{order.total_amount}
                                        </td>

                                        {/* Apple-style Status Dropdown */}
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) =>
                                                    handleStatusChange(order.id, e.target.value)
                                                }
                                                className={`
                                                    px-3 py-1 text-sm rounded-xl border bg-white 
                                                    shadow-sm focus:ring-2 focus:ring-blue-600
                                                    transition
                                                    ${order.status === 'delivered' ? 'text-green-700 bg-green-50' :
                                                        order.status === 'shipped' ? 'text-blue-700 bg-blue-50' :
                                                            order.status === 'processing' ? 'text-yellow-700 bg-yellow-50' :
                                                                order.status === 'cancelled' ? 'text-red-700 bg-red-50' :
                                                                    order.status === 'returned' ? 'text-purple-700 bg-purple-50' :
                                                                        'text-gray-700 bg-gray-50'}
                                                `}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                                <option value="returned">Returned</option>
                                            </select>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>

                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => handleDeleteOrder(order.id)}
                                                className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition"
                                            >
                                                <TrashIcon className="h-5 w-5 text-red-600" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-16 text-gray-500 text-lg"
                                    >
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </motion.div>
        </div>
    );
}
