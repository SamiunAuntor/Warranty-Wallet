import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, LogIn, Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Prevent background scrolling for better UX
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    }, [isOpen]);

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
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">
                            Sign In
                        </Link>
                        <Link to="/register" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md active:scale-95">
                            Get Started
                        </Link>
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
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;