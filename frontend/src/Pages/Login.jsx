import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useAuth } from "../Firebase/AuthProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const navigate = useNavigate();
  
  const { loginWithEmail, loginWithGoogle, resetPassword, authLoading } = useAuth();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const result = await loginWithEmail(email, password);
    if (result.success) {
      navigate("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();
    if (result.success) {
      navigate("/dashboard");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const result = await resetPassword(resetEmail);
    if (result.success) {
      setShowForgotPassword(false);
      setResetEmail("");
    }
  };

  // Portrait image for login page - professional business/document management theme
  const loginImage = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=1200&fit=crop&crop=faces";

  return (
    <div className="min-h-screen bg-parrot-green-50">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Left: Image Section - 50% */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          {/* Background Image with Light Blur */}
          <div className="absolute inset-0">
            <img
              src={loginImage}
              alt="Login"
              className="w-full h-full object-cover"
              style={{ filter: 'blur(4px)' }}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=1200&fit=crop&crop=faces";
              }}
            />
            {/* Subtle dark overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40"></div>
          </div>
          
          {/* Content Overlay */}
          <div className="relative z-10 flex items-start justify-start p-12 w-full pt-16 pl-12">
            <div className="max-w-md space-y-6 text-white">
              <h2 className="text-5xl font-bold mb-4 leading-tight">
                Store All Your Warranty Documents Securely
              </h2>
              <p className="text-xl text-white/90 leading-relaxed">
                Upload and organize all your warranty documents, receipts, and invoices in one secure place. Never lose important paperwork again.
              </p>
              
              {/* Core Features */}
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-white mt-2 flex-shrink-0"></div>
                  <p className="text-lg text-white/90">Secure document storage with bank-level encryption</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-white mt-2 flex-shrink-0"></div>
                  <p className="text-lg text-white/90">Smart expiry reminders to never miss a warranty</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-white mt-2 flex-shrink-0"></div>
                  <p className="text-lg text-white/90">Organize and manage all warranties in one place</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form Section - 50% */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-parrot-green-50">
          <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-primary/10">
            {!showForgotPassword ? (
              <>
                <div className="text-center lg:text-left">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">Login</h1>
                  <p className="text-gray-600">Access your warranty dashboard</p>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={authLoading}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        disabled={authLoading}
                        className="text-sm text-primary hover:text-primary-dark font-medium disabled:opacity-50"
                      >
                        Forgot Password
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={authLoading}
                        className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.367 5.19m-6.703-3.824a3 3 0 01-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: authLoading ? '#9CA3AF' : '#50C878',
                      color: '#FFFFFF'
                    }}
                    onMouseEnter={(e) => {
                      if (!authLoading) {
                        e.target.style.backgroundColor = '#3FA563';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!authLoading) {
                        e.target.style.backgroundColor = '#50C878';
                      }
                    }}
                  >
                    {authLoading ? "Logging in..." : "Login"}
                  </button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                <button
                  onClick={handleGoogleLogin}
                  disabled={authLoading}
                  className="w-full bg-white border border-gray-300 hover:border-gray-400 text-gray-700 py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <p className="text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/registration" className="text-primary hover:text-primary-dark font-semibold">
                    Sign up
                  </Link>
                </p>
              </>
            ) : (
              <div className="space-y-5">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h3>
                  <p className="text-gray-600">Enter your email to receive reset instructions</p>
                </div>
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      disabled={authLoading}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all disabled:opacity-50"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetEmail("");
                      }}
                      disabled={authLoading}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="flex-1 bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
                      style={{ 
                        backgroundColor: authLoading ? '#9CA3AF' : '#50C878',
                        color: '#FFFFFF'
                      }}
                      onMouseEnter={(e) => {
                        if (!authLoading) {
                          e.target.style.backgroundColor = '#3FA563';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!authLoading) {
                          e.target.style.backgroundColor = '#50C878';
                        }
                      }}
                    >
                      {authLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
