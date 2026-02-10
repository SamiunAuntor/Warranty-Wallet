export const uploadImageToImgBB = async (imageFile) => {
    const apiKey = import.meta.env.VITE_IMGBB_KEY;

    if (!apiKey) {
        throw new Error("Image upload key is not configured. Please set VITE_IMGBB_KEY in your .env file.");
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
        throw new Error("Image upload failed");
    }
};
