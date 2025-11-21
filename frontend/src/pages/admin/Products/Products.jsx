import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import api from '../../../utils/axios';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
        image_url: '',
        stock_quantity: ''
    });

    // Search, filter, sort, pagination
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    api.get('/api/admin/products'),
                    api.get('/api/admin/categories')
                ]);
                setProducts(productsRes.data || []);
                setCategories(categoriesRes.data || []);
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        // Reset to page 1 when filters or sort change
        setCurrentPage(1);
    }, [searchQuery, searchCategory, sortOrder]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/api/admin/products/', newProduct);
            setProducts(prev => [...prev, res.data]);
            setNewProduct({
                name: '',
                description: '',
                price: '',
                category_id: '',
                image_url: '',
                stock_quantity: ''
            });
            setError('');
        } catch (err) {
            console.error('Failed to add product:', err);
            setError('Failed to add product. Please check your inputs and try again.');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }
        const prev = [...products];
        setProducts(prev.filter(prod => prod.id !== id));
        try {
            await api.delete(`/api/admin/products/${id}`);
        } catch (err) {
            console.error('Failed to delete product:', err);
            setProducts(prev); // revert
            setError('Failed to delete product. It may be linked to an order.');
        }
    };

    // Filter, sort, and paginate products
    const filteredProducts = products
        .filter(product => {
            const matchesName = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = searchCategory
                ? String(product.category_id) === searchCategory
                : true;
            return matchesName && matchesCategory;
        })
        .sort((a, b) => {
            if (sortOrder === 'asc') return Number(a.price) - Number(b.price);
            if (sortOrder === 'desc') return Number(b.price) - Number(a.price);
            return 0;
        });

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#f5f5f7]">
                <div className="animate-pulse text-lg text-gray-500">Loading products...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f5f7] p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-semibold text-gray-900">Products</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage products, categories and inventory — elegant Apple-style admin.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 rounded-full bg-white border border-gray-200 shadow-sm focus:ring-2 focus:ring-black outline-none w-64"
                            />
                        </div>

                        <select
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)}
                            className="px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm focus:ring-2 focus:ring-black outline-none"
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>

                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm focus:ring-2 focus:ring-black outline-none"
                        >
                            <option value="">Sort by Price</option>
                            <option value="asc">Price: Low to High</option>
                            <option value="desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Two-column Dashboard */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Add Product (card) */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
                        <h2 className="text-2xl font-medium text-gray-900 mb-4">Add Product</h2>
                        <p className="text-sm text-gray-500 mb-6">Quickly add new products to the catalog.</p>

                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newProduct.name}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-black outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={newProduct.price}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-black outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    name="category_id"
                                    value={newProduct.category_id}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-black outline-none"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                                <input
                                    type="number"
                                    name="stock_quantity"
                                    value={newProduct.stock_quantity}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-black outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                <input
                                    type="url"
                                    name="image_url"
                                    value={newProduct.image_url}
                                    onChange={handleInputChange}
                                    placeholder="https://..."
                                    className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-black outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={newProduct.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-black outline-none"
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-2xl shadow hover:bg-gray-900 transition"
                                >
                                    <PlusIcon className="h-4 w-4" />
                                    Add Product
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Info / Quick stats */}
                    <div className="mt-6 bg-white rounded-3xl shadow-lg border border-gray-200 p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Quick Info</h3>
                        <div className="text-sm text-gray-600 space-y-2">
                            <div>Total Products: <span className="font-medium text-gray-900 ml-2">{products.length}</span></div>
                            <div>Categories: <span className="font-medium text-gray-900 ml-2">{categories.length}</span></div>
                            <div>Filtered: <span className="font-medium text-gray-900 ml-2">{filteredProducts.length}</span></div>
                        </div>
                    </div>
                </div>

                {/* Right: Products Table (main area) */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Product List</h2>
                            <div className="text-sm text-gray-500">Showing {indexOfFirstProduct + 1}–{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length}</div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Stock</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-100">
                                    {currentProducts.length > 0 ? (
                                        currentProducts.map(product => {
                                            const category = categories.find(c => String(c.id) === String(product.category_id));
                                            return (
                                                <tr key={product.id} className="hover:bg-gray-50 transition">
                                                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{product.id}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-12 w-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                                                                <img src={product.image_url || '/placeholder.png'} alt={product.name} className="object-contain h-full w-full" />
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                                <div className="text-xs text-gray-500 mt-1 line-clamp-1">{product.description || '—'}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₹{Number(product.price).toFixed(2)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{category ? category.name : 'N/A'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.stock_quantity}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <Link to={`/admin/products/edit/${product.id}`} className="text-blue-600 hover:text-blue-800">
                                                                <PencilIcon className="h-5 w-5" />
                                                            </Link>
                                                            <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-800">
                                                                <TrashIcon className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-10 text-gray-500">
                                                No products found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination (Apple-style pills) */}
                        {filteredProducts.length > productsPerPage && (
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to <span className="font-medium">{Math.min(indexOfLastProduct, filteredProducts.length)}</span> of <span className="font-medium">{filteredProducts.length}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 rounded-full border text-sm font-medium transition ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-100'}`}
                                    >
                                        Previous
                                    </button>

                                    {/* page numbers as pills (show up to 7 for compactness) */}
                                    <div className="flex gap-2">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .slice(Math.max(0, currentPage - 4), Math.min(totalPages, currentPage + 3))
                                            .map(page => (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${currentPage === page ? 'bg-black text-white shadow' : 'bg-white border border-gray-200 hover:bg-gray-100'}`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className={`px-4 py-2 rounded-full border text-sm font-medium transition ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-100'}`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* bottom spacing */}
                    <div className="h-6" />
                </div>
            </div>
        </div>
    );
}
