import React from 'react';
import { User, ShieldCheck } from 'lucide-react';

const QuickLogin = ({ onQuickLogin, disabled }) => {
    const credentials = {
        user: {
            email: "user101@gmail.com",
            password: "user101",
            label: "User",
            icon: <User className="w-4 h-4 text-indigo-500" />
        },
        admin: {
            email: "admin@gmail.com",
            password: "Admin123",
            label: "Admin",
            icon: <ShieldCheck className="w-4 h-4 text-amber-500" />
        }
    };

    return (
        <div className="mb-10 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between px-3 py-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quick Login</span>
                <div className="flex gap-1.5">
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => onQuickLogin(credentials.user.email, credentials.user.password)}
                        className="group flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
                        title="Login as User"
                    >
                        {credentials.user.icon}
                        <span>{credentials.user.label}</span>
                    </button>
                    
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => onQuickLogin(credentials.admin.email, credentials.admin.password)}
                        className="group flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-amber-200 hover:bg-amber-50/30 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
                        title="Login as Admin"
                    >
                        {credentials.admin.icon}
                        <span>{credentials.admin.label}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuickLogin;
