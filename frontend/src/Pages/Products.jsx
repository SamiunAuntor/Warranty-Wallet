import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, PackageSearch, Search, Filter, X } from "lucide-react";
import useAxios from "../Hooks/useAxios";
import { uploadImageToImgBB } from "../Utils/UploadImage";
import { showErrorAlert, showInfoAlert, showConfirmAlert, showTimedSuccessAlert } from "../Utils/alerts";
import { getAuthErrorMessage } from "../Utils/authErrorMessages";
import useAuth from "../Hooks/useAuth";
import WarrantyForm from "../Components/Dashboard/WarrantyForm";
import WarrantyList from "../Components/Dashboard/WarrantyList";
import InvoiceModal from "../Components/Dashboard/InvoiceModal";

const Products = () => {
    const axiosSecure = useAxios();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [viewingInvoice, setViewingInvoice] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [emailSentFilter, setEmailSentFilter] = useState("all");

    const { data: products = [], isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/products");
            return res.data;
        },
        enabled: !!user,
    });

    const upsertProductMutation = useMutation({
        mutationFn: async ({ formData, invoiceFiles }) => {
            const {
                _id,
                productName,
                brand,
                category,
                purchaseDate,
                warrantyDuration,
                warrantyType,
                notes,
                shopName,
                shopPhone,
                shopAddress,
            } = formData;

            if (!_id && (!invoiceFiles || invoiceFiles.length === 0)) {
                await showInfoAlert(
                    "Invoice required",
                    "Please attach at least one invoice image when adding a new product."
                );
                throw new Error("Invoice is required for new products");
            }

            const payload = {
                productName,
                brand,
                category,
                purchaseDate,
                warrantyDuration,
                warrantyType,
                notes,
                shopName,
                shopPhone,
                shopAddress,
            };

            let product;

            if (!_id) {
                const res = await axiosSecure.post("/api/products", payload);
                product = res.data;
            } else {
                const res = await axiosSecure.put(`/api/products/${_id}`, payload);
                product = res.data;
            }

            if (invoiceFiles && invoiceFiles.length > 0) {
                // Upload all images to ImageBB
                const uploadPromises = invoiceFiles.map(file => uploadImageToImgBB(file));
                const storageUrls = await Promise.all(uploadPromises);

                // Prepare images array
                const images = invoiceFiles.map((file, index) => ({
                    fileName: file.name,
                    fileType: "image",
                    mimeType: file.type,
                    fileSize: file.size,
                    storageUrl: storageUrls[index],
                    storageProvider: "imgbb",
                }));

                await axiosSecure.post("/api/invoices", {
                    productId: product._id,
                    images,
                });
            }

            return product;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["products"]);
        },
    });

    const deleteProductMutation = useMutation({
        mutationFn: async (id) => {
            await axiosSecure.delete(`/api/products/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["products"]);
        },
    });

    const handleOpenCreate = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleDelete = async (product) => {
        try {
            const result = await showConfirmAlert(
                "Delete product?",
                `Are you sure you want to delete "${product.productName}"? This action cannot be undone.`,
                "Yes, Delete",
                "Cancel"
            );

            if (!result.isConfirmed) {
                return;
            }

            await deleteProductMutation.mutateAsync(product._id);
            await showTimedSuccessAlert(
                "Product deleted",
                `"${product.productName}" has been removed from your inventory.`
            );
        } catch (error) {
            console.error(error);
            const message = getAuthErrorMessage(error, "deleting the product");
            await showErrorAlert("Delete failed", message);
        }
    };

    const handleSubmitForm = async (formValues, invoiceFiles) => {
        try {
            if (editingProduct) {
                const result = await showConfirmAlert(
                    "Save changes?",
                    `Are you sure you want to update "${editingProduct.productName}"?`,
                    "Yes, Save",
                    "Cancel"
                );

                if (!result.isConfirmed) {
                    return;
                }
            }

            await upsertProductMutation.mutateAsync({
                formData: formValues,
                invoiceFiles,
            });
            setIsFormOpen(false);
            await showTimedSuccessAlert(
                editingProduct ? "Product updated" : "Product added",
                editingProduct
                    ? "Your product has been updated successfully."
                    : "Your product has been added successfully."
            );
        } catch (error) {
            if (error.message === "Invoice is required for new products") return;
            console.error(error);
            const action = editingProduct ? "updating the product" : "creating the product";
            const message = getAuthErrorMessage(error, action);
            await showErrorAlert("Save failed", message);
        }
    };

    const handleViewInvoice = (product) => {
        setViewingInvoice(product);
    };

    // Filter and search products
    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter((product) => {
                const productName = (product.productName || "").toLowerCase();
                const brand = (product.brand || "").toLowerCase();
                const category = (product.category || "").toLowerCase();
                const status = (product.status || "").toLowerCase();
                const emailSent = product.expiringSoonEmailSentAt ? "sent" : "not sent";
                
                return (
                    productName.includes(query) ||
                    brand.includes(query) ||
                    category.includes(query) ||
                    status.includes(query) ||
                    emailSent.includes(query)
                );
            });
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter((product) => product.status === statusFilter);
        }

        // Email sent filter
        if (emailSentFilter !== "all") {
            if (emailSentFilter === "sent") {
                filtered = filtered.filter((product) => Boolean(product.expiringSoonEmailSentAt));
            } else if (emailSentFilter === "not-sent") {
                filtered = filtered.filter((product) => !Boolean(product.expiringSoonEmailSentAt));
            }
        }

        return filtered;
    }, [products, searchQuery, statusFilter, emailSentFilter]);

    const hasActiveFilters = searchQuery.trim() || statusFilter !== "all" || emailSentFilter !== "all";

    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
        setEmailSentFilter("all");
    };

    return (
        <div className="space-y-6 w-full">
            {/* Header: Reduced font and padding */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 px-1">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 mb-0.5 uppercase tracking-tight">Products</h1>
                    <p className="text-xs text-slate-500 font-medium">
                        Manage your product warranties and digital invoices in one place.
                    </p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tight shadow-sm active:scale-95 transition-all whitespace-nowrap"
                    type="button"
                >
                    <Plus size={16} />
                    Add Product
                </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white border border-slate-200 rounded-sm p-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                    {/* Search Bar - Left */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by product name, brand, category, status, or email sent status..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-slate-200 focus:border-slate-900 focus:ring-0 outline-none text-sm text-slate-700 placeholder:text-slate-400"
                        />
                    </div>

                    {/* Filters - Right */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Filter className="text-slate-500" size={16} />
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Filters:</span>
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-1.5 rounded-sm border border-slate-200 focus:border-slate-900 outline-none text-xs text-slate-700 bg-white font-medium"
                        >
                            <option value="all">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Expiring Soon">Expiring Soon</option>
                            <option value="Expired">Expired</option>
                        </select>

                        {/* Email Sent Filter */}
                        <select
                            value={emailSentFilter}
                            onChange={(e) => setEmailSentFilter(e.target.value)}
                            className="px-3 py-1.5 rounded-sm border border-slate-200 focus:border-slate-900 outline-none text-xs text-slate-700 bg-white font-medium"
                        >
                            <option value="all">All Email Status</option>
                            <option value="sent">Email Sent</option>
                            <option value="not-sent">Email Not Sent</option>
                        </select>

                        {/* Clear Filters Button */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-600 transition-colors"
                                type="button"
                            >
                                <X size={14} />
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Results Count */}
                {hasActiveFilters && (
                    <div className="text-xs text-slate-500 font-medium mt-3">
                        Showing {filteredProducts.length} of {products.length} products
                    </div>
                )}
            </div>

            {/* Main Table Container: Strict 4-sided grid */}
            <div className="bg-white overflow-hidden shadow-sm border border-slate-200 rounded-sm">
                {/* Section Header: Compact */}
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-2">
                        <PackageSearch className="text-emerald-600" size={18} />
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Active Inventory</h2>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 py-1 border border-slate-200 shadow-sm">
                        {filteredProducts.length} Items
                    </span>
                </div>

                {/* Table Surface: p-0 to allow internal grid lines to touch edges */}
                <div className="p-0 overflow-x-auto text-[13px]">
                    <WarrantyList
                        warranties={filteredProducts}
                        loading={isLoading}
                        onAdd={handleOpenCreate}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onViewInvoice={handleViewInvoice}
                    />
                </div>
            </div>

            {/* Modals */}
            {isFormOpen && (
                <WarrantyForm
                    initialData={editingProduct}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleSubmitForm}
                    submitting={upsertProductMutation.isPending}
                />
            )}

            {viewingInvoice && (
                <InvoiceModal
                    productId={viewingInvoice._id}
                    productName={viewingInvoice.productName}
                    onClose={() => setViewingInvoice(null)}
                />
            )}
        </div>
    );
};

export default Products;