// src/pages/customer/RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
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
                navigate('/customer');
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

            {/* Apple-style card */}
            <div className="
                w-full max-w-md
                bg-white/80 backdrop-blur-xl
                border border-gray-200
                rounded-3xl shadow-lg
                p-8 
                transition-all
            ">
                {/* Header */}
                <h2 className="text-3xl font-semibold text-center text-gray-900">
                    Create Your Account
                </h2>
                <p className="text-center text-gray-500 mt-1 text-sm">
                    Start your journey with ShopNest ✨
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
                                transition
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
                                transition
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
                                transition
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
                                transition
                            "
                            placeholder="Re-enter your password"
                        />
                    </div>

                    {/* Submit Button */}
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

                {/* Footer link */}
                <p className="text-center text-gray-600 mt-6 text-sm">
                    Already a member?{" "}
                    <Link
                        to="/customer/login"
                        className="text-black font-medium hover:underline"
                    >
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
    );
}
