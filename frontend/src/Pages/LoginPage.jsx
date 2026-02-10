import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState("");

    // Static Submit Handlers
    const handleEmailLogin = (e) => {
        e.preventDefault();
        // Do nothing for now
        console.log("Login submitted statically");
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        // Do nothing for now
        console.log("Password reset submitted statically");
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                <div className="p-8 md:p-12">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <Link to="/" className="inline-flex items-center gap-2 mb-6">
                            
                        </Link>
                        <h2 className="text-3xl font-black text-slate-900 mb-2">
                            {showForgotPassword ? "Reset Password" : "Welcome Back"}
                        </h2>
                        <p className="text-slate-500 font-medium">
                            {showForgotPassword ? "Enter your email to receive instructions" : "Securely manage your product protection"}
                        </p>
                    </div>

                    {!showForgotPassword ? (
                        <>
                            {/* Static Google Login Button */}
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all mb-8"
                            >
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="google" />
                                Continue with Google
                            </button>

                            <div className="relative mb-8 text-center">
                                <hr className="border-slate-100" />
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Or with email</span>
                            </div>

                            {/* Login Form */}
                            <form onSubmit={handleEmailLogin} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address <span className="text-red-500">*</span></label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 focus:border-emerald-600 transition-all outline-none font-medium text-slate-600"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2 ml-1">
                                        <label className="text-sm font-bold text-slate-700">Password <span className="text-red-500">*</span></label>
                                        <button
                                            type="button"
                                            onClick={() => setShowForgotPassword(true)}
                                            className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 focus:border-emerald-600 transition-all outline-none font-medium text-slate-600"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-100 active:scale-95 flex items-center justify-center gap-2 mt-4"
                                >
                                    Sign In <ArrowRight size={18} />
                                </button>
                            </form>
                        </>
                    ) : (
                        /* Forgot Password View */
                        <form onSubmit={handleForgotPassword} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 focus:border-emerald-600 transition-all outline-none font-medium text-slate-600"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(false)}
                                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-100 transition-all"
                                >
                                    Send Reset Link
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Bottom Link */}
                    <div className="mt-10 text-center">
                        <p className="text-sm font-medium text-slate-500">
                            Don't have an account?{" "}
                            <Link to="/registration" className="text-emerald-600 font-bold hover:underline">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;