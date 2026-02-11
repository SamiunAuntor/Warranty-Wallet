import React, { useEffect, useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, ShieldCheck, CalendarDays, Clock3, Edit2, Save, X, ImageUp } from "lucide-react";
import useAxios from "../Hooks/useAxios";
import useAuth from "../Hooks/useAuth";
import useRoles from "../Hooks/useRoles";
import { showErrorAlert, showTimedSuccessAlert } from "../Utils/alerts";
import { getAuthErrorMessage } from "../Utils/authErrorMessages";
import { uploadImageToImgBB } from "../Utils/UploadImage";

const Profile = () => {
    const axiosSecure = useAxios();
    const { user, updateUserProfile } = useAuth();
    const { role, status } = useRoles();
    const queryClient = useQueryClient();

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const justSavedRef = useRef(false);

    const [formData, setFormData] = useState({
        name: "",
        photoURL: "",
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { data, isLoading, error } = useQuery({
        queryKey: ["current-user-profile"],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/users/me");
            return res.data;
        },
        enabled: !!user,
    });

    useEffect(() => {
        // Don't sync if we just saved (to prevent overwriting the saved values)
        if (justSavedRef.current) {
            return;
        }
        
        // Only sync formData on initial load (when formData is empty) or when data changes from outside
        // Don't sync during save/edit to avoid overwriting user changes
        if (data && !saving && !isEditing) {
            const currentPhotoURL = formData.photoURL || "";
            const dataPhotoURL = data.photoURL || "";
            
            // Only update photoURL if:
            // 1. formData.photoURL is empty (initial load), OR
            // 2. data.photoURL exists, is different, and is not empty (DB was updated externally)
            // NEVER overwrite an existing photoURL with user?.photoURL (which might be old Google photo)
            const shouldUpdatePhotoURL = !currentPhotoURL || (dataPhotoURL && dataPhotoURL !== currentPhotoURL);
            
            setFormData((prev) => {
                let newPhotoURL = prev.photoURL || "";
                
                if (shouldUpdatePhotoURL && dataPhotoURL) {
                    // Use data.photoURL from DB (most authoritative)
                    newPhotoURL = dataPhotoURL;
                } else if (!prev.photoURL) {
                    // Only use user?.photoURL as fallback if formData is empty (initial load)
                    newPhotoURL = user?.photoURL || "";
                }
                // Otherwise keep prev.photoURL (don't overwrite with user?.photoURL)
                
                return {
                    name: data.name || user?.displayName || prev.name || "",
                    photoURL: newPhotoURL,
                };
            });
        }
    }, [data, user, saving, isEditing]);

    const handleSave = async () => {
        try {
            if (!formData.name?.trim()) {
                await showErrorAlert("Invalid name", "Please provide your full name.");
                return;
            }

            if (uploadingAvatar) {
                await showErrorAlert(
                    "Please wait",
                    "Avatar is still uploading. Wait for it to finish before saving."
                );
                return;
            }

            setSaving(true);

            const savedName = formData.name.trim();
            const savedPhotoURL = formData.photoURL?.trim() || "";

            // 1) Update in backend users collection
            const dbResponse = await axiosSecure.put("/api/users/me", {
                name: savedName,
                photoURL: savedPhotoURL,
            });

            // 2) Update Firebase Auth profile via AuthProvider helper
            if (user) {
                await updateUserProfile({
                    displayName: savedName,
                    photoURL: savedPhotoURL || null,
                });
                // Reload Firebase user to get updated photoURL
                await user.reload();
            }

            // 3) Update formData immediately with saved values (for instant UI update)
            // Use the DB response to ensure we have the exact saved value
            const finalPhotoURL = dbResponse?.data?.photoURL || savedPhotoURL;
            
            // Mark that we just saved to prevent useEffect from overwriting
            justSavedRef.current = true;
            
            setFormData({
                name: dbResponse?.data?.name || savedName,
                photoURL: finalPhotoURL,
            });

            // 4) Set editing to false
            setIsEditing(false);

            // 5) Refetch in background after a short delay to ensure DB is fully updated
            setTimeout(() => {
                queryClient.invalidateQueries({
                    queryKey: ["current-user-profile"],
                });
            }, 500);
            
            // Reset the flag after a longer delay to ensure DB refetch completes
            // This prevents useEffect from overwriting with stale data
            setTimeout(() => {
                justSavedRef.current = false;
            }, 3000);
            await showTimedSuccessAlert("Profile updated", "Your profile information has been updated.", 1600);
        } catch (err) {
            console.error("Error updating profile:", err);
            const message = getAuthErrorMessage(err, "updating your profile");
            await showErrorAlert("Update failed", message);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (data) {
            setFormData({
                name: data.name || user?.displayName || "",
                photoURL: data.photoURL || user?.photoURL || "",
            });
        }
        setIsEditing(false);
    };

    const handleAvatarFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingAvatar(true);
            const url = await uploadImageToImgBB(file);
            setFormData((prev) => ({
                ...prev,
                photoURL: url,
            }));
            await showTimedSuccessAlert(
                "Avatar ready",
                "Preview updated. Click \"Save Changes\" to apply it to your account.",
                1400
            );
        } catch (err) {
            console.error("Avatar upload failed:", err);
            const message = getAuthErrorMessage(err, "uploading your avatar");
            await showErrorAlert("Upload failed", message);
        } finally {
            setUploadingAvatar(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-slate-400 text-sm">Loading profile...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-red-500 text-sm font-medium">Error loading profile details.</p>
            </div>
        );
    }

    const displayName = data.name || user?.displayName || "User";
    const email = data.email || user?.email || "N/A";
    const createdAt = data.createdAt ? new Date(data.createdAt) : null;
    const lastLoginAt = data.lastLoginAt ? new Date(data.lastLoginAt) : null;

    // Prioritize Firebase user.photoURL (updates immediately) > formData.photoURL > data.photoURL
    const avatarSrc =
        user?.photoURL ||
        formData.photoURL ||
        data.photoURL ||
        "https://ui-avatars.com/api/?background=059669&color=fff&name=" +
            encodeURIComponent(displayName);

    return (
        <div className="space-y-8 w-full">
            {/* Banner / Header */}
            <div className="relative bg-slate-900 text-white overflow-hidden border border-slate-900 rounded-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/40 via-slate-900/40 to-slate-900" />

                <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 px-6 pt-6 pb-6 md:pb-8">
                    {/* Avatar */}
                    <div className="relative">
                        <img
                            src={avatarSrc}
                            alt="Profile"
                            className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover object-center border-4 border-white shadow-2xl bg-slate-200"
                        />
                        <span
                            className={`absolute -bottom-2 -right-2 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white rounded-sm ${
                                status === "blocked"
                                    ? "bg-rose-600"
                                    : status === "pending"
                                    ? "bg-amber-500"
                                    : "bg-emerald-600"
                            }`}
                        >
                            {status || "Active"}
                        </span>
                    </div>

                    {/* Main info */}
                    <div className="flex-1 text-center md:text-left space-y-1">
                        <h1 className="text-2xl md:text-3xl font-extrabold">{displayName}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-slate-100/90">
                            <Mail size={16} className="mt-[2px]" />
                            <span>{email}</span>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3 text-[10px] font-bold uppercase tracking-[0.18em]">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 border border-white/20 rounded-sm">
                                <ShieldCheck size={14} />
                                {role || "User"}
                            </span>
                            {createdAt && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/10 rounded-sm">
                                    <CalendarDays size={14} />
                                    Member since{" "}
                                    {createdAt.toLocaleDateString(undefined, {
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </span>
                            )}
                            {lastLoginAt && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/10 rounded-sm">
                                    <Clock3 size={14} />
                                    Last login{" "}
                                    {lastLoginAt.toLocaleDateString(undefined, {
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 md:mt-0 flex gap-2">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-white text-slate-900 font-semibold text-xs uppercase tracking-tight border border-slate-200 hover:bg-slate-50 transition flex items-center gap-2 rounded-sm"
                            >
                                <Edit2 size={16} />
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-4 py-2 bg-emerald-600 text-white font-semibold text-xs uppercase tracking-tight border border-emerald-500 hover:bg-emerald-700 transition flex items-center gap-2 disabled:opacity-60 rounded-sm"
                                >
                                    <Save size={16} />
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-slate-700 text-white font-semibold text-xs uppercase tracking-tight border border-slate-500 hover:bg-slate-800 transition flex items-center gap-2 rounded-sm"
                                >
                                    <X size={16} />
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Details - Two column grid */}
            <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Details - Editable fields */}
                <ProfileCard title="Profile Details">
                    <div className="space-y-4 text-sm text-slate-700">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                                }
                                className="w-full px-3 py-2 border border-slate-200 text-sm rounded-sm outline-none focus:border-emerald-600"
                                disabled={!isEditing}
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-1">
                                Email
                            </label>
                            <input
                                type="text"
                                value={email}
                                readOnly
                                className="w-full px-3 py-2 border border-slate-200 text-sm rounded-sm outline-none bg-slate-50 text-slate-600"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-1">
                                Role
                            </label>
                            <input
                                type="text"
                                value={role || "User"}
                                readOnly
                                className="w-full px-3 py-2 border border-slate-200 text-sm rounded-sm outline-none bg-slate-50 text-slate-600"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-1">
                                Status
                            </label>
                            <input
                                type="text"
                                value={status || "Active"}
                                readOnly
                                className="w-full px-3 py-2 border border-slate-200 text-sm rounded-sm outline-none bg-slate-50 text-slate-600"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-1">
                                Avatar URL
                            </label>
                            <input
                                type="text"
                                value={formData.photoURL}
                                readOnly
                                className="w-full px-3 py-2 border border-slate-200 text-sm rounded-sm outline-none bg-slate-50 text-slate-600"
                            />
                            <p className="mt-1 text-[11px] text-slate-400">
                                This is the current avatar image URL linked to your account.
                            </p>
                        </div>

                        {isEditing && (
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-1">
                                    Update Avatar
                                </label>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <label className="inline-flex items-center px-3 py-2 border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-700 uppercase tracking-[0.16em] cursor-pointer hover:bg-slate-100 transition-colors rounded-sm">
                                            <ImageUp className="w-4 h-4 mr-2" />
                                            <span>{uploadingAvatar ? "Uploading..." : "Upload image"}</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarFileChange}
                                                className="hidden"
                                                disabled={uploadingAvatar}
                                            />
                                        </label>
                                        {formData.photoURL && (
                                            <span className="text-[11px] text-emerald-600 font-medium">
                                                Preview updated
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-[11px] text-slate-400">
                                        Upload a new picture to update your avatar. Changes are saved when
                                        you click "Save Changes".
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </ProfileCard>

                {/* Account & Activity Info - Merged */}
                <ProfileCard title="Account Information">
                    <div className="space-y-4 text-sm text-slate-700">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-1">
                                Member Since
                            </label>
                            <input
                                type="text"
                                value={
                                    createdAt
                                        ? createdAt.toLocaleDateString(undefined, {
                                              year: "numeric",
                                              month: "short",
                                              day: "numeric",
                                          })
                                        : "N/A"
                                }
                                readOnly
                                className="w-full px-3 py-2 border border-slate-200 text-sm rounded-sm outline-none bg-slate-50 text-slate-600"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-1">
                                Last Login
                            </label>
                            <input
                                type="text"
                                value={
                                    lastLoginAt
                                        ? lastLoginAt.toLocaleString(undefined, {
                                              year: "numeric",
                                              month: "short",
                                              day: "numeric",
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          })
                                        : "N/A"
                                }
                                readOnly
                                className="w-full px-3 py-2 border border-slate-200 text-sm rounded-sm outline-none bg-slate-50 text-slate-600"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-1">
                                Sign-in Provider
                            </label>
                            <input
                                type="text"
                                value={user?.providerData?.[0]?.providerId || "firebase"}
                                readOnly
                                className="w-full px-3 py-2 border border-slate-200 text-sm rounded-sm outline-none bg-slate-50 text-slate-600"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-1">
                                MongoDB ID
                            </label>
                            <input
                                type="text"
                                value={String(data.id || "")}
                                readOnly
                                className="w-full px-3 py-2 border border-slate-200 text-sm rounded-sm outline-none bg-slate-50 text-slate-600 font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-1">
                                Firebase UID
                            </label>
                            <input
                                type="text"
                                value={user?.uid || "N/A"}
                                readOnly
                                className="w-full px-3 py-2 border border-slate-200 text-sm rounded-sm outline-none bg-slate-50 text-slate-600 font-mono"
                            />
                        </div>
                    </div>
                </ProfileCard>
            </main>
        </div>
    );
};

const ProfileCard = ({ title, children }) => (
    <section className="bg-white border border-slate-200 px-5 py-4 flex flex-col gap-3 rounded-sm">
        <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            {title}
        </h2>
        <div>{children}</div>
    </section>
);

const InfoRow = ({ label, value }) => (
    <div className="flex flex-col gap-0.5">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.18em]">
            {label}
        </span>
        <span className="text-sm font-medium text-slate-800 break-words">{value || "N/A"}</span>
    </div>
);

export default Profile;
