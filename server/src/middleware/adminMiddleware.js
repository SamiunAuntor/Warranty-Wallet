const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === "ADMIN") {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: "Admin access required"
        });
    }
};

export default adminMiddleware;
