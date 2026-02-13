import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-emerald-50/50">
            {/* Top section stays within 11/12 width */}
            <div className="w-11/12 mx-auto py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Left Section: Responsive alignment */}
                    <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldCheck className="w-6 h-6 text-emerald-600" />
                            <span className="text-xl font-bold text-slate-800">WarrantyWallet</span>
                        </div>
                        <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
                            A sustainable approach to product management. Store invoices digitally,
                            reduce paper waste, and never miss a claim deadline.
                        </p>
                    </div>

                    {/* Product Links */}
                    <div className="text-center md:text-left">
                        <h4 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-wider">Product</h4>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li>
                                <Link
                                    to="/dashboard"
                                    className="hover:text-emerald-600 transition-colors"
                                >
                                    Digital Vault
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin"
                                    className="hover:text-emerald-600 transition-colors"
                                >
                                    Admin Access
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/dashboard/products"
                                    className="hover:text-emerald-600 transition-colors"
                                >
                                    AI OCR Scanner
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="text-center md:text-left">
                        <h4 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-wider">Support</h4>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li>
                                <a
                                    href="/#faq"
                                    className="hover:text-emerald-600 transition-colors"
                                >
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <Link
                                    to="/privacy"
                                    className="hover:text-emerald-600 transition-colors"
                                >
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/terms"
                                    className="hover:text-emerald-600 transition-colors"
                                >
                                    Terms
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* EDGE-TO-EDGE LINE */}
            <div className="w-full border-t border-emerald-100"></div>

            {/* CENTER ALIGNED COPYRIGHT */}
            <div className="w-full py-8 flex flex-col items-center justify-center text-xs text-slate-400">
                <p>© {currentYear} WarrantyWallet. Protect what you own.</p>
            </div>
        </footer>
    );
};

export default Footer;