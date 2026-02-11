import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, PackageSearch } from "lucide-react";
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

    const { data: products = [], isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/products");
            return res.data;
        },
        enabled: !!user,
    });

    const upsertProductMutation = useMutation({
        mutationFn: async ({ formData, invoiceFile }) => {
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

            if (!_id && !invoiceFile) {
                await showInfoAlert(
                    "Invoice required",
                    "Please attach an invoice image when adding a new product."
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

            if (invoiceFile) {
                const storageUrl = await uploadImageToImgBB(invoiceFile);
                await axiosSecure.post("/api/invoices", {
                    productId: product._id,
                    fileName: invoiceFile.name,
                    fileType: "image",
                    mimeType: invoiceFile.type,
                    fileSize: invoiceFile.size,
                    storageUrl,
                    storageProvider: "imgbb",
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

    const handleSubmitForm = async (formValues, invoiceFile) => {
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
                invoiceFile,
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

            {/* Main Table Container: Strict 4-sided grid */}
            <div className="bg-white overflow-hidden shadow-sm border border-slate-200 rounded-sm">
                {/* Section Header: Compact */}
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-2">
                        <PackageSearch className="text-emerald-600" size={18} />
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Active Inventory</h2>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 py-1 border border-slate-200 shadow-sm">
                        {products.length} Items
                    </span>
                </div>

                {/* Table Surface: p-0 to allow internal grid lines to touch edges */}
                <div className="p-0 overflow-x-auto text-[13px]">
                    <WarrantyList
                        warranties={products}
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