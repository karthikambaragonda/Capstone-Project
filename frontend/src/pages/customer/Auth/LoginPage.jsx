import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login, setLoginPopup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            setLoginPopup(true);

            setTimeout(() => {
                setLoginPopup(false);
                navigate('/', { replace: true });
            }, 1800);
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4">

            {/* 🍏 macOS Notification Popup */}
            <MacPopup />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="
                    w-full max-w-md 
                    bg-white/60 backdrop-blur-2xl 
                    border border-white/40 shadow-lg
                    rounded-3xl p-10
                "
            >
                <h2 className="text-3xl font-semibold text-center tracking-tight mb-6 text-black"
                    style={{  }}>
                    Sign in to ShopNest
                </h2>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="
                                w-full px-4 py-3 rounded-xl 
                                border border-gray-300 
                                bg-white/80 backdrop-blur-md
                                outline-none focus:ring-2 focus:ring-black 
                                transition text-sm
                            "
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="
                                w-full px-4 py-3 rounded-xl 
                                border border-gray-300 
                                bg-white/80 backdrop-blur-md
                                outline-none focus:ring-2 focus:ring-black 
                                transition text-sm
                            "
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full bg-black text-white py-3 rounded-xl 
                            hover:bg-neutral-900 transition 
                            font-medium text-sm shadow-sm active:scale-[.98]
                        "
                    >
                        {loading ? "Signing in…" : "Sign In"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>
                        Don’t have an account?{" "}
                        <Link
                            to="/customer/register"
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Register
                        </Link>
                    </p>
                    <p className="mt-3">
                        <Link
                            to="/admin"
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Continue as Admin →
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}



/* 🍏 -------- macOS Popup Component -------- */
function MacPopup() {
    const { loginPopup } = useAuth();

    return (
        <AnimatePresence>
            {loginPopup && (
                <motion.div
                    initial={{ opacity: 0, x: 70, y: -10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: 70, y: -10 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="
                        fixed top-4 right-4 z-[9999]
                        w-[330px]
                        rounded-2xl
                        bg-white/40 backdrop-blur-2xl 
                        border border-white/50 shadow-xl
                        flex items-start gap-3 p-4
                    "
                >
                    {/* ✔ Apple Green Icon */}
                    <div
                        className="
                            h-10 w-10 rounded-xl 
                            bg-green-500/90 flex items-center justify-center 
                            shadow-md
                        "
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>

                    {/* Text */}
                    <div className="flex flex-col">
                        <span className="font-semibold text-black text-[15px]">
                            Login Successful
                        </span>

                        <span className="text-gray-700 text-sm">
                            Welcome back to ShopNest
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
