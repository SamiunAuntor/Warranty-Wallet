import React, { useState } from "react";

const defaultFormState = {
  _id: null,
  productName: "",
  brand: "",
  category: "",
  purchaseDate: "",
  warrantyDuration: 12,
  warrantyType: "Manufacturer",
  notes: "",
  serviceCenterName: "",
  serviceCenterPhone: "",
  serviceCenterAddress: "",
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
      serviceCenterName: initialData.serviceCenterName || "",
      serviceCenterPhone: initialData.serviceCenterPhone || "",
      serviceCenterAddress: initialData.serviceCenterAddress || "",
    };
  });

  const [invoiceFile, setInvoiceFile] = useState(null);

  const handleChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formValues, invoiceFile);
  };

  const isEdit = Boolean(formValues._id);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              {isEdit ? "Edit Product & Warranty" : "Add New Product"}
            </h3>
            <p className="text-xs text-slate-500">
              Store your product details along with its warranty information.
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

        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 space-y-5 max-h-[75vh] overflow-y-auto"
        >
          {/* Product Details */}
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-3 ml-1">
              Product Details
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formValues.productName}
                  onChange={(e) => handleChange("productName", e.target.value)}
                  placeholder="Samsung 55-inch QLED TV"
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-100 focus:border-emerald-600 outline-none text-sm text-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                  Brand <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formValues.brand}
                  onChange={(e) => handleChange("brand", e.target.value)}
                  placeholder="Samsung"
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-100 focus:border-emerald-600 outline-none text-sm text-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formValues.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-100 focus:border-emerald-600 outline-none text-sm text-slate-700 bg-white"
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

          {/* Warranty Details */}
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-3 ml-1">
              Warranty Details
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                  Purchase Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formValues.purchaseDate}
                  onChange={(e) => handleChange("purchaseDate", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-100 focus:border-emerald-600 outline-none text-sm text-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                  Warranty Duration (months) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={formValues.warrantyDuration}
                  onChange={(e) => handleChange("warrantyDuration", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-100 focus:border-emerald-600 outline-none text-sm text-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                  Warranty Type
                </label>
                <select
                  value={formValues.warrantyType}
                  onChange={(e) => handleChange("warrantyType", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-100 focus:border-emerald-600 outline-none text-sm text-slate-700 bg-white"
                >
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Extended">Extended</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                  Invoice Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setInvoiceFile(file);
                  }}
                  className="w-full text-sm text-slate-600 file:mr-3 file:py-2.5 file:px-4 file:rounded-2xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                <p className="text-[11px] text-slate-400 mt-1 ml-1">
                  Upload a clear photo or screenshot of your purchase invoice.
                </p>
              </div>
            </div>
          </div>

          {/* Service & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                Notes
              </label>
              <textarea
                value={formValues.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Any important details you want to remember for this product or its warranty."
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-100 focus:border-emerald-600 outline-none text-sm text-slate-700 min-h-[80px]"
              />
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                  Service Center Name
                </label>
                <input
                  type="text"
                  value={formValues.serviceCenterName}
                  onChange={(e) => handleChange("serviceCenterName", e.target.value)}
                  placeholder="Samsung Service Center"
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-100 focus:border-emerald-600 outline-none text-sm text-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                  Service Center Phone
                </label>
                <input
                  type="text"
                  value={formValues.serviceCenterPhone}
                  onChange={(e) => handleChange("serviceCenterPhone", e.target.value)}
                  placeholder="+1 234 567 890"
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-100 focus:border-emerald-600 outline-none text-sm text-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                  Service Center Address
                </label>
                <input
                  type="text"
                  value={formValues.serviceCenterAddress}
                  onChange={(e) => handleChange("serviceCenterAddress", e.target.value)}
                  placeholder="123 Service St, City"
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-100 focus:border-emerald-600 outline-none text-sm text-slate-700"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-sm font-bold text-slate-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-sm font-bold text-white shadow-md active:scale-95 transition-all"
            >
              {submitting ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WarrantyForm;
