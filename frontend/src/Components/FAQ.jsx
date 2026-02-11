import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "Is WarrantyWallet free to use?",
            answer: "Yes! WarrantyWallet is completely free for all users. Sign up and start managing your warranties without any cost."
        },
        {
            question: "How secure is my data?",
            answer: "Your data is encrypted and stored securely. We use industry-standard security practices and never share your information with third parties. Only you can access your warranty documents."
        },
        {
            question: "What happens if I lose my purchase invoice?",
            answer: "If you've already uploaded your invoice to WarrantyWallet, you can download it anytime. If you haven't uploaded it yet, you'll need to contact the seller or manufacturer for a copy."
        },
        {
            question: "How do email reminders work?",
            answer: "We automatically send you an email when a warranty is about to expire (30 days before). You'll receive one reminder per product per expiry date to keep you informed without spamming your inbox."
        },
        {
            question: "Can I manage warranties for my family?",
            answer: "Currently, each account is designed for individual use. However, you can add products for family members by creating entries in your account. We're working on family sharing features for the future."
        },
        {
            question: "What file types can I upload for invoices?",
            answer: "You can upload images (JPG, PNG) and PDF files. We recommend high-quality images or PDFs to ensure all details are clearly visible for warranty claims."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="bg-white py-16 md:py-24">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-sm font-black text-emerald-600 uppercase tracking-[0.2em] mb-3">
                        FAQ
                    </h2>
                    <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
                        Frequently Asked Questions
                    </p>
                    <p className="text-slate-600 text-lg">
                        Everything you need to know about WarrantyWallet.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div 
                            key={index}
                            className="bg-slate-50 border border-slate-200 rounded-sm overflow-hidden"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-100 transition-colors"
                            >
                                <span className="font-black text-slate-900 pr-4">
                                    {faq.question}
                                </span>
                                <div className="text-emerald-600 flex-shrink-0">
                                    {openIndex === index ? (
                                        <ChevronUp className="w-5 h-5" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5" />
                                    )}
                                </div>
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-6">
                                    <p className="text-slate-600 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;

