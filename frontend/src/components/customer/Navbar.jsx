import { Link } from 'react-router-dom';
import {
    ShoppingCartIcon,
    HeartIcon,
    Bars3Icon,
    XMarkIcon,
    MagnifyingGlassIcon,
    UserCircleIcon,
    TrophyIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Fuse from 'fuse.js';

export default function AppleNavbar({ user, onLogout }) {
    const [cartCount, setCartCount] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [allItems, setAllItems] = useState([]);

    const fuse = new Fuse(allItems, {
        keys: [
            { name: 'name', weight: 0.7 },
            { name: 'category', weight: 0.3 }
        ],
        threshold: 0.4,
        includeScore: true,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    axios.get('/api/productss'),
                    axios.get('/api/categories')
                ]);

                const products = productsRes.data.map(p => ({
                    ...p,
                    type: 'product',
                    category: p.category_name || ''
                }));

                const categories = categoriesRes.data.map(c => ({
                    id: `cat-${c.id}`,
                    name: c.name,
                    type: 'category'
                }));

                setAllItems([...products, ...categories]);
            } catch (err) {
                console.error('Error fetching products or categories:', err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (user) {
            const fetchCartCount = () => {
                axios.get('/api/cart/count', { withCredentials: true })
                    .then(res => setCartCount(res.data.count))
                    .catch(err => console.error('Error fetching cart count:', err));
            };

            fetchCartCount();
            const intervalId = setInterval(fetchCartCount, 50000);
            return () => clearInterval(intervalId);
        }
    }, [user]);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchTerm(query);

        if (!query.trim()) return setSearchResults([]);

        const results = fuse.search(query).map(result => result.item);
        setSearchResults(results);
    };

    const renderSearchResults = () => (
        <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-72 overflow-y-auto z-50">
            {searchResults.length === 0 ? (
                <li className="px-4 py-3 text-gray-500">No results found</li>
            ) : (
                searchResults.map(item => (
                    <li key={item.id}>
                        <Link
                            to={
                                item.type === 'product'
                                    ? `/customer/products/${item.id}`
                                    : `/customer/categories/${item.id.replace('cat-', '')}`
                            }
                            onClick={() => {
                                setSearchTerm('');
                                setSearchResults([]);
                                setIsMobileSearchOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                        >
                            {item.type === 'product'
                                ? <ShoppingCartIcon className="h-5 w-5 text-gray-600" />
                                : <Bars3Icon className="h-5 w-5 text-gray-600" />}
                            <span className="truncate">{item.name}</span>
                        </Link>
                    </li>
                ))
            )}
        </ul>
    );

    return (
        <nav className="w-full bg-white border-b border-gray-200 fixed top-0 z-50 backdrop-blur-xl bg-white/80">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

                {/* LEFT: Apple Logo Style Text */}
                <Link to="/customer" className="text-xl font-semibold tracking-tight text-gray-900 hover:opacity-70">
                    ShopNest
                </Link>

                {/* CENTER LINKS (Desktop only) */}
                <div className="hidden md:flex gap-10 text-gray-700 text-sm font-medium">
                    <Link className="hover:text-black transition" to="/customer">Home</Link>
                    <Link className="hover:text-black transition" to="/customer/categories">Categories</Link>
                    <Link className="hover:text-black transition" to="/customer/rewards">Rewards</Link>
                </div>

                {/* RIGHT SECTION */}
                <div className="flex items-center gap-4">

                    {/* Search Icon (Mobile) */}
                    <button onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)} className="md:hidden">
                        <MagnifyingGlassIcon className="h-6 w-6 text-gray-700" />
                    </button>

                    {/* Desktop Search */}
                    <div className="hidden md:block relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search"
                            className="bg-gray-100 rounded-full px-4 py-2 w-120 outline-none focus:ring-2 focus:ring-black transition"
                        />
                        {searchTerm && searchResults.length > 0 && renderSearchResults()}
                    </div>
                    <Link to="/customer/ai">
                        <SparklesIcon className="h-6 w-6 text-gray-700 hover:text-black transition" />
                    </Link>
                    {/* Wishlist */}
                    <Link to="/customer/wishlist">
                        <HeartIcon className="h-6 w-6 text-gray-700 hover:text-black transition" />
                    </Link>

                    {/* Cart */}
                    <Link to="/customer/cart" className="relative">
                        <ShoppingCartIcon className="h-6 w-6 text-gray-700 hover:text-black transition" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* User */}
                    {user ? (
                        <div className="hidden md:flex items-center gap-6">

                            {/* Profile */}
                            <Link
                                to="/customer/profile"
                                className="text-sm font-medium text-gray-800 hover:text-black transition"
                            >
                                Profile
                            </Link>

                            {/* Logout */}
                            <button
                                onClick={onLogout}
                                className="text-sm font-medium text-red-600 hover:text-red-700 transition"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/customer/login" className="hidden md:block text-gray-900 text-sm font-medium">
                            Sign In
                        </Link>
                    )}


                    {/* Mobile burger */}
                    <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? (
                            <XMarkIcon className="h-7 w-7 text-gray-700" />
                        ) : (
                            <Bars3Icon className="h-7 w-7 text-gray-700" />
                        )}
                    </button>
                </div>
            </div>

            {/* MOBILE SEARCH SHEET (Apple Style) */}
            {isMobileSearchOpen && (
                <div className="px-6 pb-4 bg-white border-t border-gray-200 md:hidden">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full bg-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black transition"
                        placeholder="Search products or categories"
                    />
                    {searchTerm && searchResults.length > 0 && renderSearchResults()}
                </div>
            )}

            {/* MOBILE MENU (Apple style sheet) */}
            {isMobileMenuOpen && (
                <div className="md:hidden px-6 py-4 bg-white border-t border-gray-200 text-gray-700 text-base space-y-3">
                    <Link to="/customer" className="block py-2">Home</Link>
                    <Link to="/customer/categories" className="block py-2">Categories</Link>
                    <Link to="/customer/rewards" className="block py-2">Rewards</Link>

                    <div className="border-t border-gray-300 my-2"></div>

                    {user ? (
                        <>
                            <Link to="/customer/profile" className="block py-2">My Profile</Link>
                            <Link to="/customer/orders" className="block py-2">My Orders</Link>
                            <button onClick={onLogout} className="text-red-600 py-2">Logout</button>
                        </>
                    ) : (
                        <Link to="/customer/login" className="py-2">Sign In</Link>
                    )}
                </div>
            )}
        </nav>
    );
}
