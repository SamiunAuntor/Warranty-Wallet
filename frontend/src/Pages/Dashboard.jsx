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
            <div className="bg-white overflow-hidden shadow-sm border border-slate-200 rounded-sm">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Latest Products</h2>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 py-1 border border-slate-200 shadow-sm">
                        Last 5 Items
                    </span>
                </div>

                {isLoading ? (
                    <p className="text-slate-400 text-xs py-10 text-center uppercase tracking-widest font-medium">
                        Loading products &amp; warranties...
                    </p>
                ) : latest.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs border border-slate-200 m-4">
                        <p className="font-bold mb-1 text-slate-600 uppercase">No products yet</p>
                        <p className="mb-4">Add your first product with warranty to get started.</p>
                    </div>
                ) : (
                    <div className="p-0 overflow-x-auto text-[13px]">
                        <table className="min-w-full text-[13px] border-collapse bg-white rounded-sm overflow-hidden">
                            <thead>
                                <tr className="text-left text-slate-500 bg-slate-50 uppercase tracking-wider">
                                    <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px] rounded-tl-sm">Product Name</th>
                                    <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px]">Brand</th>
                                    <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px]">Category</th>
                                    <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px]">Purchase</th>
                                    <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px]">Warranty</th>
                                    <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px]">Type</th>
                                    <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px]">Expiry</th>
                                    <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px]">Status</th>
                                    <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px]">Email Sent</th>
                                    <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px] rounded-tr-sm">Invoice</th>
                                </tr>
                            </thead>
                            <tbody className="leading-tight">
                                {latest.map((product) => {
                                    const statusStyle =
                                        product.status === "Active"
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                            : product.status === "Expiring Soon"
                                            ? "bg-amber-50 text-amber-700 border-amber-200"
                                            : product.status === "Expired"
                                            ? "bg-rose-50 text-rose-700 border-rose-200"
                                            : "bg-slate-50 text-slate-700 border border-slate-200";

                                    const emailSent = Boolean(product.expiringSoonEmailSentAt);

                                    const formatDate = (date) => {
                                        if (!date) return "N/A";
                                        return new Date(date).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        });
                                    };

                                    return (
                                        <tr
                                            key={product._id}
                                            className="hover:bg-slate-50/50 transition-colors"
                                        >
                                            <td className="py-2 px-3 border border-slate-100 rounded-sm">
                                                <p className="font-bold text-slate-900 truncate max-w-[140px]">{product.productName || "N/A"}</p>
                                            </td>
                                            <td className="py-2 px-3 border border-slate-100 text-slate-700">{product.brand || "N/A"}</td>
                                            <td className="py-2 px-3 border border-slate-100 text-slate-700">{product.category || "N/A"}</td>
                                            <td className="py-2 px-3 border border-slate-100 text-slate-600 whitespace-nowrap">
                                                {formatDate(product.purchaseDate)}
                                            </td>
                                            <td className="py-2 px-3 border border-slate-100 text-slate-600 whitespace-nowrap">
                                                {product.warrantyDuration ? `${product.warrantyDuration} mo` : "N/A"}
                                            </td>
                                            <td className="py-2 px-3 border border-slate-100 text-slate-600 text-[11px] uppercase font-medium">
                                                {product.warrantyType || "N/A"}
                                            </td>
                                            <td className="py-2 px-3 border border-slate-100 text-slate-600 font-semibold whitespace-nowrap">
                                                {formatDate(product.expiryDate)}
                                            </td>
                                            <td className="py-2 px-3 border border-slate-100">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 text-[9px] font-black uppercase border rounded-sm ${statusStyle}`}
                                                >
                                                    {product.status || "Unknown"}
                                                </span>
                                            </td>
                                            <td className="py-2 px-3 border border-slate-100">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 text-[9px] font-black uppercase rounded-sm ${
                                                        emailSent
                                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                            : "bg-slate-50 text-slate-500 border border-dashed border-slate-300"
                                                    }`}
                                                >
                                                    {emailSent ? "Sent" : "Not Sent"}
                                                </span>
                                            </td>
                                            <td className="py-2 px-3 border border-slate-100 text-center rounded-sm">
                                                {product.invoiceId ? (
                                                    <span className="text-slate-400 text-[10px]">Available</span>
                                                ) : (
                                                    <span className="text-slate-300 text-[10px]">None</span>
                                                )}
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
        <div className={`rounded-xl px-6 py-5 flex flex-col gap-1 shadow-sm transition-transform hover:scale-[1.02] ${color}`}>
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-70">
                {title}
            </p>
            <p className="text-3xl font-black leading-tight">{value}</p>
        </div>
    );
};

export default Dashboard;