import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useAuth } from "../Firebase/AuthProvider";
import toast from "react-hot-toast";

const Registration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  
  const { registerWithEmail, loginWithGoogle, authLoading } = useAuth();

  // Password validation function
  const validatePassword = (pwd) => {
    const errors = [];
    if (pwd.length < 6) {
      errors.push("Password must be at least 6 characters");
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(pwd)) {
      errors.push("Password must contain at least one number");
    }
    return errors;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setProfileImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
  };

  const handleEmailRegistration = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate name
    if (!name.trim()) {
      newErrors.name = "Full name is required";
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate password
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors[0]; // Show first error
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // If there are errors, set them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});

    const result = await registerWithEmail(email, password, name, profileImage);
    if (result.success) {
      navigate("/dashboard");
    } else {
      // Handle registration errors
      if (result.error) {
        if (result.error.includes("email")) {
          setErrors({ email: result.error });
        } else if (result.error.includes("password")) {
          setErrors({ password: result.error });
        } else {
          setErrors({ general: result.error });
        }
      }
    }
  };

  const handleGoogleRegistration = async () => {
    const result = await loginWithGoogle();
    if (result.success) {
      navigate("/dashboard");
    }
  };

  // Portrait image for registration page - professional business/document management theme
  const registerImage = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=1200&fit=crop&crop=faces";

  return (
    <div className="min-h-screen bg-parrot-green-50">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Left: Image Section - 50% */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          {/* Background Image with Light Blur */}
          <div className="absolute inset-0">
            <img
              src={registerImage}
              alt="Register"
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
                Get Smart Reminders Before Expiry Dates
              </h2>
              <p className="text-xl text-white/90 leading-relaxed">
                Never miss a warranty expiry with intelligent notification system. Get alerts before your warranties expire so you can take action.
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
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto bg-parrot-green-50">
          <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-primary/10">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-600">Start your warranty management journey</p>
            </div>

            <form onSubmit={handleEmailRegistration} className="space-y-5">
              {errors.general && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  required
                  disabled={authLoading}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary transition-all disabled:opacity-50 outline-none ${
                    errors.name ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-primary"
                  }`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  required
                  disabled={authLoading}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary transition-all disabled:opacity-50 outline-none ${
                    errors.email ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-primary"
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: null });
                    }}
                    required
                    disabled={authLoading}
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-2 focus:ring-primary transition-all disabled:opacity-50 outline-none ${
                      errors.password ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-primary"
                    }`}
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
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                    }}
                    required
                    disabled={authLoading}
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-2 focus:ring-primary transition-all disabled:opacity-50 outline-none ${
                      errors.confirmPassword ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-primary"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
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
                {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Profile Image Upload - Optional, at bottom */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Profile Picture
                </label>
                {imagePreview ? (
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">Click to change</p>
                  </div>
                ) : (
                  <label className="flex items-center justify-between w-full h-12 px-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-primary transition-all group">
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span className="text-sm text-gray-500 group-hover:text-gray-700 font-medium">
                        Click to upload or drag and drop
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">PNG, JPG, WEBP</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={authLoading}
                    />
                  </label>
                )}
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
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
                {authLoading ? "Creating Account..." : "Create Account"}
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
              onClick={handleGoogleRegistration}
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
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:text-primary-dark font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Registration;
