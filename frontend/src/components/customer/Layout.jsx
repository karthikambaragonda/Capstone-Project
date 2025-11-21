import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Paths where navbar/footer should NOT appear
    const authPages = [
        "/customer/login",
        "/customer/register",
        "/admin",           // optional
        "/",                // optional landing page
    ];

    const isAuthPage = authPages.includes(location.pathname);

    useEffect(() => {
        if (!loading && !user && !isAuthPage) {
            navigate('/customer/login');
        }
    }, [user, loading, navigate, isAuthPage]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col">

            {/* Show Navbar only if NOT in login/register */}
            {!isAuthPage && <Navbar user={user} onLogout={logout} />}

            <main className={`flex-grow ${!isAuthPage ? "container mx-auto px-4 py-8" : ""}`}>
                <Outlet />
            </main>

            {/* Show Footer only if NOT in login/register */}
            {!isAuthPage && <Footer />}
        </div>
    );
}
