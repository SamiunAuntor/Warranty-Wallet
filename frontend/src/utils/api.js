const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Get auth token helper
const getAuthToken = async (user) => {
  if (!user) {
    throw new Error("User not authenticated");
  }
  return await user.getIdToken();
};

// Register user in MongoDB
export const registerUserInDB = async (user) => {
  try {
    const token = await getAuthToken(user);
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
      // If user already exists, that's fine - return success
      if (response.status === 200) {
        return await response.json();
      }
      throw new Error(errorData.error || "Failed to register user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error registering user in DB:", error);
    // Don't throw - allow auth to continue even if DB sync fails
    return null;
  }
};

// Get user profile from MongoDB
export const getUserProfile = async (user) => {
  try {
    const token = await getAuthToken(user);
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Update user profile in MongoDB
export const updateUserProfile = async (user, updates) => {
  try {
    const token = await getAuthToken(user);
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update profile");
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

