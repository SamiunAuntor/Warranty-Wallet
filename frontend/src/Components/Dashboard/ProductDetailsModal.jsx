import React from "react";

const formatDate = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
      {label}
    </span>
    <span className="text-sm font-bold text-slate-900 break-words">
      {value || "—"}
    </span>
  </div>
);

const ProductDetailsModal = ({ product, onClose, onViewInvoice }) => {
  if (!product) return null;

  const emailSent = Boolean(product.expiringSoonEmailSentAt);

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container: Technical Style */}
      <div className="relative w-11/12 sm:w-full max-w-2xl bg-white rounded-sm shadow-2xl border border-slate-300 overflow-hidden">

        {/* Header - Matches WarrantyForm */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                {product.productName || "Product Specification"}
              </h3>
              {product.status && (
                <span className="bg-slate-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                  {product.status}
                </span>
              )}
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
              System record for asset verification
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 transition-colors text-xl font-light"
            type="button"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-6 space-y-8 max-h-[75vh] overflow-y-auto bg-white">

          {/* Section 01: Core Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="text-[10px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded-sm">01</span>
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                Primary Asset Data
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <InfoRow label="Product Name" value={product.productName} />
              <InfoRow label="Brand Identity" value={product.brand} />
              <InfoRow label="Classification" value={product.category} />
              <InfoRow label="Registry Date" value={formatDateTime(product.createdAt)} />
            </div>
          </div>

          {/* Section 02: Warranty & Timing */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="text-[10px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded-sm">02</span>
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                Warranty & Lifespan
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <InfoRow label="Purchase Date" value={formatDate(product.purchaseDate)} />
              <InfoRow
                label="Contract Terms"
                value={product.warrantyDuration ? `${product.warrantyDuration} Months (${product.warrantyType})` : "N/A"}
              />
              <InfoRow label="Expiration Deadline" value={formatDate(product.expiryDate)} />

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  System Notification
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-sm border uppercase ${emailSent
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-50 text-slate-400 border-slate-200 border-dashed"
                    }`}>
                    {emailSent ? "Alert Sent" : "No Alert"}
                  </span>
                  {emailSent && (
                    <span className="text-[10px] font-medium text-slate-500">
                      {formatDateTime(product.expiringSoonEmailSentAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 03: Support & Source */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="text-[10px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded-sm">03</span>
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                Vendor & Documentation
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <InfoRow label="Vendor Name" value={product.shopName || product.serviceCenterName} />
              <InfoRow label="Contact Reference" value={product.shopPhone || product.serviceCenterPhone} />
              <div className="md:col-span-2">
                <InfoRow label="Physical Address" value={product.shopAddress || product.serviceCenterAddress} />
              </div>
              <div className="md:col-span-2">
                <InfoRow label="Administrative Notes" value={product.notes} />
              </div>
            </div>

            {/* Document Action Block */}
            <div className="mt-2 p-3 border border-slate-200 bg-slate-50 rounded-sm flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">Verified Invoice</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold">
                  {product.invoiceId ? "Document Linked" : "No Document Uploaded"}
                </span>
              </div>
              {product.invoiceId && onViewInvoice && (
                <button
                  onClick={() => onViewInvoice(product)}
                  type="button"
                  className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase rounded-sm hover:bg-black transition-all active:scale-95"
                >
                  View Attachment
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="px-6 py-2 rounded-sm bg-white border border-slate-300 text-[11px] font-black uppercase text-slate-900 hover:bg-slate-100 transition-all active:scale-95"
          >
            Close Terminal
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;