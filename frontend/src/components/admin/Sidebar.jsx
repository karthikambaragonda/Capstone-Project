import { Link, useLocation } from 'react-router-dom';
import {
    ChartBarIcon,
    ShoppingBagIcon,
    TagIcon,
    UsersIcon,
    Cog6ToothIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', href: '/admin/ai', icon: ChartBarIcon },
        { name: 'Products', href: '/admin/products', icon: ShoppingBagIcon },
        { name: 'Categories', href: '/admin/categories', icon: TagIcon },
        { name: 'Users', href: '/admin/users', icon: UsersIcon },
        { name: 'Orders', href: '/admin/orders', icon: Cog6ToothIcon },
        // { name: 'New', href: '/admin/new', icon: Cog6ToothIcon },
        // { name: 'Ai', href: '/admin/ai', icon: Cog6ToothIcon },
    ];

    return (
        <>
            {/* 🍏 MOBILE SIDEBAR — iOS Slide-over */}
            <div
                className={`
                    fixed inset-0 z-50 md:hidden
                    transition-all duration-300
                    ${sidebarOpen ? "visible" : "invisible"}
                `}
            >
                {/* Dim background */}
                <div
                    className={`
                        absolute inset-0 bg-black/40 backdrop-blur-sm 
                        transition-opacity duration-300
                        ${sidebarOpen ? "opacity-100" : "opacity-0"}
                    `}
                    onClick={() => setSidebarOpen(false)}
                />

                {/* Sidebar Panel */}
                <div
                    className={`
                        absolute left-0 top-0 h-full w-64 
                        bg-white/90 backdrop-blur-xl 
                        border-r border-gray-200 
                        shadow-2xl
                        transition-transform duration-300
                        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                        rounded-r-2xl
                    `}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200/60">
                        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Admin Panel</h2>

                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
                        >
                            <XMarkIcon className="h-6 w-6 text-gray-600" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="p-4 space-y-2">
                        {navItems.map((item) => {
                            const active = location.pathname === item.href;

                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-3 py-2 rounded-xl
                                        text-sm font-medium transition
                                        ${active
                                            ? "bg-gray-900 text-white shadow-md"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }
                                    `}
                                >
                                    <item.icon
                                        className={`h-5 w-5 ${active ? "text-white" : "text-gray-500"}`}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* 🍏 DESKTOP SIDEBAR — macOS Glass Panel */}
            <div className="hidden md:flex">
                <div className="
                    w-64 h-screen sticky top-0
                    bg-white/70 backdrop-blur-2xl 
                    border-r border-gray-200
                    shadow-sm
                    flex flex-col
                    rounded-r-2xl
                ">
                    {/* Title */}
                    <div className="h-16 flex items-center px-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                            Admin Panel
                        </h2>
                    </div>

                    {/* Sidebar navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navItems.map((item) => {
                            const active = location.pathname === item.href;

                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`
                                        flex items-center gap-3 px-3 py-2 rounded-xl text-sm 
                                        transition shadow-sm
                                        ${active
                                            ? "bg-gray-900 text-white shadow-md"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }
                                    `}
                                >
                                    <item.icon
                                        className={`h-5 w-5 ${active ? "text-white" : "text-gray-500"}`}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </>
    );
}
