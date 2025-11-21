// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// export default function LoginPage() {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     const { login } = useAuth();
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setLoading(true);

//         try {
//             const result = await login(username, password);
//             if (result.success) {
//                 navigate('/customer');
//             } else {
//                 setError(result.message);
//             }
//         } catch (err) {
//             setError('An error occurred. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
//             <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

//             {error && (
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                     {error}
//                 </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                     <label htmlFor="username" className="block text-gray-700 mb-1">Username</label>
//                     <input
//                         type="text"
//                         id="username"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         required
//                     />
//                 </div>

//                 <div>
//                     <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
//                     <input
//                         type="password"
//                         id="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         required
//                     />
//                 </div>

//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
//                 >
//                     {loading ? 'Logging in...' : 'Login'}
//                 </button>
//             </form>

//             <div className="mt-4 text-center">
//                 <p className="text-gray-600">
//                     Don't have an account?{' '}
//                     <Link to="/customer/register" className="text-blue-600 hover:underline">
//                         Register
//                     </Link>
//                 </p>
//                 <p className="mt-2">
//                     <Link to="/customer" className="text-blue-600 hover:underline">Continue as guest</Link>
//                 </p>
//             </div>
//         </div>
//     );
// }
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(username, password);

        if (result.success) {
            navigate('/customer', { replace: true });
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4">
            {/* Apple-like fade-in card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="
                    w-full max-w-md bg-white/90 backdrop-blur-xl 
                    border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)]
                    rounded-3xl p-10
                "
            >
                {/* Title */}
                <h2
                    className="text-3xl font-semibold text-center tracking-tight mb-6 text-black"
                    style={{ fontFamily: "-apple-system" }}
                >
                    Sign in to ShopNest
                </h2>

                {/* Error Box */}
                {error && (
                    <div className="
                        bg-red-50 border border-red-300 text-red-700 
                        px-4 py-3 rounded-xl mb-4 text-sm
                    ">
                        {error}
                    </div>
                )}

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Email */}
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="
                                w-full px-4 py-3 rounded-xl border border-gray-300 bg-white 
                                outline-none focus:ring-2 focus:ring-black transition text-sm
                            "
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="
                                w-full px-4 py-3 rounded-xl border border-gray-300 bg-white 
                                outline-none focus:ring-2 focus:ring-black transition text-sm
                            "
                            required
                        />
                    </div>

                    {/* Apple-style button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full bg-black text-white py-3 rounded-xl 
                            hover:bg-neutral-900 transition font-medium text-sm
                        "
                    >
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>

                {/* Links */}
                <div className="mt-6 text-center text-sm text-gray-600">

                    <p>
                        Don’t have an account?{' '}
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
