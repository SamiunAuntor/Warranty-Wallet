import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import useAxios from "../Hooks/useAxios";
import { uploadImageToImgBB } from "../Utils/UploadImage";
import { showErrorAlert, showInfoAlert, showConfirmAlert, queueSuccessToast, queueErrorToast } from "../Utils/alerts";
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
                serviceCenterName,
                serviceCenterPhone,
                serviceCenterAddress,
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
                serviceCenterName,
                serviceCenterPhone,
                serviceCenterAddress,
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
            queueSuccessToast("Product deleted", `"${product.productName}" has been removed.`);
        } catch (error) {
            console.error(error);
            const message = getAuthErrorMessage(error, "deleting the product");
            queueErrorToast("Delete failed", message);
        }
    };

    const handleSubmitForm = async (formValues, invoiceFile) => {
        try {
            // Show confirmation only when editing
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
            queueSuccessToast(
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
            queueErrorToast("Save failed", message);
        }
    };

    const handleViewInvoice = (product) => {
        setViewingInvoice(product);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-1">Products</h1>
                    <p className="text-slate-600">
                        Register your products with warranty details and invoices.
                    </p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-2xl text-sm font-bold shadow-md active:scale-95 transition-all"
                    type="button"
                >
                    <Plus size={18} />
                    Add Product
                </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-black text-slate-900">All Products</h2>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-[0.16em]">
                        {products.length} item{products.length !== 1 ? "s" : ""}
                    </p>
                </div>

                <WarrantyList
                    warranties={products}
                    loading={isLoading}
                    onAdd={handleOpenCreate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onViewInvoice={handleViewInvoice}
                />
            </div>

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


