import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import api from "../../../utils/axios";

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, categoriesRes] = await Promise.all([
                    api.get(`/api/products/${id}`),
                    api.get("/api/categories"),
                ]);
                setProduct(productRes.data);
                setCategories(categoriesRes.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load product details.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/products/${id}`, product);
            navigate("/admin/products");
        } catch (err) {
            console.error(err);
            setError("Failed to update product.");
        }
    };

    /* ------------------- LOADING ------------------- */
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#f5f5f7]">
                <ArrowPathIcon className="h-10 w-10 animate-spin text-gray-700" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#f5f5f7]">
                <div className="bg-red-50 px-8 py-6 rounded-2xl border border-red-200 text-red-700 shadow-md">
                    {error}
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#f5f5f7]">
                <div className="bg-white px-8 py-6 rounded-2xl shadow-md border">
                    No product found.
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f5f7] p-8 flex justify-center">
            <div className="w-full max-w-4xl">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
                            Edit Product
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Update product details in the Apple-style Pro Dashboard.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/admin/products")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        Back
                    </button>
                </div>

                {/* MAIN CARD */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-10">

                    <h2 className="text-2xl font-medium text-gray-900 mb-6">
                        Update Product Details
                    </h2>

                    {error && (
                        <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-xl mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="space-y-8">

                        {/* ROW 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={product.name || ""}
                                    onChange={handleChange}
                                    className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-black focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    name="category_id"
                                    value={product.category_id || ""}
                                    onChange={handleChange}
                                    className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-black focus:outline-none"
                                >
                                    <option value="">Select category</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* ROW 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Base Price</label>
                                <input
                                    type="number"
                                    name="base_price"
                                    value={product.base_price || ""}
                                    step="0.01"
                                    min="0"
                                    onChange={handleChange}
                                    className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Selling Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={product.price || ""}
                                    step="0.01"
                                    min="0"
                                    onChange={handleChange}
                                    className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                                <input
                                    type="number"
                                    name="stock_quantity"
                                    value={product.stock_quantity || ""}
                                    min="0"
                                    onChange={handleChange}
                                    className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-black"
                                />
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                rows={4}
                                value={product.description || ""}
                                onChange={handleChange}
                                className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-black outline-none"
                            />
                        </div>

                        {/* IMAGE */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image URL</label>
                            <input
                                type="url"
                                name="image_url"
                                value={product.image_url || ""}
                                onChange={handleChange}
                                className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-black outline-none"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-black text-white py-3 rounded-xl text-lg font-medium hover:bg-gray-900 transition shadow-sm"
                            >
                                Save Changes
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
}
