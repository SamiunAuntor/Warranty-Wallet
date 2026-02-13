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

    // Local UI state for searching, filtering, sorting, and pagination
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name"); // name | createdAt | role | status
    const [sortDirection, setSortDirection] = useState("asc"); // asc | desc
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

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

    // Derived list with search, filters, and sorting applied
    const filteredUsers = React.useMemo(() => {
        let result = [...(users || [])];

        // Text search on name and email
        if (searchTerm.trim()) {
            const term = searchTerm.trim().toLowerCase();
            result = result.filter((user) => {
                const name = user.name || "";
                const email = user.email || "";
                return (
                    name.toLowerCase().includes(term) ||
                    email.toLowerCase().includes(term)
                );
            });
        }

        // Role filter
        if (roleFilter !== "all") {
            result = result.filter(
                (user) => (user.role || "user") === roleFilter
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            result = result.filter(
                (user) => (user.status || "active") === statusFilter
            );
        }

        // Sorting
        result.sort((a, b) => {
            let aVal;
            let bVal;

            switch (sortBy) {
                case "createdAt":
                    aVal = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    bVal = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    break;
                case "role":
                    aVal = a.role || "user";
                    bVal = b.role || "user";
                    break;
                case "status":
                    aVal = a.status || "";
                    bVal = b.status || "";
                    break;
                case "name":
                default:
                    aVal = a.name || "";
                    bVal = b.name || "";
            }

            if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
            if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });

        return result;
    }, [users, searchTerm, roleFilter, statusFilter, sortBy, sortDirection]);

    // Reset to first page when filters/search/sort change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, roleFilter, statusFilter, sortBy, sortDirection]);

    // Pagination calculations
    const totalPages = React.useMemo(() => {
        if (!filteredUsers || filteredUsers.length === 0) return 1;
        return Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    }, [filteredUsers, ITEMS_PER_PAGE]);

    const paginatedUsers = React.useMemo(() => {
        if (!filteredUsers) return [];
        const safePage = Math.min(Math.max(currentPage, 1), totalPages);
        const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredUsers.slice(startIndex, endIndex);
    }, [filteredUsers, currentPage, totalPages, ITEMS_PER_PAGE]);

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

            {/* Search & filter controls above the table */}
            <div className="bg-white shadow-sm border border-slate-200 rounded-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                {/* Search bar on the left */}
                <div className="w-full md:w-1/2">
                    <label className="text-[10px] font-black uppercase text-slate-500 block mb-1 tracking-widest">
                        Search users
                    </label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 text-slate-800 placeholder:text-slate-400 bg-white"
                    />
                </div>

                {/* Filtering & sorting section on the right */}
                <div className="w-full md:w-1/2 flex flex-wrap items-end justify-start md:justify-end gap-3">
                    <div className="min-w-[120px]">
                        <label className="text-[10px] font-black uppercase text-slate-500 block mb-1 tracking-widest">
                            Filter by role
                        </label>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-sm bg-white text-slate-800 focus:outline-none focus:border-slate-900"
                        >
                            <option value="all">All roles</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                    </div>

                    <div className="min-w-[140px]">
                        <label className="text-[10px] font-black uppercase text-slate-500 block mb-1 tracking-widest">
                            Filter by status
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-sm bg-white text-slate-800 focus:outline-none focus:border-slate-900"
                        >
                            <option value="all">All statuses</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                            <option value="deleted">Deleted</option>
                        </select>
                    </div>

                    <div className="min-w-[160px]">
                        <label className="text-[10px] font-black uppercase text-slate-500 block mb-1 tracking-widest">
                            Sort by
                        </label>
                        <div className="flex gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-sm bg-white text-slate-800 focus:outline-none focus:border-slate-900"
                            >
                                <option value="name">Name</option>
                                <option value="createdAt">Member Since</option>
                                <option value="role">Role</option>
                                <option value="status">Status</option>
                            </select>
                            <select
                                value={sortDirection}
                                onChange={(e) => setSortDirection(e.target.value)}
                                className="px-2 py-1.5 text-xs border border-slate-200 rounded-sm bg-white text-slate-800 focus:outline-none focus:border-slate-900"
                            >
                                <option value="asc">Asc</option>
                                <option value="desc">Desc</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white overflow-hidden shadow-sm border border-slate-200 rounded-sm">
                <div className="p-4 border-b border-slate-200 bg-slate-50/30">
                    <div className="flex items-center justify-between gap-3">
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
                </div>

                {users.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs">
                        <p className="font-bold mb-1 text-slate-600 uppercase">
                            No users found
                        </p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs">
                        <p className="font-bold mb-1 text-slate-600 uppercase">
                            No users match the current search or filters
                        </p>
                        <p>Try adjusting your search text or filters.</p>
                    </div>
                ) : (
                    <>
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
                                    {paginatedUsers.map((user) => (
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

                        {/* Pagination controls */}
                        {filteredUsers.length > ITEMS_PER_PAGE && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 bg-slate-50/50 text-[11px]">
                                <div className="text-slate-500 font-medium">
                                    Showing{" "}
                                    <span className="font-bold text-slate-800">
                                        {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-bold text-slate-800">
                                        {Math.min(
                                            currentPage * ITEMS_PER_PAGE,
                                            filteredUsers.length
                                        )}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-bold text-slate-800">
                                        {filteredUsers.length}
                                    </span>{" "}
                                    users
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                                        }
                                        disabled={currentPage === 1}
                                        className="px-2 py-1 border border-slate-200 rounded-sm text-[11px] font-semibold text-slate-600 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                                    >
                                        Prev
                                    </button>

                                    {Array.from({ length: totalPages }).map((_, index) => {
                                        const page = index + 1;
                                        const isActive = page === currentPage;
                                        return (
                                            <button
                                                key={page}
                                                type="button"
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-2 py-1 border text-[11px] font-semibold rounded-sm ${
                                                    isActive
                                                        ? "bg-emerald-600 border-emerald-600 text-white"
                                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.min(prev + 1, totalPages)
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                        className="px-2 py-1 border border-slate-200 rounded-sm text-[11px] font-semibold text-slate-600 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default UserManagement;

