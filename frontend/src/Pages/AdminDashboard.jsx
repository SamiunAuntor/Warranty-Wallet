import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Package, Mail, FileText, TrendingUp, AlertCircle } from "lucide-react";
import useAxios from "../Hooks/useAxios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    const axiosSecure = useAxios();

    const { data: stats, isLoading } = useQuery({
        queryKey: ["admin-stats"],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/admin/stats");
            return res.data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-slate-400 text-sm">Loading dashboard...</p>
            </div>
        );
    }

    const {
        totalUsers = 0,
        activeUsers = 0,
        suspendedUsers = 0,
        totalProducts = 0,
        activeProducts = 0,
        expiringSoonProducts = 0,
        expiredProducts = 0,
        remindersSent = 0,
        totalInvoices = 0,
        topCategories = [],
        userRegistrationTrend = [],
    } = stats || {};

    // User Registration Trend Chart Data
    const registrationChartData = {
        labels: userRegistrationTrend.map((item) => {
            const date = new Date(item._id);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: [
            {
                label: 'New Users',
                data: userRegistrationTrend.map((item) => item.count),
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
            },
        ],
    };

    // Product Status Chart Data
    const productStatusData = {
        labels: ['Active', 'Expiring Soon', 'Expired'],
        datasets: [
            {
                data: [activeProducts, expiringSoonProducts, expiredProducts],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderColor: [
                    'rgb(16, 185, 129)',
                    'rgb(245, 158, 11)',
                    'rgb(239, 68, 68)',
                ],
                borderWidth: 2,
            },
        ],
    };

    // Top Categories Chart Data
    const categoriesData = {
        labels: topCategories.map((c) => c.category),
        datasets: [
            {
                label: 'Products',
                data: topCategories.map((c) => c.count),
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    return (
        <div className="space-y-8 w-full">
            <div>
                <h1 className="text-3xl font-black text-slate-900 mb-1">Admin Dashboard</h1>
                <p className="text-slate-600 font-medium">
                    Overview of platform statistics and system health.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={<Users />}
                    title="Total Users"
                    value={totalUsers}
                    subtitle={`${activeUsers} active, ${suspendedUsers} suspended`}
                    color="bg-slate-900 text-white"
                />
                <StatCard
                    icon={<Package />}
                    title="Total Products"
                    value={totalProducts}
                    subtitle={`${activeProducts} active`}
                    color="bg-emerald-50 text-emerald-700 border border-emerald-100"
                />
                <StatCard
                    icon={<Mail />}
                    title="Reminders Sent"
                    value={remindersSent}
                    subtitle="Email notifications"
                    color="bg-amber-50 text-amber-700 border border-amber-100"
                />
                <StatCard
                    icon={<FileText />}
                    title="Total Invoices"
                    value={totalInvoices}
                    subtitle="Documents stored"
                    color="bg-blue-50 text-blue-700 border border-blue-100"
                />
            </div>

            {/* Product Status Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-sm p-6">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-4">
                        Product Status
                    </h3>
                    <div className="h-64">
                        <Doughnut data={productStatusData} options={chartOptions} />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-sm p-6">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-4">
                        Top Categories
                    </h3>
                    <div className="h-64">
                        <Bar data={categoriesData} options={chartOptions} />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-sm p-6">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-4">
                        User Registration Trend
                    </h3>
                    <div className="h-64">
                        {userRegistrationTrend.length > 0 ? (
                            <Line data={registrationChartData} options={chartOptions} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                                No data available
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Product Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-sm p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-emerald-700 uppercase">Active Products</span>
                        <TrendingUp className="text-emerald-600" size={20} />
                    </div>
                    <p className="text-3xl font-black text-emerald-900">{activeProducts}</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-sm p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-amber-700 uppercase">Expiring Soon</span>
                        <AlertCircle className="text-amber-600" size={20} />
                    </div>
                    <p className="text-3xl font-black text-amber-900">{expiringSoonProducts}</p>
                </div>
                <div className="bg-rose-50 border border-rose-200 rounded-sm p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-rose-700 uppercase">Expired</span>
                        <AlertCircle className="text-rose-600" size={20} />
                    </div>
                    <p className="text-3xl font-black text-rose-900">{expiredProducts}</p>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, subtitle, color }) => {
    return (
        <div className={`rounded-sm px-6 py-5 flex flex-col gap-1 shadow-sm transition-transform hover:scale-[1.02] ${color}`}>
            <div className="flex items-center justify-between mb-2">
                <div className="opacity-80">{icon}</div>
            </div>
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-70">
                {title}
            </p>
            <p className="text-3xl font-black leading-tight">{value}</p>
            {subtitle && (
                <p className="text-[10px] font-medium opacity-70 mt-1">{subtitle}</p>
            )}
        </div>
    );
};

export default AdminDashboard;

