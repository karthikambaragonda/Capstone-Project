import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [authState, setAuthState] = useState({
        user: null,
        loading: true,
        initialized: false,
        error: null,
        loginPopup: false   // ⭐ ADDED
    });

    const checkAuth = useCallback(async () => {
        try {
            const res = await api.get('/api/auth/user', {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' },
            });

            setAuthState(prev => ({
                ...prev,
                user: res.data?.user || null,
                loading: false,
                initialized: true,
                error: null
            }));

            return res.data?.user || null;

        } catch (err) {
            setAuthState(prev => ({
                ...prev,
                user: null,
                loading: false,
                initialized: true,
                error:
                    err.response?.status !== 401
                        ? err.response?.data?.message || 'Failed to check authentication'
                        : null
            }));
            return null;
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);


    // ⭐⭐⭐ FINAL FIXED LOGIN FUNCTION
    const login = async (username, password) => {
        try {
            const res = await api.post(
                '/api/auth/login',
                { username, password },
                { withCredentials: true }
            );

            const user = await checkAuth();

            // ⭐ Show popup until redirect
            setAuthState(prev => ({ ...prev, loginPopup: true }));

            return {
                success: true,
                message: res.data?.message || "Login successful",
                user
            };

        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || "Invalid username or password"
            };
        }
    };

    // const register = async (username, email, password) => {
    //     try {
    //         setAuthState(prev => ({ ...prev, loading: true }));

    //         const res = await api.post(
    //             '/api/auth/register',
    //             { username, email, password },
    //             { withCredentials: true }
    //         );

    //         const user = await checkAuth();
    //         return { success: true, user, message: res.data?.message || 'Registration successful' };
    //     } catch (err) {
    //         setAuthState(prev => ({
    //             ...prev,
    //             loading: false,
    //             error: err.response?.data?.message || 'Registration failed'
    //         }));
    //         return { success: false, message: err.response?.data?.message || 'Registration failed' };
    //     }
    // };
    const register = async (username, email, password) => {
        try {
            const res = await api.post(
                '/api/auth/register',
                { username, email, password },
                { withCredentials: true }
            );

            const user = await checkAuth();

            return {
                success: true,
                user,
                message: res.data?.message || "Registration successful"
            };

        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || "Registration failed"
            };
        }
    };

    const logout = async () => {
        try {
            setAuthState(prev => ({ ...prev, loading: true }));

            await api.post('/api/auth/logout', {}, { withCredentials: true });

            setAuthState(prev => ({
                user: null,
                loading: false,
                initialized: true,
                error: null,
                loginPopup: false
            }));

            return { success: true };
        } catch (err) {
            setAuthState(prev => ({
                ...prev,
                loading: false,
                error: err.response?.data?.message || 'Logout failed'
            }));
            return { success: false };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user: authState.user,
                loading: authState.loading,
                initialized: authState.initialized,
                error: authState.error,
                loginPopup: authState.loginPopup, // ⭐ expose popup flag

                login,
                register,
                logout,
                checkAuth,

                setLoginPopup: (value) =>
                    setAuthState(prev => ({ ...prev, loginPopup: value })),
                setUser: (user) =>
                    setAuthState(prev => ({ ...prev, user }))
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
