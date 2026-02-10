import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, User, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import useAuth from '../Hooks/useAuth';
import { showQueuedToastIfAny, queueSuccessToast } from '../Utils/alerts';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logoutUser();
            queueSuccessToast('Logged out', 'You have been signed out successfully.');
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    useEffect(() => {
        showQueuedToastIfAny();
    }, []);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Package, label: 'Products', path: '/dashboard/products' },
        { icon: User, label: 'Profile', path: '/dashboard/profile' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex relative">
            {/* Mobile Menu Toggle (Only visible on mobile when sidebar is closed) */}
            {!sidebarOpen && (
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden fixed top-6 left-6 z-30 p-2 bg-white rounded-lg shadow-md text-slate-600 border border-slate-200"
                >
                    <Menu size={20} />
                </button>
            )}

            {/* Sidebar Overlay (Mobile only) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 transform md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } flex-shrink-0`}
            >
                <div className="h-full flex flex-col">
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-emerald-600 p-1.5 rounded-lg">
                                <ShieldCheck className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-black text-slate-800">
                                Warranty<span className="text-emerald-600">Wise</span>
                            </h2>
                        </div>
                        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm uppercase tracking-tight ${isActive
                                            ? 'bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-100/50'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-slate-200">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="User" className="w-9 h-9 rounded-full object-cover" />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                                    {user?.displayName?.[0]?.toUpperCase() || 'U'}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-black text-slate-800 truncate">{user?.displayName || 'User'}</p>
                                <p className="text-[10px] text-slate-500 truncate font-medium">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full mt-3 flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all font-bold text-xs uppercase tracking-tight"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen">
                <main className="flex-1 p-6 md:p-10 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;