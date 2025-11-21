import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import api from '../../../utils/axios';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const perPage = 6;

    const filtered = categories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const start = (currentPage - 1) * perPage;
    const current = filtered.slice(start, start + perPage);
    const totalPages = Math.ceil(filtered.length / perPage);

    useEffect(() => setCurrentPage(1), [searchQuery]);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get('/api/admin/categories');
                setCategories(res.data);
            } catch {
                setError('Failed to fetch categories.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleInputChange = (e) =>
        setNewCategory(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.name.trim()) return setError('Category name is required.');

        try {
            const res = await api.post('/api/admin/categories', newCategory);
            setCategories([...categories, res.data]);
            setNewCategory({ name: '', description: '' });
            setError('');
        } catch {
            setError('Failed to add category.');
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Delete this category?')) return;

        const prev = [...categories];
        setCategories(prev.filter(c => c.id !== id));
        try {
            await api.delete(`/api/admin/categories/${id}`);
        } catch {
            setCategories(prev);
            setError('Failed to delete category.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#f5f5f7]">
                <div className="animate-pulse text-lg text-gray-500">Loading categories…</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f5f7] p-8">

            {/* HEADER */}
            <div className="max-w-7xl mx-auto mb-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
                            Categories
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Organize and manage product categories — Apple Pro dashboard style.
                        </p>
                    </div>

                    <div className="relative w-72">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                        <input
                            type="text"
                            placeholder="Search categories"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-gray-200 shadow-sm focus:ring-2 focus:ring-black outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* TWO COLUMN GRID */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT SIDE */}
                <div className="space-y-6">

                    {/* ADD CATEGORY CARD */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
                        <h2 className="text-2xl font-medium text-gray-900 mb-6">
                            Add Category
                        </h2>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-4 rounded-xl">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleAddCategory} className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newCategory.name}
                                    onChange={handleInputChange}
                                    className="w-full mt-1 px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={newCategory.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full mt-1 px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-900 transition w-full justify-center"
                            >
                                <PlusIcon className="h-5 w-5" />
                                Add Category
                            </button>
                        </form>
                    </div>

                    {/* QUICK INFO CARD */}
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Stats</h3>

                        <div className="space-y-2 text-sm text-gray-600">
                            <p>Total Categories: <span className="font-semibold text-gray-900">{categories.length}</span></p>
                            <p>Being Shown Now: <span className="font-semibold text-gray-900">{filtered.length}</span></p>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE — TABLE */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">

                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900">All Categories</h2>
                            <span className="text-sm text-gray-500">
                                Showing {start + 1}–{Math.min(start + perPage, filtered.length)} of {filtered.length}
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Description</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {current.length ? (
                                        current.map((cat) => (
                                            <tr key={cat.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 text-gray-500 font-mono">{cat.id}</td>
                                                <td className="px-6 py-4 text-gray-900 font-medium">{cat.name}</td>
                                                <td className="px-6 py-4 text-gray-600">{cat.description || "—"}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-4">
                                                        <Link
                                                            to={`/admin/categories/edit/${cat.id}`}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            <PencilIcon className="h-5 w-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteCategory(cat.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center py-10 text-gray-500">
                                                No categories found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        {filtered.length > perPage && (
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">

                                <p className="text-sm text-gray-600">
                                    Showing {start + 1} to {Math.min(start + perPage, filtered.length)} of {filtered.length}
                                </p>

                                <div className="flex gap-2">

                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 rounded-full border text-sm ${currentPage === 1
                                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                : "bg-white hover:bg-gray-100"
                                            }`}
                                    >
                                        Previous
                                    </button>

                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`px-4 py-2 rounded-full border text-sm ${currentPage === i + 1
                                                    ? "bg-black text-white shadow"
                                                    : "bg-white hover:bg-gray-100"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className={`px-4 py-2 rounded-full border text-sm ${currentPage === totalPages
                                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                : "bg-white hover:bg-gray-100"
                                            }`}
                                    >
                                        Next
                                    </button>

                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
