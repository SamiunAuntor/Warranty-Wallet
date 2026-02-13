import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
    return (
        <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                    <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
                    Ready to Protect Your Investments?
                </h2>
                
                <p className="text-lg md:text-xl text-emerald-50 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Join thousands of users who trust WarrantyWallet to manage their warranties. 
                    Get started in seconds—no credit card required.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link 
                        to="/register"
                        className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-emerald-600 px-8 py-4 rounded-sm font-black text-base uppercase tracking-tight transition-all shadow-xl active:scale-95 group"
                    >
                        Get Started Free
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                        to="/login"
                        className="inline-flex items-center gap-2 bg-transparent border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-sm font-bold text-base uppercase tracking-tight transition-all active:scale-95"
                    >
                        Sign In
                    </Link>
                </div>

                
            </div>
        </section>
    );
};

export default CallToAction;

