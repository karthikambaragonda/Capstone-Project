import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../../components/customer/ProductCard';
import FilterSidebar from '../../../components/customer/FilterSidebar';
import SkeletonCard from '../../../components/customer/SkeletonCard';
import { FiFilter, FiChevronDown } from 'react-icons/fi';

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Pagination
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Filters
    const [filters, setFilters] = useState({
        category: searchParams.get('categories') ? searchParams.get('categories').split(',') : [],
        price: [],
    });

    const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

    // Fetch categories
    useEffect(() => {
        axios.get('/api/categories/')
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    }, []);

    // Fetch products
    const fetchProducts = async (reset = false) => {
        if (loading) return;

        setLoading(true);

        try {
            const params = {
                sort,
                categories: filters.category.join(','),
                minPrice: filters.price.min,
                maxPrice: filters.price.max,
                page: reset ? 1 : page,
                limit: 12
            };

            const response = await axios.get('/api/products/', { params });

            const fetched = response.data || [];

            if (reset) {
                setProducts(fetched);
                setPage(2);
            } else {
                setProducts(prev => [...prev, ...fetched]);
                setPage(prev => prev + 1);
            }

            setHasMore(fetched.length >= 12);
        } catch (err) {
            console.error("Error loading products:", err);
        } finally {
            setInitialLoading(false);
            setLoading(false);
        }
    };

    // Re-fetch when filters or sort changes
    useEffect(() => {
        setPage(1);
        setHasMore(true);

        setSearchParams({
            sort,
            categories: filters.category.join(','),
            minPrice: filters.price.min || '',
            maxPrice: filters.price.max || ''
        });

        fetchProducts(true);
    }, [filters, sort]);

    const toggleFilters = () => setShowFilters(!showFilters);

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-semibold text-center text-gray-900 mb-10">
                All Products
            </h1>

            {/* Top Controls */}
            <div className="flex justify-between items-center backdrop-blur-xl bg-white/60 rounded-2xl p-4 shadow-sm mb-6 border border-gray-200">
                {/* Filter Button (Mobile) */}
                <button
                    onClick={toggleFilters}
                    className="md:hidden flex items-center space-x-2 text-gray-700 font-medium"
                >
                    <FiFilter className="text-xl" />
                    <span>Filters</span>
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center space-x-2 text-gray-700">
                    <label className="text-sm font-medium">Sort by:</label>
                    <div className="relative">
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="appearance-none bg-white rounded-xl border border-gray-300 px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-black/20"
                        >
                            <option value="newest">Newest</option>
                            <option value="low-to-high">Price: Low → High</option>
                            <option value="high-to-low">Price: High → Low</option>
                            <option value="top-rated">Top Rated</option>
                        </select>
                        <FiChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="flex gap-8">
                {/* Filters Sidebar */}
                <div className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-1/4`}>
                    <FilterSidebar
                        filters={filters}
                        categories={categories}
                        onFilterChange={(f) => setFilters(f)}
                        onClose={() => setShowFilters(false)}
                    />
                </div>

                {/* Products Grid */}
                <div className="flex-1">
                    {initialLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <h3 className="text-2xl mb-2">No products found</h3>
                            <p>Try adjusting filters</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {products.map(p => <ProductCard key={p.id} product={p} />)}
                            </div>

                            {/* Load More Button (Apple Style) */}
                            {hasMore && (
                                <div className="flex justify-center mt-12">
                                    <button
                                        onClick={() => fetchProducts(false)}
                                        disabled={loading}
                                        className={`
                                            px-8 py-3 rounded-2xl font-semibold text-gray-900 bg-white 
                                            shadow-md border border-gray-200 backdrop-blur-xl 
                                            hover:shadow-lg hover:bg-gray-50 transition-all duration-300
                                            ${loading ? "opacity-60 cursor-not-allowed" : ""}
                                        `}
                                    >
                                        {loading ? "Loading…" : "Load More"}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
