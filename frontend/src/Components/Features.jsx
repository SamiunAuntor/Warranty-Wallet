import React from 'react';
import { 
    Smartphone, 
    Mail, 
    Search, 
    BarChart3, 
    Shield, 
    Clock,
    FileCheck,
    Zap
} from 'lucide-react';

const Features = () => {
    const features = [
        {
            icon: <Smartphone className="w-6 h-6" />,
            title: "Mobile Access",
            description: "Access your warranties from any device, anywhere. Fully responsive design."
        },
        {
            icon: <Mail className="w-6 h-6" />,
            title: "Email Reminders",
            description: "Automated email alerts 30 days before warranty expiration. Never miss a deadline."
        },
        {
            icon: <Search className="w-6 h-6" />,
            title: "Smart Search",
            description: "Quickly find products by name, brand, category, or warranty status."
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: "Dashboard Analytics",
            description: "Visual insights into your warranty portfolio with status breakdowns and statistics."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Secure Cloud Storage",
            description: "Your invoices and documents are safely stored with encryption and backup."
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: "Auto Status Updates",
            description: "Warranty status automatically updates from Active to Expiring Soon to Expired."
        },
        {
            icon: <FileCheck className="w-6 h-6" />,
            title: "Invoice Management",
            description: "Upload, view, and download purchase invoices for quick claim preparation."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Fast & Reliable",
            description: "Lightning-fast performance with 99.9% uptime. Your data is always accessible."
        }
    ];

    return (
        <section className="bg-white py-16 md:py-24">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-sm font-black text-emerald-600 uppercase tracking-[0.2em] mb-3">
                        Features
                    </h2>
                    <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
                        Everything You Need to Manage Warranties
                    </p>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        Powerful features designed to make warranty management effortless and stress-free.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                    {features.map((feature, index) => (
                        <div 
                            key={index}
                            className="bg-slate-50 border border-slate-200 rounded-sm p-6 hover:bg-white hover:shadow-md transition-all"
                        >
                            <div className="text-emerald-600 mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-base font-black text-slate-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;

