import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Mail, Calendar, Shield, MoreVertical } from "lucide-react";
import useAxios from "../Hooks/useAxios";
import { showConfirmAlert, showTimedSuccessAlert, showErrorAlert } from "../Utils/alerts";
import { getAuthErrorMessage } from "../Utils/authErrorMessages";

const UserManagement = () => {
    const axiosSecure = useAxios();
    const queryClient = useQueryClient();
    const [selectedUserId, setSelectedUserId] = useState(null);

    const { data: users = [], isLoading } = useQuery({
        queryKey: ["admin-users"],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/admin/users");
            return res.data;
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ userId, status }) => {
            await axiosSecure.put(`/api/admin/users/${userId}/status`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["admin-users"]);
        },
    });

    const handleStatusChange = async (user, newStatus) => {
        try {
            let confirmMessage = "";
            if (newStatus === "suspended") {
                confirmMessage = `Are you sure you want to suspend "${user.name}"? They will not be able to access the platform.`;
            } else if (newStatus === "deleted") {
                confirmMessage = `⚠️ WARNING: Are you sure you want to permanently delete "${user.name}"? This will permanently remove the user from the database and cannot be undone. The user's products and invoices will remain in the system.`;
            } else if (newStatus === "active") {
                confirmMessage = `Are you sure you want to activate "${user.name}"?`;
            }

            if (confirmMessage) {
                const result = await showConfirmAlert(
                    "Update User Status?",
                    confirmMessage,
                    "Yes, Update",
                    "Cancel"
                );

                if (!result.isConfirmed) {
                    return;
                }
            }

            await updateStatusMutation.mutateAsync({
                userId: user._id,
                status: newStatus,
            });

            const successMessage = newStatus === "deleted" 
                ? "User has been permanently deleted from the database."
                : `User status has been updated to ${newStatus}.`;
            
            await showTimedSuccessAlert(
                newStatus === "deleted" ? "User Deleted" : "Status Updated",
                successMessage
            );
        } catch (error) {
            console.error(error);
            const message = getAuthErrorMessage(error, "updating user status");
            await showErrorAlert("Update Failed", message);
        }
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            active: "bg-emerald-50 text-emerald-700 border-emerald-200",
            suspended: "bg-amber-50 text-amber-700 border-amber-200",
            deleted: "bg-rose-50 text-rose-700 border-rose-200",
        };

        return (
            <span
                className={`inline-flex items-center px-2 py-0.5 text-[9px] font-black uppercase border rounded-sm ${
                    styles[status] || "bg-slate-50 text-slate-700 border-slate-200"
                }`}
            >
                {status || "Unknown"}
            </span>
        );
    };

    const getRoleBadge = (role) => {
        return (
            <span
                className={`inline-flex items-center px-2 py-0.5 text-[9px] font-black uppercase border rounded-sm ${
                    role === "admin"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
            >
                {role || "user"}
            </span>
        );
    };

    if (isLoading) {
        return (
            <p className="text-slate-400 text-xs py-10 text-center uppercase tracking-widest font-medium">
                Loading users...
            </p>
        );
    }

    return (
        <div className="space-y-6 w-full">
            <div>
                <h1 className="text-3xl font-black text-slate-900 mb-1">User Management</h1>
                <p className="text-slate-600 font-medium">
                    Manage user accounts and their access to the platform.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-sm p-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-50 p-3 rounded-sm">
                            <Users className="text-emerald-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Total Users</p>
                            <p className="text-2xl font-black text-slate-900">{users.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-sm p-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-50 p-3 rounded-sm">
                            <Shield className="text-emerald-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Active Users</p>
                            <p className="text-2xl font-black text-slate-900">
                                {users.filter((u) => u.status === "active").length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-sm p-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-50 p-3 rounded-sm">
                            <Shield className="text-amber-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Suspended</p>
                            <p className="text-2xl font-black text-slate-900">
                                {users.filter((u) => u.status === "suspended").length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white overflow-hidden shadow-sm border border-slate-200 rounded-sm">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-2">
                        <Users className="text-emerald-600" size={18} />
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                            All Users
                        </h2>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 py-1 border border-slate-200 shadow-sm">
                        {users.length} Users
                    </span>
                </div>

                {users.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs">
                        <p className="font-bold mb-1 text-slate-600 uppercase">No users found</p>
                    </div>
                ) : (
                    <div className="p-0 overflow-x-auto text-[13px]">
                        <table className="min-w-full text-[13px] border-collapse bg-white rounded-sm overflow-hidden">
                            <thead>
                                <tr className="text-left text-slate-500 bg-slate-50 uppercase tracking-wider">
                                    <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px] rounded-tl-sm">
                                        User
                                    </th>
                                    <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px]">
                                        Email
                                    </th>
                                    <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px]">
                                        Role
                                    </th>
                                    <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px]">
                                        Status
                                    </th>
                                    <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px]">
                                        Member Since
                                    </th>
                                    <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px] rounded-tr-sm text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="leading-tight">
                                {users.map((user) => (
                                    <tr
                                        key={user._id}
                                        className="hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="py-2 px-3 border border-slate-100 rounded-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                                    {user.photoURL ? (
                                                        <img
                                                            src={user.photoURL}
                                                            alt={user.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                                                            {user.name?.[0]?.toUpperCase() || "U"}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="font-bold text-slate-900">
                                                    {user.name || "N/A"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-2 px-3 border border-slate-100 text-slate-700">
                                            {user.email || "N/A"}
                                        </td>
                                        <td className="py-2 px-3 border border-slate-100">
                                            {getRoleBadge(user.role)}
                                        </td>
                                        <td className="py-2 px-3 border border-slate-100">
                                            {getStatusBadge(user.status)}
                                        </td>
                                        <td className="py-2 px-3 border border-slate-100 text-slate-600 whitespace-nowrap">
                                            {formatDate(user.createdAt)}
                                        </td>
                                        <td className="py-2 px-3 border border-slate-100 rounded-sm">
                                            <div className="flex items-center justify-center">
                                                <select
                                                    value={user.status}
                                                    onChange={(e) =>
                                                        handleStatusChange(user, e.target.value)
                                                    }
                                                    disabled={updateStatusMutation.isPending}
                                                    className="px-2 py-1 rounded-sm border border-slate-200 focus:border-slate-900 outline-none text-xs text-slate-700 bg-white font-medium disabled:opacity-50"
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="suspended">Suspended</option>
                                                    <option value="deleted">Deleted</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;

