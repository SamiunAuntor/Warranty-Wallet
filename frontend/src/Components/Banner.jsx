import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import Typewriter from 'typewriter-effect';
import { ShieldCheck, ArrowRight, BellRing, FileText, Smartphone, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/effect-fade';

const Banner = () => {
    const sliderImages = [
        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1200", 
        "https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?q=80&w=1200",
        "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1200",
        "https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=1200",
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200",
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200"
    ];

    return (
        // Full-bleed banner (edge-to-edge). Content itself is free-width,
        // but we nudge the left text column so it visually aligns with the Navbar logo.
        <section className="relative w-screen left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] overflow-hidden bg-white border-b border-emerald-50">
            <div className="flex flex-col lg:flex-row min-h-[600px] lg:h-[85vh]">
                
                {/* MOBILE PHOTO DISPLAY: Photos appear at the top on mobile for visual impact */}
                <div className="w-full lg:w-1/2 h-[300px] md:h-[400px] lg:h-full order-1 lg:order-2 relative">
                    <Swiper
                        modules={[Autoplay, EffectFade]}
                        effect="fade"
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        loop={true}
                        className="h-full w-full"
                    >
                        {sliderImages.map((img, index) => (
                            <SwiperSlide key={index}>
                                <div className="w-full h-full relative">
                                    <img 
                                        src={img} 
                                        alt="Warranty Management" 
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Gradient overlay to help transition to the text area */}
                                    <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-slate-50/20 via-transparent to-transparent" />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* LEFT CONTENT AREA: Soft gray background to match HomeLayout.
                    On large screens we pad from the left by ~4.1667vw to match the Navbar's 11/12 container. */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-10 lg:px-0 lg:pl-[4.1667vw] py-12 md:py-16 bg-[#F8FAFC] order-2 lg:order-1">
                    <div className="max-w-xl pl-1.5">
                        

                        {/* Typewriter Heading */}
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6">
                            Securely Manage <br />
                            <span className="text-emerald-600">
                                <Typewriter
                                    options={{
                                        strings: [
                                            'Product Warranties.',
                                            'Purchase Invoices.',
                                            'Smart Reminders.',
                                            'Claim Readiness.'
                                        ],
                                        autoStart: true,
                                        loop: true,
                                    }}
                                />
                            </span>
                        </h1>

                        <p className="text-slate-600 text-justify text-base md:text-lg mb-8 leading-relaxed font-medium">
                            The ultimate digital vault to store purchase documents 
                            and receive intelligent reminders—ensuring you never miss a repair window.
                        </p>

                        {/* Feature Highlights - Clean Icons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            {[
                                { icon: <BellRing />, text: "Smart Alerts" },
                                { icon: <FileText />, text: "Invoice Vault" },
                                { icon: <Smartphone />, text: "Mobile Access" },
                                { icon: <LayoutDashboard />, text: "Admin Panel" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-slate-700 font-bold text-xs md:text-sm uppercase tracking-tight">
                                    <span className="text-emerald-500">{item.icon}</span>
                                    {item.text}
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link 
                                to="/register" 
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-emerald-200 active:scale-95 flex items-center justify-center gap-2 group"
                            >
                                Get Started 
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;