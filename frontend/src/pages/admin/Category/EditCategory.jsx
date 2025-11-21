import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import api from '../../../utils/axios';

export default function EditCategory() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await api.get(`/api/categories/${id}`);
                setCategory(res.data[0]);
            } catch {
                setError("Unable to load category. Please check the ID.");
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [id]);

    const handleChange = (e) => {
        setCategory(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/admin/categories/${id}`, {
                name: category.name,
                description: category.description
            });
            navigate("/admin/categories");
        } catch {
            setError("Failed to update category. Try again.");
        }
    };

    // Loading Screen
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#f5f5f7]">
                <div className="animate-spin text-gray-700">
                    <ArrowPathIcon className="h-12 w-12" />
                </div>
            </div>
        );
    }

    // Error Screen
    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#f5f5f7]">
                <div className="bg-red-50 border border-red-200 px-8 py-6 rounded-3xl shadow-lg text-red-700 max-w-md">
                    <h2 className="font-semibold text-lg mb-2">Error</h2>
                    <p>{error}</p>

                    <button
                        onClick={() => navigate("/admin/categories")}
                        className="mt-4 px-6 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // No category found
    if (!category) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#f5f5f7]">
                <div className="bg-white px-8 py-6 rounded-3xl shadow-md">
                    <p className="text-gray-600 text-lg">No category found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f5f7] flex justify-center py-20 px-4">

            <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-3xl shadow-xl p-10">

                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                        Edit Category
                    </h1>

                    <button
                        onClick={() => navigate("/admin/categories")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        Back
                    </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleUpdate} className="space-y-8">

                    {/* Category Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={category.name || ""}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-black outline-none transition"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            rows="4"
                            value={category.description || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-black outline-none transition"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/categories")}
                            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-6 py-3 rounded-xl bg-black text-white font-medium shadow hover:bg-gray-900 transition"
                        >
                            Save Changes
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
