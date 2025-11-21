import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function AdminLogin() {
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

        if (result.success && result.user?.role === 'admin') {
            navigate('/admin', { replace: true });
        } else {
            setError(result.message || 'You do not have admin privileges');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

            {/* Apple frosted glass card */}
            <div className="
                w-full max-w-md 
                bg-white/80 backdrop-blur-xl
                border border-gray-200
                rounded-3xl shadow-xl
                p-10
            ">
                {/* Title */}
                <h2 className="text-3xl font-semibold text-center text-gray-900">
                    Admin Login
                </h2>
                <p className="text-center text-gray-500 mt-1 text-sm">
                    Secure access for authorized administrators
                </p>

                {/* Error Box */}
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

                {/* Form */}
                <form className="space-y-5 mt-6" onSubmit={handleSubmit}>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin123"
                            className="
                                w-full px-4 py-3
                                border border-gray-300 
                                rounded-xl bg-gray-50
                                focus:outline-none focus:ring-2 focus:ring-black
                                transition
                            "
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="
                                w-full px-4 py-3
                                border border-gray-300 
                                rounded-xl bg-gray-50
                                focus:outline-none focus:ring-2 focus:ring-black
                                transition
                            "
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full bg-black text-white
                            py-3 rounded-xl
                            font-medium
                            hover:bg-gray-900
                            transition disabled:opacity-50
                        "
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    Not an admin?{' '}
                    <Link to="/customer/login"
                        className="text-black font-medium hover:underline"
                    >
                        Go to Customer Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
