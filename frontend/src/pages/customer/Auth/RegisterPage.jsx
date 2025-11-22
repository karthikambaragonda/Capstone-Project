// src/pages/customer/RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false); // ⭐ added popup state

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            setLoading(true);
            const result = await register(
                formData.username,
                formData.email,
                formData.password
            );

            if (result.success) {
                // ⭐ SHOW POPUP
                setShowSuccess(true);

                // ⭐ WAIT for animation then redirect
                setTimeout(() => {
                    setShowSuccess(false);
                    navigate('/customer', { replace: true });
                }, 1800);

            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

            {/* 🍏 macOS Notification Popup */}
            <MacPopup showSuccess={showSuccess} />

            {/* Apple-style Card */}
            <div className="
                w-full max-w-md
                bg-white/80 backdrop-blur-xl
                border border-gray-200
                rounded-3xl shadow-lg
                p-8 
            ">
                <h2 className="text-3xl font-semibold text-center text-gray-900">
                    Create Your Account
                </h2>
                <p className="text-center text-gray-500 mt-1 text-sm">
                    Start your journey with ShopNest ✨
                </p>

                {error && (
                    <div className="
                        bg-red-50 text-red-700 
                        border border-red-200 
                        px-4 py-3 rounded-2xl 
                        mt-5 text-sm
                    ">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            className="
                                w-full px-4 py-3 rounded-xl
                                border border-gray-300 bg-gray-50
                                focus:outline-none focus:ring-2 focus:ring-black
                            "
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="
                                w-full px-4 py-3 rounded-xl
                                border border-gray-300 bg-gray-50
                                focus:outline-none focus:ring-2 focus:ring-black
                            "
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            minLength="6"
                            className="
                                w-full px-4 py-3 rounded-xl
                                border border-gray-300 bg-gray-50
                                focus:outline-none focus:ring-2 focus:ring-black
                            "
                            placeholder="Choose a strong password"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            className="
                                w-full px-4 py-3 rounded-xl
                                border border-gray-300 bg-gray-50
                                focus:outline-none focus:ring-2 focus:ring-black
                            "
                            placeholder="Re-enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full bg-black text-white
                            py-3 rounded-xl
                            font-medium
                            hover:bg-gray-900
                            transition
                            disabled:opacity-50
                        "
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-6 text-sm">
                    Already a member?{" "}
                    <Link to="/customer/login" className="text-black font-medium hover:underline">
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
    );
}


/* 🍏 Shared Apple Popup Component */
function MacPopup({ showSuccess }) {
    return (
        <AnimatePresence>
            {showSuccess && (
                <motion.div
                    initial={{ opacity: 0, x: 80, y: -10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: 80, y: -10 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="
                        fixed top-4 right-4 z-[9999]
                        w-[320px]
                        rounded-2xl
                        shadow-[0_8px_25px_rgba(0,0,0,0.20)]
                        bg-white/40 
                        backdrop-blur-2xl 
                        border border-white/40
                        flex items-start gap-3 p-4
                    "
                >
                    {/* ✔ Apple-style green tick */}
                    <div className="
                        h-10 w-10 rounded-xl 
                        bg-green-500/90 
                        flex items-center justify-center shadow-md
                    ">
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-6 w-6 text-white'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                            strokeWidth={2}
                        >
                            <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                        </svg>
                    </div>

                    {/* Text */}
                    <div className="flex flex-col">
                        <span className="font-semibold text-black text-[15px]">
                            Registration Successful
                        </span>
                        <span className="text-gray-700 text-sm">
                            Welcome to ShopNest!
                        </span>
                        <span className="text-gray-500 text-xs mt-1">
                            Redirecting…
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
