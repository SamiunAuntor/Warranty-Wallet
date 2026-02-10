import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { showQueuedToastIfAny } from '../Utils/alerts';

const HomeLayout = () => {
    useEffect(() => {
        showQueuedToastIfAny();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
            {/* Soft background glow for a professional touch */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/40 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-emerald-50 blur-[100px] rounded-full" />
            </div>

            <Navbar />

            {/* Full-width main so the banner can be edge-to-edge; individual sections handle their own width (e.g., w-11/12 mx-auto) */}
            <main className="flex-grow w-full pt-0 pb-20">
                {/* This is where the Landing Page, Login, 
                    and Register components will render. 
                */}
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default HomeLayout;