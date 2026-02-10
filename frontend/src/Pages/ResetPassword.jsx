import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import useAuth from '../Hooks/useAuth';
import { showErrorAlert, queueSuccessToast } from '../Utils/alerts';
import { getAuthErrorMessage } from '../Utils/authErrorMessages';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!email) {
            const message = 'Please enter your email address.';
            setError(message);
            await showErrorAlert('Missing information', message);
            return;
        }

        try {
            setLoading(true);
            await resetPassword(email);
            setSuccess(true);

            // Queue toast to show after user navigates back to login
            queueSuccessToast(
                'Reset email sent',
                `If an account exists for ${email}, you will receive a password reset link shortly.`
            );
        } catch (err) {
            console.error(err);
            const message = getAuthErrorMessage(err, 'sending the reset email');
            setError(message);
            await showErrorAlert('Reset failed', message);
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
                        
                        <h2 className="text-3xl font-black text-slate-900 mb-2">Reset Password</h2>
                        <p className="text-slate-500 font-medium">
                            {success
                                ? 'Check your email for reset instructions'
                                : 'Enter your email to receive password reset instructions'}
                        </p>
                    </div>

                    {success ? (
                        /* Success Message */
                        <div className="space-y-6">
                            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 text-center">
                                <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-lg font-black text-emerald-900 mb-2">
                                    Reset Email Sent!
                                </h3>
                                <p className="text-sm text-emerald-700 mb-4">
                                    We've sent a password reset link to <strong>{email}</strong>
                                </p>
                                <p className="text-xs text-emerald-600">
                                    Please check your inbox and follow the instructions to reset your password.
                                    The link will expire in 1 hour.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full border-2 border-emerald-600 text-emerald-700 bg-white hover:bg-emerald-50 font-bold py-4 rounded-2xl transition-all shadow-md shadow-emerald-50 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    Back to Login <ArrowRight size={18} />
                                </button>
                                <button
                                    onClick={() => {
                                        setSuccess(false);
                                        setEmail('');
                                    }}
                                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl transition-all"
                                >
                                    Send Another Email
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Reset Form */
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full px-5 py-3.5 pl-12 rounded-2xl border-2 border-slate-100 focus:border-emerald-600 transition-all outline-none font-medium text-slate-600"
                                        disabled={loading}
                                    />
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                </div>
                                <p className="text-xs text-slate-400 mt-2 ml-1">
                                    You'll receive a link to reset your password if any account exists with the provided email.
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                                    <p className="text-sm text-red-600 font-medium text-center">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-5">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-100 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Sending...' : 'Send Reset Link'} <ArrowRight size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-2xl py-3 transition-all"
                                >
                                    <ArrowLeft size={16} />
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Bottom Link */}
                    <div className="mt-10 text-center">
                        <p className="text-sm font-medium text-slate-500">
                            Don't have an account?{' '}
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

export default ResetPassword;

