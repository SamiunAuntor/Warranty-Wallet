import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../Hooks/useAxios";

const HomeStats = () => {
    const axiosPublic = useAxios();

    const { data, isLoading } = useQuery({
        queryKey: ["public-stats"],
        queryFn: async () => {
            const res = await axiosPublic.get("/api/public/stats");
            return res.data;
        },
    });

    const stats = data || {
        totalUsers: 0,
        totalProducts: 0,
        expiringSoonProducts: 0,
        expiredProducts: 0,
        remindersSent: 0,
        topCategories: [],
    };

    return (
        <div className="bg-white border-y border-slate-200 py-16">
            <div className="max-w-6xl mx-auto px-6">
                {/* Classic Centered Header */}
                <div className="text-center mb-12">
                    <h2 className="text-sm font-black text-emerald-600 uppercase tracking-[0.2em] mb-3">
                        Live Statistics
                    </h2>
                    <p className="text-3xl font-black text-slate-900 tracking-tight">
                        Trusted by users to track what matters.
                    </p>
                </div>

                {/* Classic Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
                    <StatGroup 
                        label="Total Users" 
                        value={stats.totalUsers} 
                        isLoading={isLoading} 
                    />
                    <StatGroup 
                        label="Assets Protected" 
                        value={stats.totalProducts} 
                        isLoading={isLoading} 
                    />
                    <StatGroup 
                        label="Active Alerts" 
                        value={stats.expiringSoonProducts} 
                        isLoading={isLoading} 
                    />
                    <StatGroup 
                        label="Emails Delivered" 
                        value={stats.remindersSent} 
                        isLoading={isLoading} 
                    />
                </div>
            </div>
        </div>
    );
};

/* Internal Component for the Classic Stat Look */
const StatGroup = ({ label, value, isLoading }) => {
    return (
        <div className="flex flex-col items-center text-center space-y-1">
            <span className="text-4xl md:text-5xl font-black text-slate-900 tabular-nums tracking-tighter">
                {isLoading ? (
                    <span className="inline-block w-16 h-10 bg-slate-100 animate-pulse rounded" />
                ) : (
                    value.toLocaleString()
                )}
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {label}
            </span>
            {/* Minimalist Accent Line */}
            <div className="w-6 h-1 bg-emerald-500 mt-2" />
        </div>
    );
};

export default HomeStats;

