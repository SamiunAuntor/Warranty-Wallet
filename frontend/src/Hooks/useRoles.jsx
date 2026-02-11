import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";
import useAuth from "./useAuth";

const useRoles = () => {
    const { user } = useAuth();
    const axiosSecure = useAxios();

    const { data, isLoading } = useQuery({
        queryKey: ["user-role", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get("/api/users/me");
            return res.data;
        },
    });

    const role = data?.role || "user";
    const status = data?.status || "active";

    const isAdmin = role === "admin";
    const isUser = role === "user";

    const hasRole = (...roles) => roles.includes(role);

    return {
        role,
        status,
        isAdmin,
        isUser,
        isLoading,
        hasRole,
    };
};

export default useRoles;



