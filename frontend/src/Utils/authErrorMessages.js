export const getAuthErrorMessage = (error, action = "completing the request") => {
  const code = error?.code || "";

  if (code.includes("email-already-in-use")) {
    return "An account already exists with this email. Try logging in instead.";
  }

  if (code.includes("invalid-credential") || code.includes("wrong-password")) {
    return "The email or password you entered is incorrect. Please try again.";
  }

  if (code.includes("user-not-found")) {
    return "We couldn't find an account with that email address.";
  }

  if (code.includes("too-many-requests")) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  if (code.includes("popup-closed-by-user")) {
    return "The sign-in window was closed before finishing. Please try again.";
  }

  if (code.includes("network-request-failed")) {
    return "Network error. Please check your internet connection and try again.";
  }

  return `Something went wrong while ${action}. Please try again in a moment.`;
};



