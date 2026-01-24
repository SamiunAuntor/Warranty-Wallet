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
    console.error("❌ ImgBB API key is not configured. Please add VITE_IMGBB_KEY to your .env file");
    throw new Error("ImgBB API key is not configured. Please check your environment variables.");
  }

  // Validate file
  if (!imageFile) {
    throw new Error("No image file provided");
  }

  // Check file size (ImgBB free tier limit is 32MB, but we'll limit to 5MB)
  if (imageFile.size > 5 * 1024 * 1024) {
    throw new Error("Image size must be less than 5MB");
  }

  // Check file type
  if (!imageFile.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;

    console.log("Uploading image to ImgBB...", {
      fileName: imageFile.name,
      fileSize: imageFile.size,
      fileType: imageFile.type
    });

    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    // Check if response is OK
    if (!res.ok) {
      const errorText = await res.text();
      console.error("ImgBB API error response:", {
        status: res.status,
        statusText: res.statusText,
        body: errorText
      });
      throw new Error(`ImgBB API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // Log response for debugging
    console.log("ImgBB API response:", {
      success: data.success,
      hasData: !!data.data,
      error: data.error
    });

    if (data.success && data.data && data.data.url) {
      console.log("✅ Image uploaded successfully:", data.data.url);
      return data.data.url;
    } else {
      // Handle ImgBB API error response
      const errorMessage = data.error?.message || data.error?.code || "Image upload failed";
      console.error("ImgBB upload failed:", {
        error: data.error,
        message: errorMessage
      });
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Error uploading image to ImgBB:", error);
    
    // Provide more specific error messages
    if (error.message.includes("network") || error.message.includes("fetch")) {
      throw new Error("Network error. Please check your internet connection and try again.");
    } else if (error.message.includes("API key")) {
      throw new Error("Invalid API key. Please check your ImgBB configuration.");
    } else {
      throw error;
    }
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

