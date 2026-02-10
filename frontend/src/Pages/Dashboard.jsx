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
        <div className="space-y-8 max-w-5xl">
            <div>
                <h1 className="text-3xl font-black text-slate-900 mb-1">Dashboard</h1>
                <p className="text-slate-600">
                    Overview of your registered products and their warranty status.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-black text-slate-900">Latest Products</h2>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-[0.16em]">
                        Showing last 5 products
                    </p>
                </div>

                {isLoading ? (
                    <p className="text-slate-400 text-sm">Loading dashboard...</p>
                ) : latest.length === 0 ? (
                    <p className="text-slate-400 text-sm">
                        You haven&apos;t added any products yet. Start by registering a product from
                        the Products page.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-left text-slate-400 text-xs uppercase tracking-[0.16em] border-b border-slate-100">
                                    <th className="py-2 pr-4">Product</th>
                                    <th className="py-2 pr-4">Brand</th>
                                    <th className="py-2 pr-4">Category</th>
                                    <th className="py-2 pr-4">Expiry</th>
                                    <th className="py-2 pr-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {latest.map((product) => {
                                    const expiry = new Date(product.expiryDate);
                                    const expiryLabel = expiry.toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    });

                                    return (
                                        <tr
                                            key={product._id}
                                            className="border-b border-slate-100 last:border-b-0"
                                        >
                                            <td className="py-2 pr-4 font-medium text-slate-900">
                                                {product.productName}
                                            </td>
                                            <td className="py-2 pr-4 text-slate-600">
                                                {product.brand}
                                            </td>
                                            <td className="py-2 pr-4 text-slate-600">
                                                {product.category}
                                            </td>
                                            <td className="py-2 pr-4 text-slate-600">
                                                {expiryLabel}
                                            </td>
                                            <td className="py-2 pr-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-slate-50 text-slate-700 border border-slate-200">
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
        <div className={`rounded-2xl px-4 py-3.5 flex flex-col gap-1 ${color}`}>
            <p className="text-[11px] font-semibold tracking-[0.16em] uppercase opacity-80">
                {title}
            </p>
            <p className="text-2xl font-black leading-tight">{value}</p>
        </div>
    );
};

export default Dashboard;

