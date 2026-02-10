import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, User, Mail, Camera, ArrowRight } from 'lucide-react';
import useAuth from '../Hooks/useAuth';
import useAxios from '../Hooks/useAxios';
import { uploadImageToImgBB } from '../Utils/UploadImage';
import { queueSuccessToast } from '../Utils/alerts';
import { getAuthErrorMessage } from '../Utils/authErrorMessages';

const Registration = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { registerUserWithEmailPassword, updateUserProfile, loginWithGoogle } = useAuth();
    const axiosSecure = useAxios();
    const navigate = useNavigate();

    const syncUserToBackend = async ({ name, email, photoURL }) => {
        try {
            console.log('🔄 Syncing user to backend...', { name, email });
            const response = await axiosSecure.post('/api/users', {
                name,
                email,
                photoURL: photoURL || '',
            });
            console.log('✅ User synced to backend successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Failed to sync user to backend:', error);
            console.error('Error details:', error.response?.data || error.message);
            // Don't throw - allow registration to complete even if backend sync fails
            // The user is still registered in Firebase, just not in our DB yet
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!fullName || !email || !password) {
            const message = 'Please fill in all required fields.';
            setError(message);
            return;
        }

        if (!photoFile) {
            const message = 'Please upload a profile photo.';
            setError(message);
            return;
        }

        try {
            setLoading(true);

            // 1) Upload image to ImgBB
            const photoURL = await uploadImageToImgBB(photoFile);

            // 2) Create Firebase user
            const result = await registerUserWithEmailPassword(email, password);
            const fbUser = result.user;

            // 3) Update Firebase profile with name and photo URL
            await updateUserProfile({
                displayName: fullName,
                photoURL,
            });

            // 4) Sync to backend users collection
            await syncUserToBackend({
                name: fullName,
                email,
                photoURL,
            });

            // Queue toast to show after redirect on dashboard
            queueSuccessToast(
                'Account created',
                'Welcome to WarrantyWallet! Your account is ready.'
            );

            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            const message = getAuthErrorMessage(err, 'creating your account');
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setError('');
        try {
            setLoading(true);
            const result = await loginWithGoogle();
            const fbUser = result.user;

            await syncUserToBackend({
                name: fbUser.displayName || 'Google User',
                email: fbUser.email,
                photoURL: fbUser.photoURL || '',
            });

            // Queue toast to show after redirect on dashboard
            queueSuccessToast(
                'Signed up with Google',
                'Your account is ready. Welcome to WarrantyWallet!'
            );

            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            const message = getAuthErrorMessage(err, 'signing up with Google');
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 py-12 md:py-20">
            <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                <div className="p-8 md:p-12">

                    {/* Header */}
                    <div className="text-center mb-10">
                        
                        <h2 className="text-3xl font-black text-slate-900 mb-2">Create Account</h2>
                        <p className="text-slate-500 font-medium">Join thousands managing warranties smarter</p>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleRegister} className="space-y-5">

                        {/* Profile Image Upload with Preview */}
                        <div className="flex flex-col items-center justify-center mb-8">
                            <div className="relative group">
                                <div className="w-24 h-24 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden transition-all group-hover:border-emerald-500 group-hover:bg-emerald-50">
                                    {photoPreview ? (
                                        <img
                                            src={photoPreview}
                                            alt="Profile preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Camera className="w-8 h-8 text-slate-400 group-hover:text-emerald-500" />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setPhotoFile(file);
                                                const previewUrl = URL.createObjectURL(file);
                                                setPhotoPreview(previewUrl);
                                            }
                                        }}
                                    />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-emerald-600 p-1.5 rounded-lg border-4 border-white shadow-lg">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-3">
                                {photoFile ? 'Preview loaded' : 'Upload Profile Photo'}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Full Name */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Name <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full px-5 py-3.5 pl-12 rounded-2xl border-2 border-slate-100 focus:border-emerald-600 transition-all outline-none font-medium text-slate-600"
                                    />
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                </div>
                            </div>

                            {/* Email Address */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="john@example.com"
                                        className="w-full px-5 py-3.5 pl-12 rounded-2xl border-2 border-slate-100 focus:border-emerald-600 transition-all outline-none font-medium text-slate-600"
                                    />
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password <span className="text-red-500">*</span></label>
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
                                <p className="text-[10px] text-slate-400 mt-2 ml-1">Must be at least 6 characters long</p>
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 font-medium text-center mt-2">
                                {error}
                            </p>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-100 active:scale-95 flex items-center justify-center gap-2"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={18} />
                            </button>
                        </div>
                    </form>

                    {/* Social Registration */}
                    <div className="relative my-10 text-center">
                        <hr className="border-slate-100" />
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Or Sign up with</span>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleSignUp}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-70 transition-all"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="google" />
                        Sign up with Google
                    </button>

                    {/* Bottom Link */}
                    <div className="mt-10 text-center">
                        <p className="text-sm font-medium text-slate-500">
                            Already have an account?{" "}
                            <Link to="/login" className="text-emerald-600 font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;