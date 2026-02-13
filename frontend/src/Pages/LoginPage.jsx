import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import useAuth from '../Hooks/useAuth';
import useAxios from '../Hooks/useAxios';
import { queueSuccessToast } from '../Utils/alerts';
import { getAuthErrorMessage } from '../Utils/authErrorMessages';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { loginUserWithEmailPassword, loginWithGoogle } = useAuth();
    const axiosSecure = useAxios();
    const navigate = useNavigate();

    const syncUserToBackend = async ({ name, email, photoURL }) => {
        try {
            const response = await axiosSecure.post('/api/users', {
                name,
                email,
                photoURL: photoURL || '',
            });
            return response.data;
        } catch (error) {
            console.error('❌ Failed to sync user to backend:', error);
            console.error('Error details:', error.response?.data || error.message);
            // Don't throw - allow login to complete even if backend sync fails
            // But log it so we can debug
            return null;
        }
    };

    const checkUserRole = async (retries = 3) => {
        for (let i = 0; i < retries; i++) {
            try {
                // Wait a bit for backend to process the sync (longer wait on first attempt)
                await new Promise(resolve => setTimeout(resolve, i === 0 ? 1000 : 500));
                const userRes = await axiosSecure.get("/api/users/me");
                const role = userRes.data?.role || "user";
                if (role) {
                    return role;
                }
            } catch (error) {
                console.error(`Error checking user role (attempt ${i + 1}/${retries}):`, error);
                if (i === retries - 1) {
                    // Last attempt failed, default to user
                    return "user";
                }
            }
        }
        return "user"; // Default to user if all attempts fail
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            const message = "Please provide both email and password.";
            setError(message);
            return;
        }

        try {
            setLoading(true);
            const result = await loginUserWithEmailPassword(email, password);
            const fbUser = result.user;

            const syncResult = await syncUserToBackend({
                name: fbUser.displayName || "User",
                email: fbUser.email,
                photoURL: fbUser.photoURL || "",
            });

            // Queue toast to show after redirect on dashboard
            queueSuccessToast(
                'Welcome back',
                'You have successfully signed in.'
            );

            // Check user role and redirect accordingly
            const userRole = await checkUserRole();
            
            if (userRole === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            console.error(err);
            const message = getAuthErrorMessage(err, 'signing you in');
            setError(message);
        } finally {
            setLoading(false);
        }
    };


    const handleGoogleLogin = async () => {
        setError("");
        try {
            setLoading(true);
            const result = await loginWithGoogle();
            const fbUser = result.user;

            const syncResult = await syncUserToBackend({
                name: fbUser.displayName || "Google User",
                email: fbUser.email,
                photoURL: fbUser.photoURL || "",
            });

            // Queue toast to show after redirect on dashboard
            queueSuccessToast(
                'Signed in with Google',
                'You have successfully signed in.'
            );

            // Check user role and redirect accordingly
            const userRole = await checkUserRole();
            
            if (userRole === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            console.error(err);
            const message = getAuthErrorMessage(err, 'signing you in with Google');
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                <div className="p-8 md:p-12">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h2>
                        <p className="text-slate-500 font-medium">
                            Securely manage your product protection
                        </p>
                    </div>

                    {/* Google Login Button */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-70 transition-all mb-8"
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
                                <Link
                                    to="/reset-password"
                                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                                >
                                    Forgot Password?
                                </Link>
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

                        {error && (
                            <p className="text-sm text-red-500 font-medium text-center">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-100 active:scale-95 flex items-center justify-center gap-2 mt-4"
                        >
                            Sign In <ArrowRight size={18} />
                        </button>
                    </form>

                    {/* Bottom Link */}
                    <div className="mt-10 text-center">
                        <p className="text-sm font-medium text-slate-500">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-emerald-600 font-bold hover:underline">
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