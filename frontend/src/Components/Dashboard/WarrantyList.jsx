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
      <p className="text-slate-400 text-xs py-10 text-center uppercase tracking-widest font-medium">
        Loading products &amp; warranties...
      </p>
    );
  }

  if (!warranties || warranties.length === 0) {
    return (
      <div className="text-center py-10 text-slate-400 text-xs border border-slate-200 rounded-xl m-4">
        <p className="font-bold mb-1 text-slate-600 uppercase">No products yet</p>
        <p className="mb-4">Add your first product with warranty to get started.</p>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-black uppercase shadow-md active:scale-95 transition-all"
          type="button"
        >
          <Plus size={14} />
          Add Product
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-[13px] border-collapse bg-white">
        <thead>
          <tr className="text-left text-slate-500 bg-slate-50 uppercase tracking-wider">
            <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px]">Product Name</th>
            <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px]">Brand</th>
            <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px]">Category</th>
            <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px]">Purchase</th>
            <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px]">Warranty</th>
            <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px]">Type</th>
            <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px]">Expiry</th>
            <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px]">Status</th>
            <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px]">Service Center</th>
            <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px]">Notes</th>
            <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px]">Invoice</th>
            <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px]">Created</th>
            <th className="py-2.5 px-3 font-black border border-slate-200 text-[10px] text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="leading-tight">
          {warranties.map((product) => {
            const statusStyle =
              STATUS_COLORS[product.status] ||
              "bg-slate-50 text-slate-700 border border-slate-200";

            return (
              <tr
                key={product._id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="py-2 px-3 border border-slate-100">
                  <p className="font-bold text-slate-900 truncate max-w-[140px]">{product.productName || "N/A"}</p>
                </td>
                <td className="py-2 px-3 border border-slate-100 text-slate-700">{product.brand || "N/A"}</td>
                <td className="py-2 px-3 border border-slate-100 text-slate-700">{product.category || "N/A"}</td>
                <td className="py-2 px-3 border border-slate-100 text-slate-600 whitespace-nowrap">
                  {formatDate(product.purchaseDate)}
                </td>
                <td className="py-2 px-3 border border-slate-100 text-slate-600 whitespace-nowrap">
                  {product.warrantyDuration ? `${product.warrantyDuration} mo` : "N/A"}
                </td>
                <td className="py-2 px-3 border border-slate-100 text-slate-600 text-[11px] uppercase font-medium">
                  {product.warrantyType || "N/A"}
                </td>
                <td className="py-2 px-3 border border-slate-100 text-slate-600 font-semibold whitespace-nowrap">
                  {formatDate(product.expiryDate)}
                </td>
                <td className="py-2 px-3 border border-slate-100">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase border ${statusStyle}`}
                  >
                    {product.status || "Unknown"}
                  </span>
                </td>
                <td className="py-2 px-3 border border-slate-100 text-slate-600 max-w-[150px]">
                  {product.serviceCenterName ? (
                    <div className="text-[11px]">
                      <p className="font-bold truncate">{product.serviceCenterName}</p>
                      <p className="text-slate-400 truncate">{product.serviceCenterPhone}</p>
                    </div>
                  ) : (
                    <span className="text-slate-300">N/A</span>
                  )}
                </td>
                <td className="py-2 px-3 border border-slate-100 text-slate-600 max-w-[120px]">
                  <p className="text-[11px] truncate italic" title={product.notes}>
                    {product.notes || "---"}
                  </p>
                </td>
                <td className="py-2 px-3 border border-slate-100 text-center">
                  {product.invoiceId ? (
                    <button
                      onClick={() => onViewInvoice && onViewInvoice(product)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors uppercase"
                      type="button"
                    >
                      <FileText size={10} />
                      View
                    </button>
                  ) : (
                    <span className="text-slate-300 text-[10px]">None</span>
                  )}
                </td>
                <td className="py-2 px-3 border border-slate-100 text-slate-400 text-[10px] whitespace-nowrap">
                  {formatDateTime(product.createdAt)}
                </td>
                <td className="py-2 px-3 border border-slate-100">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => onEdit && onEdit(product)}
                      className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                      title="Edit"
                      type="button"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(product)}
                      className="p-1 rounded hover:bg-rose-50 text-rose-400 hover:text-rose-600 transition-colors"
                      title="Delete"
                      type="button"
                    >
                      <Trash2 size={14} />
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