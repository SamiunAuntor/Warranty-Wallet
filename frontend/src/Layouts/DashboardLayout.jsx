import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, User, LogOut, Menu, X, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import useAuth from '../Hooks/useAuth';
import { showQueuedToastIfAny, queueSuccessToast } from '../Utils/alerts';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mainRef, setMainRef] = useState(null);

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

    // Ensure we land at the top of the content area on route changes
    useEffect(() => {
        if (mainRef) {
            mainRef.scrollTo({
                top: 0,
                left: 0,
                behavior: "instant", // change to "smooth" if you prefer
            });
        } else {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "instant",
            });
        }
    }, [location.pathname, mainRef]);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Package, label: 'Products', path: '/dashboard/products' },
        { icon: User, label: 'Profile', path: '/dashboard/profile' },
    ];

    return (
        <>
            <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative">

                {/* Mobile Navbar - Fixed at top */}
                <div className="md:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black text-slate-800 tracking-tight">
                            Warranty<span className="text-emerald-600">Wallet</span>
                        </h2>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {/* Sidebar Overlay (Mobile only) */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-300 transform md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full'
                        } ${isCollapsed ? 'md:w-20' : 'md:w-64'} flex-shrink-0`}
                >
                    <div className="h-full flex flex-col overflow-hidden">
                        {/* Sidebar Header */}
                        <div className={`p-6 border-b border-slate-200 flex items-center ${isCollapsed ? 'md:justify-center' : 'justify-start gap-3'}`}>
                            {/* Toggle button - on the left when sidebar is open */}
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className={`hidden md:block text-slate-400 p-1 hover:text-slate-600 transition-colors flex-shrink-0`}
                            >
                                {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
                            </button>
                            {/* Brand name - no icon */}
                            <div className={`items-center gap-2 ${isCollapsed ? 'md:hidden' : 'flex'}`}>
                                <h2 className="text-xl font-black text-slate-800 whitespace-nowrap">
                                    Warranty<span className="text-emerald-600">Wallet</span>
                                </h2>
                            </div>
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
                                            } ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}
                                        data-tooltip-id="sidebar-tooltip"
                                        data-tooltip-content={isCollapsed ? item.label : undefined}
                                    >
                                        <Icon size={20} className="flex-shrink-0" />
                                        <span className={`${isCollapsed ? 'md:hidden' : 'block'} whitespace-nowrap`}>
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User Section */}
                        <div className="p-4 border-t border-slate-200">
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isCollapsed ? 'md:justify-center md:px-0 md:bg-transparent md:border-transparent' : 'bg-slate-50 border border-slate-100'}`}>
                                <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                                            {user?.displayName?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </div>
                                <div className={`flex-1 min-w-0 ${isCollapsed ? 'md:hidden' : 'block'}`}>
                                    <p className="text-xs font-black text-slate-800 truncate">{user?.displayName || 'User'}</p>
                                    <p className="text-[10px] text-slate-500 truncate font-medium">{user?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className={`w-full mt-3 flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all font-bold text-xs uppercase tracking-tight ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}
                                data-tooltip-id="sidebar-tooltip"
                                data-tooltip-content={isCollapsed ? 'Logout' : undefined}
                            >
                                <LogOut size={18} className="flex-shrink-0" />
                                <span className={`${isCollapsed ? 'md:hidden' : 'block'}`}>Logout</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-hidden">
                    <main
                        ref={setMainRef}
                        className="flex-1 p-5 md:p-10 overflow-auto"
                    >
                        <Outlet />
                    </main>
                </div>
            </div>

            <ReactTooltip
                id="sidebar-tooltip"
                place="right"
                className="!text-[11px] !font-semibold !bg-slate-900 !text-white !rounded-sm"
                delayShow={300}
                style={{ zIndex: 9999 }}
            />
        </>
    );
};

export default DashboardLayout;