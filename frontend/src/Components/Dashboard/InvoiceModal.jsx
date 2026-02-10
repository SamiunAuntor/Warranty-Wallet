import React, { useState, useEffect } from "react";
import { Download, X, Loader2, FileText, ImageIcon } from "lucide-react";
import useAxios from "../../Hooks/useAxios";
import { showErrorAlert } from "../../Utils/alerts";

const InvoiceModal = ({ productId, productName, onClose }) => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const axiosSecure = useAxios();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/api/invoices/product/${productId}`);
        setInvoice(res.data);
      } catch (error) {
        console.error("Error fetching invoice:", error);
        await showErrorAlert(
          "Failed to load invoice",
          "Could not retrieve the invoice image. Please try again."
        );
        onClose();
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchInvoice();
    }
  }, [productId, axiosSecure, onClose]);

  const handleDownload = async () => {
    if (!invoice?.storageUrl) return;

    try {
      setDownloading(true);
      const response = await fetch(invoice.storageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = invoice.fileName || `invoice-${productName || "product"}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      await showErrorAlert(
        "Download failed",
        "Could not download the invoice image. Please try again."
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container: w-11/12 on mobile, max-4xl on desktop */}
      <div className="relative w-11/12 sm:w-full max-w-3xl bg-white border border-slate-200 flex flex-col max-h-[90vh] rounded-md text-[10px] font-black uppercase overflow-hidden shadow-2xl">

        {/* Header - Sharp & Technical */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-1.5 rounded-md">
              <FileText className="text-white" size={16} />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight leading-none">
                Invoice Preview
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate max-w-[150px] sm:max-w-none">
                {productName || "Document"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-900 transition-colors"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="animate-spin text-slate-900" size={28} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Loading Image...
              </span>
            </div>
          ) : invoice?.storageUrl ? (
            <div className="flex justify-center">
              {/* Image Frame with minimal border */}
              <div className="bg-white border border-slate-200 p-1 shadow-sm">
                <img
                  src={invoice.storageUrl}
                  alt="Invoice"
                  className="w-full h-auto object-contain block"
                  style={{ maxHeight: '65vh' }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ImageIcon className="text-slate-200 mb-2" size={40} />
              <p className="text-slate-900 font-black uppercase text-xs">No File Found</p>
            </div>
          )}
        </div>

        {/* Footer / Control Bar */}
        {!loading && invoice?.storageUrl && (
          <div className="px-4 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="text-[10px] font-black text-slate-900 truncate max-w-[250px] uppercase tracking-tight">
                {invoice.fileName}
              </span>
              {invoice.fileSize && (
                <span className="text-[9px] font-bold text-slate-400 uppercase">
                  {(invoice.fileSize / 1024).toFixed(2)} KB • PNG/JPG
                </span>
              )}
            </div>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white px-6 py-2 rounded-md text-[11px] font-black uppercase tracking-widest transition-all active:scale-95"
              type="button"
            >
              {downloading ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <Download size={14} />
              )}
              {downloading ? "Downloading" : "Download Invoice"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceModal;