import React from 'react';
import { ShieldCheck, FileText, BellRing, Lock } from 'lucide-react';

const AboutUs = () => {
    return (
        <section className="bg-white py-16 md:py-24">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-sm font-black text-emerald-600 uppercase tracking-[0.2em] mb-3">
                        About Us
                    </h2>
                    <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
                        Never Lose a Warranty Benefit Again
                    </p>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        WarrantyWallet transforms scattered warranty documents into a secure, intelligent, 
                        and actionable system—ensuring you never miss the benefits you're entitled to.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                    {[
                        {
                            icon: <ShieldCheck className="w-8 h-8" />,
                            title: "Secure Storage",
                            description: "Your warranty documents are safely stored in the cloud, accessible anytime, anywhere."
                        },
                        {
                            icon: <BellRing className="w-8 h-8" />,
                            title: "Smart Reminders",
                            description: "Automated alerts ensure you never miss an expiration date or claim window."
                        },
                        {
                            icon: <FileText className="w-8 h-8" />,
                            title: "Digital Vault",
                            description: "Store purchase invoices and warranty documents in one organized place."
                        },
                        {
                            icon: <Lock className="w-8 h-8" />,
                            title: "Privacy First",
                            description: "Your data is encrypted and private. Only you can access your information."
                        }
                    ].map((item, index) => (
                        <div 
                            key={index}
                            className="bg-slate-50 border border-slate-200 rounded-sm p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="text-emerald-600 mb-4">
                                {item.icon}
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-2">
                                {item.title}
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutUs;

