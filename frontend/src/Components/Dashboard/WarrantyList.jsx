import React from "react";
import { Plus, Edit2, Trash2, FileText } from "lucide-react";

const STATUS_COLORS = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Expiring Soon": "bg-amber-50 text-amber-700 border-amber-200",
  Expired: "bg-rose-50 text-rose-700 border-rose-200",
};

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const WarrantyList = ({ warranties, loading, onAdd, onEdit, onDelete, onViewInvoice }) => {
  if (loading) {
    return (
      <p className="text-slate-400 text-sm py-10 text-center">
        Loading products &amp; warranties...
      </p>
    );
  }

  if (!warranties || warranties.length === 0) {
    return (
      <div className="text-center py-10 text-slate-400 text-sm">
        <p className="font-semibold mb-2">No products yet</p>
        <p className="mb-4">
          Add your first product with warranty to get started.
        </p>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-2xl text-sm font-bold shadow-md active:scale-95 transition-all"
          type="button"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 text-xs uppercase tracking-[0.16em] border-b-2 border-slate-200">
            <th className="py-3 px-4 font-bold">Product Name</th>
            <th className="py-3 px-4 font-bold">Brand</th>
            <th className="py-3 px-4 font-bold">Category</th>
            <th className="py-3 px-4 font-bold">Purchase Date</th>
            <th className="py-3 px-4 font-bold">Warranty Duration</th>
            <th className="py-3 px-4 font-bold">Warranty Type</th>
            <th className="py-3 px-4 font-bold">Expiry Date</th>
            <th className="py-3 px-4 font-bold">Status</th>
            <th className="py-3 px-4 font-bold">Service Center</th>
            <th className="py-3 px-4 font-bold">Notes</th>
            <th className="py-3 px-4 font-bold">Invoice</th>
            <th className="py-3 px-4 font-bold">Created</th>
            <th className="py-3 px-4 font-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {warranties.map((product) => {
            const statusStyle =
              STATUS_COLORS[product.status] ||
              "bg-slate-50 text-slate-700 border border-slate-200";

            return (
              <tr
                key={product._id}
                className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
              >
                <td className="py-3 px-4">
                  <p className="font-bold text-slate-900">{product.productName || "N/A"}</p>
                </td>
                <td className="py-3 px-4 text-slate-700">{product.brand || "N/A"}</td>
                <td className="py-3 px-4 text-slate-700">{product.category || "N/A"}</td>
                <td className="py-3 px-4 text-slate-600">
                  {formatDate(product.purchaseDate)}
                </td>
                <td className="py-3 px-4 text-slate-600">
                  {product.warrantyDuration ? `${product.warrantyDuration} months` : "N/A"}
                </td>
                <td className="py-3 px-4 text-slate-600">
                  {product.warrantyType || "N/A"}
                </td>
                <td className="py-3 px-4 text-slate-600">
                  {formatDate(product.expiryDate)}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusStyle}`}
                  >
                    {product.status || "Unknown"}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600 max-w-[200px]">
                  {product.serviceCenterName ? (
                    <div className="text-xs">
                      <p className="font-semibold truncate">{product.serviceCenterName}</p>
                      {product.serviceCenterPhone && (
                        <p className="text-slate-500 truncate">{product.serviceCenterPhone}</p>
                      )}
                      {product.serviceCenterAddress && (
                        <p className="text-slate-400 truncate">{product.serviceCenterAddress}</p>
                      )}
                    </div>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="py-3 px-4 text-slate-600 max-w-[200px]">
                  {product.notes ? (
                    <p className="text-xs truncate" title={product.notes}>
                      {product.notes}
                    </p>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="py-3 px-4">
                  {product.invoiceId ? (
                    <button
                      onClick={() => onViewInvoice && onViewInvoice(product)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                      title="View invoice"
                      type="button"
                    >
                      <FileText size={12} />
                      View
                    </button>
                  ) : (
                    <span className="text-slate-400 text-xs">No invoice</span>
                  )}
                </td>
                <td className="py-3 px-4 text-slate-500 text-xs">
                  {formatDateTime(product.createdAt)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit && onEdit(product)}
                      className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                      title="Edit product"
                      type="button"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(product)}
                      className="p-1.5 rounded-full hover:bg-rose-50 text-rose-500 hover:text-rose-700 transition-colors"
                      title="Delete product"
                      type="button"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default WarrantyList;
