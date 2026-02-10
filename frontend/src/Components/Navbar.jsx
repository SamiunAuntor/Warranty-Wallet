import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogIn, Menu, X, LogOut, User } from 'lucide-react';
import useAuth from '../Hooks/useAuth';
import { queueSuccessToast, showErrorAlert } from '../Utils/alerts';
import { getAuthErrorMessage } from '../Utils/authErrorMessages';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    // Prevent background scrolling for better UX
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    }, [isOpen]);

    const handleLogout = async () => {
        try {
            await logoutUser();
            queueSuccessToast('Logged out', 'You have been signed out successfully.');
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
            const message = getAuthErrorMessage(error, 'logging you out');
            await showErrorAlert('Logout failed', message);
        }
    };

    const handleAvatarClick = () => {
        navigate('/dashboard');
    };

    return (
        <>
            {/* 1. BLUR OVERLAY: Sits behind the menu but over the page content */}
            <div
                className={`fixed inset-0 bg-white/30 backdrop-blur-xl transition-all duration-300 z-[90] md:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={() => setIsOpen(false)}
            />

            <nav className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-[100]">
                <div className="w-11/12 mx-auto h-16 md:h-20 flex justify-between items-center">

                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center gap-2 z-[110]">
                        
                        <span className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">
                            Warranty<span className="text-emerald-600">Wallet</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <>
                                <button
                                    onClick={handleAvatarClick}
                                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                                >
                                    {user.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt={user.displayName || 'User'}
                                            className="w-10 h-10 rounded-full border-2 border-emerald-600 object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                                            {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-red-600 transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">
                                    Sign In
                                </Link>
                                <Link to="/register" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md active:scale-95">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button - Z-index 110 ensures it stays on top of the menu */}
                    <button
                        className="md:hidden p-2 text-slate-600 z-[110] outline-none"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                    </button>

                    {/* 2. CENTERED MOBILE MENU: Independent of the Navbar white strip */}
                    <div className={`fixed left-0 right-0 top-40 bottom-0 z-[100] flex flex-col items-center justify-center transition-all duration-300 md:hidden ${isOpen ? 'translate-y-0 opacity-100 visible' : 'translate-y-4 opacity-0 invisible'
                        }`}>
                        {/* Internal Menu Container */}
                        <div className="flex flex-col items-center gap-10 w-full max-w-[280px]">
                            {user ? (
                                <>
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            handleAvatarClick();
                                        }}
                                        className="flex items-center gap-3 text-lg font-bold text-slate-600 hover:text-emerald-600 transition-colors"
                                    >
                                        {user.photoURL ? (
                                            <img
                                                src={user.photoURL}
                                                alt={user.displayName || 'User'}
                                                className="w-12 h-12 rounded-full border-2 border-emerald-600 object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                                                {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                        )}
                                        <span>Dashboard</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            handleLogout();
                                        }}
                                        className="w-full text-center bg-red-600 text-white py-4 rounded-full text-lg font-bold shadow-2xl shadow-red-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
                                    >
                                        <LogOut size={20} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        onClick={() => setIsOpen(false)}
                                        to="/login"
                                        className="flex items-center gap-3 text-lg font-bold text-slate-600 hover:text-emerald-600 transition-colors"
                                    >
                                        <LogIn className="w-5 h-5 text-emerald-600" />
                                        Sign In
                                    </Link>

                                    <Link
                                        onClick={() => setIsOpen(false)}
                                        to="/register"
                                        className="w-full text-center bg-emerald-600 text-white py-4 rounded-full text-lg font-bold shadow-2xl shadow-emerald-200 active:scale-95 transition-transform"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;