import React from "react";
import useAuth from "../Hooks/useAuth";
import useRoles from "../Hooks/useRoles";

const Profile = () => {
    const { user } = useAuth();
    const { role, status } = useRoles();

    return (
        <div className="max-w-xl">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Profile</h1>
            <p className="text-slate-600 mb-8">
                View your account information and role inside Warranty Wallet.
            </p>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex gap-4 items-center">
                {user?.photoURL ? (
                    <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        className="w-16 h-16 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xl">
                        {user?.displayName?.[0]?.toUpperCase() ||
                            user?.email?.[0]?.toUpperCase() ||
                            "U"}
                    </div>
                )}

                <div className="flex-1 space-y-1">
                    <p className="text-lg font-bold text-slate-900">
                        {user?.displayName || "User"}
                    </p>
                    <p className="text-sm text-slate-500">{user?.email}</p>
                    <div className="flex gap-2 mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-[0.16em]">
                            {role}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-[0.16em]">
                            {status}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;


