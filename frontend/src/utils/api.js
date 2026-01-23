const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const registerUserInDB = async (user) => {
  try {
    const token = await user.getIdToken();
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        displayName: user.displayName,
        photoURL: user.photoURL,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to register user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error registering user in DB:", error);
    throw error;
  }
};

