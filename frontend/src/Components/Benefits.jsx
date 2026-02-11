import React from 'react';
import { CheckCircle2, DollarSign, Heart, TrendingUp } from 'lucide-react';

const Benefits = () => {
    const benefits = [
        {
            icon: <DollarSign className="w-8 h-8" />,
            title: "Save Money",
            description: "Never pay for repairs that should be covered under warranty. Claim your entitled benefits."
        },
        {
            icon: <Heart className="w-8 h-8" />,
            title: "Peace of Mind",
            description: "Stop worrying about lost documents or missed deadlines. Everything is organized and automated."
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: "Stay Organized",
            description: "All your warranty information in one place. No more searching through drawers or emails."
        },
        {
            icon: <CheckCircle2 className="w-8 h-8" />,
            title: "Claim Ready",
            description: "Have all documents ready when you need them. Quick access to invoices and warranty details."
        }
    ];

    return (
        <section className="bg-gradient-to-br from-emerald-50 to-slate-50 py-16 md:py-24">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-sm font-black text-emerald-600 uppercase tracking-[0.2em] mb-3">
                        Why Choose Us
                    </h2>
                    <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
                        The Benefits of WarrantyWallet
                    </p>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        Join thousands of users who trust WarrantyWallet to protect their investments.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    {benefits.map((benefit, index) => (
                        <div 
                            key={index}
                            className="bg-white border border-emerald-100 rounded-sm p-8 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <div className="text-emerald-600 flex-shrink-0 mt-1">
                                    {benefit.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 mb-3">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {benefit.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Benefits;

