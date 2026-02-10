import React, { useState, useEffect } from "react";
import { Download, X, Loader2 } from "lucide-react";
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
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden m-4">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">Invoice</h3>
            <p className="text-xs text-slate-500">
              {productName || "Product Invoice"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xl font-bold px-2"
            type="button"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-emerald-600" size={32} />
            </div>
          ) : invoice?.storageUrl ? (
            <div className="space-y-4">
              <div className="relative bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
                <img
                  src={invoice.storageUrl}
                  alt="Invoice"
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  <p className="font-semibold">{invoice.fileName}</p>
                  {invoice.fileSize && (
                    <p className="text-xs text-slate-400">
                      {(invoice.fileSize / 1024).toFixed(2)} KB
                    </p>
                  )}
                </div>
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-4 py-2.5 rounded-2xl text-sm font-bold shadow-md active:scale-95 transition-all"
                  type="button"
                >
                  {downloading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      Download
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <p className="font-semibold mb-2">No invoice found</p>
              <p className="text-sm">
                The invoice image could not be loaded.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;

