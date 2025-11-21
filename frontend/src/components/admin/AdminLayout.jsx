import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import { Bars3Icon } from '@heroicons/react/24/outline';

export default function AdminLayout() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (!loading && user?.role !== 'admin') {
            navigate('/admin/login');
        }
    }, [loading, user, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-pulse flex items-center gap-2 text-gray-500">
                    <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
                    <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
                    <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-100">

            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* MAIN AREA */}
            <div className="flex-1 flex flex-col">

                {/* 🍏 Apple Glass Navbar */}
                <header className="
                    sticky top-0 z-40 
                    backdrop-blur-xl bg-white/80 
                    border-b border-gray-200
                ">
                    <div className="max-w-full mx-auto px-6 py-3 flex justify-between items-center">

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
                        >
                            <Bars3Icon className="h-6 w-6 text-gray-700" />
                        </button>

                        {/* Title */}
                        <h1 className="text-lg md:text-xl font-semibold text-gray-900 tracking-tight">
                            ShopNest Dev Dashboard
                        </h1>

                        {/* Right side (Profile Menu) */}
                        <div className="relative">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="flex items-center gap-3 bg-white/0 hover:bg-gray-100 px-3 py-2 rounded-xl transition"
                            >
                                {/* Admin Avatar */}
                                <img
                                    src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
                                    className="h-9 w-9 rounded-full border border-gray-300"
                                    alt=""
                                />
                            </button>

                            {/* Dropdown */}
                            {menuOpen && (
                                <div
                                    className="
                                        absolute right-0 mt-3 w-48 bg-white/90 backdrop-blur-xl 
                                        border border-gray-200 rounded-2xl shadow-xl p-2
                                        animate-fadeIn
                                    "
                                >
                                    <div className="px-3 py-2 text-xs text-gray-500">
                                        Signed in as
                                        <div className="font-medium text-gray-900 truncate">
                                            {user.username}
                                        </div>
                                    </div>

                                    <button
                                        onClick={logout}
                                        className="
                                            block w-full text-left 
                                            px-3 py-2 text-sm rounded-xl 
                                            text-red-600 hover:bg-red-50 transition
                                        "
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* MAIN CONTENT */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
