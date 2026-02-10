import Swal from "sweetalert2";

const baseConfig = {
  confirmButtonColor: "#059669", // emerald-600
  cancelButtonColor: "#e11d48", // rose-600
  customClass: {
    popup: "rounded-3xl",
    confirmButton: "px-5 py-2 font-bold",
    cancelButton: "px-5 py-2 font-bold",
  },
};

// Modal alerts (used mainly for errors/info while staying on the same page)
export const showSuccessAlert = (title, text) => {
  return Swal.fire({
    ...baseConfig,
    icon: "success",
    title,
    text,
  });
};

export const showErrorAlert = (title, text) => {
  return Swal.fire({
    ...baseConfig,
    icon: "error",
    title,
    text,
  });
};

export const showInfoAlert = (title, text) => {
  return Swal.fire({
    ...baseConfig,
    icon: "info",
    title,
    text,
  });
};

// Confirmation alert (returns promise with isConfirmed)
export const showConfirmAlert = (title, text, confirmText = "Yes", cancelText = "Cancel") => {
  return Swal.fire({
    ...baseConfig,
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
  });
};

// Toasts (non-blocking) shown AFTER navigation
const TOAST_KEY = "ww_pending_toast";

export const queueSuccessToast = (title, text) => {
  const payload = { type: "success", title, text };
  sessionStorage.setItem(TOAST_KEY, JSON.stringify(payload));
};

export const queueInfoToast = (title, text) => {
  const payload = { type: "info", title, text };
  sessionStorage.setItem(TOAST_KEY, JSON.stringify(payload));
};

export const queueErrorToast = (title, text) => {
  const payload = { type: "error", title, text };
  sessionStorage.setItem(TOAST_KEY, JSON.stringify(payload));
};

export const showQueuedToastIfAny = () => {
  const raw = sessionStorage.getItem(TOAST_KEY);
  if (!raw) return;

  sessionStorage.removeItem(TOAST_KEY);

  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return;
  }

  const { type = "success", title, text } = data || {};

  return Swal.fire({
    toast: true,
    position: "top-end",
    icon: type,
    title,
    text,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: "rounded-2xl shadow-lg",
      title: "text-sm font-semibold",
    },
  });
};

