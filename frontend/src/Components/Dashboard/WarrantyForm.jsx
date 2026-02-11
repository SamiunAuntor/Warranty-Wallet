import React, { useState, useEffect } from "react";
import { showInfoAlert } from "../../Utils/alerts";

const defaultFormState = {
  _id: null,
  productName: "",
  brand: "",
  category: "",
  purchaseDate: "",
  warrantyDuration: 12,
  warrantyType: "Manufacturer",
  notes: "",
  shopName: "",
  shopPhone: "",
  shopAddress: "",
};

const WarrantyForm = ({ initialData, onClose, onSubmit, submitting }) => {
  const [formValues, setFormValues] = useState(() => {
    if (!initialData) return defaultFormState;

    return {
      _id: initialData._id,
      productName: initialData.productName || "",
      brand: initialData.brand || "",
      category: initialData.category || "",
      purchaseDate: initialData.purchaseDate
        ? new Date(initialData.purchaseDate).toISOString().split("T")[0]
        : "",
      warrantyDuration: initialData.warrantyDuration || 12,
      warrantyType: initialData.warrantyType || "Manufacturer",
      notes: initialData.notes || "",
      shopName: initialData.shopName || initialData.serviceCenterName || "",
      shopPhone: initialData.shopPhone || initialData.serviceCenterPhone || "",
      shopAddress: initialData.shopAddress || initialData.serviceCenterAddress || "",
    };
  });

  const [invoiceFiles, setInvoiceFiles] = useState([]);

  // Reset invoice files when form mode changes (create vs edit)
  useEffect(() => {
    setInvoiceFiles([]);
  }, [initialData?._id]);

  const handleChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate invoice files for new products
    if (!isEdit && (!invoiceFiles || invoiceFiles.length === 0)) {
      await showInfoAlert(
        "Invoice required",
        "Please attach at least one invoice image when adding a new product."
      );
      return;
    }
    
    onSubmit(formValues, invoiceFiles);
  };

  const isEdit = Boolean(formValues._id);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container: Sharp corners & Mobile responsive width */}
      <div className="relative w-11/12 sm:w-full max-w-2xl bg-white rounded-sm shadow-2xl border border-slate-300 overflow-hidden">

        {/* Header - Technical Style */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
              {isEdit ? "Update Inventory Item" : "New Inventory Entry"}
            </h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
              Secure documentation for product warranty
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 transition-colors p-1"
            type="button"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-5 py-5 space-y-6 max-h-[80vh] overflow-y-auto bg-white"
        >
          {/* Section: Product Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="text-[10px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded-sm">01</span>
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                Product Information
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 ml-0.5">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formValues.productName}
                  onChange={(e) => handleChange("productName", e.target.value)}
                  placeholder="e.g. MacBook Pro M3"
                  className="w-full px-3 py-2 rounded-sm border border-slate-200 focus:border-slate-900 focus:ring-0 outline-none text-sm text-slate-700 transition-all placeholder:text-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 ml-0.5">
                  Brand <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formValues.brand}
                  onChange={(e) => handleChange("brand", e.target.value)}
                  placeholder="Apple"
                  className="w-full px-3 py-2 rounded-sm border border-slate-200 focus:border-slate-900 focus:ring-0 outline-none text-sm text-slate-700 placeholder:text-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 ml-0.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formValues.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full px-3 py-2 rounded-sm border border-slate-200 focus:border-slate-900 outline-none text-sm text-slate-700 bg-white"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Appliances">Appliances</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Vehicles">Vehicles</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Warranty & Finance */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="text-[10px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded-sm">02</span>
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                Warranty & Billing
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 ml-0.5">
                  Purchase Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={formValues.purchaseDate}
                  onChange={(e) => handleChange("purchaseDate", e.target.value)}
                  className="w-full px-3 py-2 rounded-sm border border-slate-200 focus:border-slate-900 outline-none text-sm text-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 ml-0.5">
                  Duration (Months) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={formValues.warrantyDuration}
                  onChange={(e) => handleChange("warrantyDuration", e.target.value)}
                  className="w-full px-3 py-2 rounded-sm border border-slate-200 focus:border-slate-900 outline-none text-sm text-slate-700"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 ml-0.5">
                  Invoice Images <span className="text-rose-500">*</span> <span className="text-slate-400 font-normal">(Max 4 images)</span>
                </label>
                <div className="mt-1 space-y-2">
                  <div className="flex items-center gap-4 p-3 border border-dashed border-slate-300 bg-slate-50 rounded-sm">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      id="invoice-file-input"
                      onChange={async (e) => {
                        const newFiles = Array.from(e.target.files || []);
                        if (newFiles.length === 0) return;
                        
                        // Calculate how many more files we can add
                        const currentCount = invoiceFiles.length;
                        const remainingSlots = 4 - currentCount;
                        
                        if (remainingSlots <= 0) {
                          await showInfoAlert(
                            "Maximum images reached",
                            "Maximum 4 images allowed. Please remove some images first."
                          );
                          e.target.value = ''; // Reset input
                          return;
                        }
                        
                        // Take only as many files as we have slots for
                        const filesToAdd = newFiles.slice(0, remainingSlots);
                        
                        // Append new files to existing array
                        const updatedFiles = [...invoiceFiles, ...filesToAdd];
                        setInvoiceFiles(updatedFiles);
                        
                        // Reset input so user can select more files
                        e.target.value = '';
                      }}
                      className="text-[11px] text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-slate-900 file:text-white hover:file:bg-black transition-all"
                    />
                  </div>
                  {invoiceFiles.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {invoiceFiles.map((file, index) => (
                          <div
                            key={`${file.name}-${index}`}
                            className="flex items-center gap-2 px-2 py-1 bg-white border border-slate-200 rounded-sm text-[10px]"
                          >
                            <span className="text-slate-700 truncate max-w-[150px]">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newFiles = invoiceFiles.filter((_, i) => i !== index);
                                setInvoiceFiles(newFiles);
                              }}
                              className="text-rose-500 hover:text-rose-700 font-bold"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-[9px] text-slate-500 font-medium">
                        {invoiceFiles.length} / 4 images selected
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Support Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="text-[10px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded-sm">03</span>
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                Shop / Seller Info
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={formValues.shopName}
                onChange={(e) => handleChange("shopName", e.target.value)}
                placeholder="Shop / Seller Name"
                className="w-full px-3 py-2 rounded-sm border border-slate-200 focus:border-slate-900 outline-none text-sm text-slate-700"
              />
              <input
                type="text"
                value={formValues.shopPhone}
                onChange={(e) => handleChange("shopPhone", e.target.value)}
                placeholder="Shop / Seller Phone"
                className="w-full px-3 py-2 rounded-sm border border-slate-200 focus:border-slate-900 outline-none text-sm text-slate-700"
              />
              <input
                type="text"
                value={formValues.shopAddress}
                onChange={(e) => handleChange("shopAddress", e.target.value)}
                placeholder="Shop / Seller Address"
                className="md:col-span-2 w-full px-3 py-2 rounded-sm border border-slate-200 focus:border-slate-900 outline-none text-sm text-slate-700"
              />
              <textarea
                value={formValues.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Internal notes regarding this item..."
                className="md:col-span-2 w-full px-3 py-2 rounded-sm border border-slate-200 focus:border-slate-900 outline-none text-sm text-slate-700 min-h-[60px]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-sm bg-white border border-slate-200 text-[11px] font-black uppercase text-slate-500 hover:bg-slate-50 transition-all"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-sm bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-[11px] font-black uppercase text-white shadow-sm active:scale-95 transition-all"
            >
              {submitting ? "Processing..." : isEdit ? "Update Entry" : "Finalize Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WarrantyForm;