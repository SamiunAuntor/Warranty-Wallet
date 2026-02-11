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
  <div className="flex flex-col gap-0.5">
    <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
      {label}
    </span>
    <span className="text-sm font-medium text-slate-900 break-words">{value || "—"}</span>
  </div>
);

const ProductDetailsModal = ({ product, onClose, onViewInvoice }) => {
  if (!product) return null;

  const emailSent = Boolean(product.expiringSoonEmailSentAt);

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-white rounded-[24px] shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between gap-3 bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-black text-slate-900">
                {product.productName || "Product details"}
              </h3>
              {product.status && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide bg-slate-100 text-slate-700">
                  {product.status}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Full warranty & product information at a glance.
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Close"
            type="button"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Core product & warranty info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Product Name" value={product.productName} />
            <InfoRow label="Brand" value={product.brand} />
            <InfoRow label="Category" value={product.category} />
            <InfoRow label="Purchase Date" value={formatDate(product.purchaseDate)} />
            <InfoRow
              label="Warranty Duration"
              value={product.warrantyDuration ? `${product.warrantyDuration} months` : "N/A"}
            />
            <InfoRow label="Warranty Type" value={product.warrantyType} />
            <InfoRow label="Expiry Date" value={formatDate(product.expiryDate)} />
            <InfoRow
              label="Created At"
              value={formatDateTime(product.createdAt)}
            />
          </div>

          {/* Shop & notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
            <InfoRow label="Shop / Seller Name" value={product.shopName || product.serviceCenterName} />
            <InfoRow label="Shop / Seller Phone" value={product.shopPhone || product.serviceCenterPhone} />
            <InfoRow label="Shop / Seller Address" value={product.shopAddress || product.serviceCenterAddress} />
            <InfoRow label="Internal Notes" value={product.notes} />
          </div>

          {/* Reminder / email & invoice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                Reminder Email
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                    emailSent
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-50 text-slate-500 border border-dashed border-slate-300"
                  }`}
                >
                  {emailSent ? "Sent" : "Not Sent"}
                </span>
                {emailSent && (
                  <span className="text-[11px] text-slate-500">
                    {formatDateTime(product.expiringSoonEmailSentAt)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                Invoice
              </span>
              {product.invoiceId ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-bold text-blue-700 uppercase">
                    Available
                  </span>
                  {onViewInvoice && (
                    <button
                      type="button"
                      onClick={() => {
                        onViewInvoice(product);
                      }}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      View Invoice
                    </button>
                  )}
                </div>
              ) : (
                <span className="text-[13px] text-slate-500">No invoice uploaded yet.</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;


