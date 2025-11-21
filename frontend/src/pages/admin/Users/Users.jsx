import { useState, useEffect } from "react";
import { TrashIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import api from "../../../utils/axios";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch Users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/api/admin/users");
                setUsers(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch users. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Change Role
    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/api/admin/users/${userId}/role`, { role: newRole });
            setUsers((prev) =>
                prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
            );
            setError("");
        } catch (err) {
            console.error(err);
            setError("You cannot change your own role.");
        }
    };

    // Delete User
    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        const prev = [...users];
        setUsers(prev.filter((u) => u.id !== id));

        try {
            await api.delete(`/api/admin/users/${id}`);
        } catch (err) {
            console.error(err);
            setError("Failed to delete user. They might have active orders.");
            setUsers(prev); // rollback
        }
    };

    /* ------------------------------ LOADING ------------------------------ */
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#f5f5f7]">
                <ArrowPathIcon className="h-10 w-10 animate-spin text-gray-700" />
                <p className="ml-3 text-gray-600 text-lg">Loading users…</p>
            </div>
        );
    }

    return (
        <div className="p-10 bg-[#f5f5f7] min-h-screen">
            {/* PAGE HEADER */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
                        Users Dashboard
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage roles, users, and access — Apple Pro Dashboard UI
                    </p>
                </div>
            </div>

            {/* ERROR */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6 shadow-sm">
                    {error}
                </div>
            )}

            {/* USERS TABLE CARD */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Username
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Joined
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-gray-500 font-mono">{user.id}</td>

                                        <td className="px-6 py-4 text-gray-900 font-medium">
                                            {user.username}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>

                                        <td className="px-6 py-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) =>
                                                    handleRoleChange(user.id, e.target.value)
                                                }
                                                className="bg-white border border-gray-300 rounded-xl px-3 py-1 shadow-sm focus:ring-2 focus:ring-black outline-none"
                                            >
                                                <option value="customer">Customer</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>

                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-10 text-gray-500 text-lg"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
