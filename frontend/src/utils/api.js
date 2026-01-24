const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Get auth token helper
const getAuthToken = async (user) => {
  if (!user) {
    throw new Error("User not authenticated");
  }
  return await user.getIdToken();
};

// Upload image to ImgBB
export const uploadImageToImgBB = async (imageFile) => {
  const apiKey = import.meta.env.VITE_IMGBB_KEY;
  
  if (!apiKey) {
    throw new Error("ImgBB API key is not configured");
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (data.success) {
    return data.data.url;
  } else {
    throw new Error(data.error?.message || "Image upload failed");
  }
};

// Register user in MongoDB
export const registerUserInDB = async (user, photoURLOverride = null) => {
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
        photoURL: photoURLOverride || user.photoURL,
        email: user.email,
        providerId: user.providerData?.[0]?.providerId || "password",
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

