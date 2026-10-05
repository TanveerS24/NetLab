import jwt from "jsonwebtoken";

const AuthMiddleWare = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
                success: false
            })
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({
            message: "Invalid access token",
            success: false,
            error: error.message
        })
    }
}

export default AuthMiddleWare;