import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../Hooks/useAxios";

const Dashboard = () => {
    const axiosSecure = useAxios();

    const { data, isLoading } = useQuery({
        queryKey: ["dashboard-user"],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/dashboard/user");
            return res.data;
        },
    });

    const stats = data || {};
    const latest = stats.latestProducts || [];

    return (
        <div className="space-y-8 w-full">
            <div>
                <h1 className="text-3xl font-black text-slate-900 mb-1">Dashboard</h1>
                <p className="text-slate-600 font-medium">
                    Overview of your registered products and their warranty status.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts ?? 0}
                    color="bg-slate-900 text-white"
                />
                <StatCard
                    title="Active"
                    value={stats.activeWarranties ?? 0}
                    color="bg-emerald-50 text-emerald-700 border border-emerald-100"
                />
                <StatCard
                    title="Expiring Soon"
                    value={stats.expiringSoonWarranties ?? 0}
                    color="bg-amber-50 text-amber-700 border border-amber-100"
                />
                <StatCard
                    title="Expired"
                    value={stats.expiredWarranties ?? 0}
                    color="bg-rose-50 text-rose-700 border border-rose-100"
                />
            </div>

            {/* Latest products table */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Latest Products</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                        Showing last 5
                    </p>
                </div>

                {isLoading ? (
                    <div className="p-10 text-center"><p className="text-slate-400 text-sm animate-pulse">Loading dashboard...</p></div>
                ) : latest.length === 0 ? (
                    <div className="p-10 text-center text-slate-400 text-sm font-medium">
                        You haven't added any products yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="text-left text-slate-500 text-[11px] uppercase tracking-widest bg-slate-50/50">
                                    <th className="py-4 px-6 border-r border-b border-slate-200">Product</th>
                                    <th className="py-4 px-6 border-r border-b border-slate-200">Brand</th>
                                    <th className="py-4 px-6 border-r border-b border-slate-200">Category</th>
                                    <th className="py-4 px-6 border-r border-b border-slate-200">Expiry</th>
                                    <th className="py-4 px-6 border-b border-slate-200">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {latest.map((product) => {
                                    const expiry = new Date(product.expiryDate);
                                    const expiryLabel = expiry.toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    });

                                    return (
                                        <tr key={product._id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 px-6 border-r border-slate-200 font-bold text-slate-900">
                                                {product.productName}
                                            </td>
                                            <td className="py-4 px-6 border-r border-slate-200 text-slate-600 font-medium">
                                                {product.brand}
                                            </td>
                                            <td className="py-4 px-6 border-r border-slate-200 text-slate-600 font-medium">
                                                {product.category}
                                            </td>
                                            <td className="py-4 px-6 border-r border-slate-200 text-slate-600 font-medium">
                                                {expiryLabel}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight bg-slate-100 text-slate-600 border border-slate-200">
                                                    {product.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ title, value, color }) => {
    return (
        <div className={`rounded-2xl px-6 py-5 flex flex-col gap-1 shadow-sm transition-transform hover:scale-[1.02] ${color}`}>
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-70">
                {title}
            </p>
            <p className="text-3xl font-black leading-tight">{value}</p>
        </div>
    );
};

export default Dashboard;