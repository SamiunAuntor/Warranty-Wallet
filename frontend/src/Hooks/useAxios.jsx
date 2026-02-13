import axios from "axios";
import { getAuth } from "firebase/auth";
import app from "../Firebase/firebase.config";

// Create a single axios instance for the app
const baseURL =
    import.meta.env.VITE_API_BASE_URL || "https://warranty-wallet-server.vercel.app";

const axiosInstance = axios.create({
    baseURL,
});

// Attach Firebase ID token as bearer for secure API calls
axiosInstance.interceptors.request.use(async (config) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;
