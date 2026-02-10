import axios from "axios";

// Create a single axios instance for the app
const baseURL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const axiosInstance = axios.create({
    baseURL,
});

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;
