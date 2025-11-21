export default function Footer() {
    return (
        <footer className="bg-[#f5f5f7] border-t border-gray-200 mt-16">
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* Top Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-gray-800">

                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-semibold tracking-tight mb-3 text-gray-900">
                            ShopEasy
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Your one-stop destination for premium products — designed for simplicity.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="/customer" className="text-gray-600 hover:text-black transition">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="/customer/allproducts" className="text-gray-600 hover:text-black transition">
                                    Products
                                </a>
                            </li>
                            <li>
                                <a href="/customer/categories" className="text-gray-600 hover:text-black transition">
                                    Categories
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                            Support
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-600 hover:text-black transition">Contact Us</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-black transition">FAQs</a>
                            </li>
                            <li>
                                <a href="/customer/orders" className="text-gray-600 hover:text-black transition">Returns</a>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                            Connect
                        </h4>
                        <div className="flex space-x-4 text-gray-600">
                            <a href="#" className="hover:text-black transition">Facebook</a>
                            <a href="#" className="hover:text-black transition">Twitter</a>
                            <a href="#" className="hover:text-black transition">Instagram</a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 border-t border-gray-300 pt-6 text-center text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} ShopEasy. Built with elegance.</p>
                </div>
            </div>
        </footer>
    );
}
