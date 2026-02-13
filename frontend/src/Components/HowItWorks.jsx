import React from 'react';
import { UserPlus, Package, Bell, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
    const steps = [
        {
            number: "01",
            icon: <UserPlus className="w-6 h-6" />,
            title: "Sign Up Free",
            description: "Create your account in seconds with Google OAuth or email. No credit card required."
        },
        {
            number: "02",
            icon: <Package className="w-6 h-6" />,
            title: "Add Your Products",
            description: "Register your products with warranty details and upload purchase invoices securely."
        },
        {
            number: "03",
            icon: <Bell className="w-6 h-6" />,
            title: "Get Smart Reminders",
            description: "Receive automated email alerts when warranties are expiring soon or have expired."
        },
        {
            number: "04",
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Stay Claim-Ready",
            description: "Access all your documents instantly when you need to file a warranty claim."
        }
    ];

    return (
        <section className="bg-slate-50 py-16 md:py-24">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-sm font-black text-emerald-600 uppercase tracking-[0.2em] mb-3">
                        How It Works
                    </h2>
                    <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
                        Get Started in 4 Simple Steps
                    </p>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        From signup to claim-ready in minutes. It's that simple.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                    {steps.map((step, index) => (
                        <div 
                            key={index}
                            className="relative bg-white border border-slate-200 rounded-sm p-6 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="text-emerald-600">
                                    {step.icon}
                                </div>
                                <span className="text-4xl font-black text-slate-100">
                                    {step.number}
                                </span>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-2">
                                {step.title}
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {step.description}
                            </p>
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-emerald-500 transform -translate-y-1/2">
                                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-emerald-500 border-t-2 border-t-transparent border-b-2 border-b-transparent" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                
            </div>
        </section>
    );
};

export default HowItWorks;

