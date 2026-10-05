import jwt from "jsonwebtoken";


const Logout = (req, res) => {
    try {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.status(200).json({
            message: "Logged out successfully",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to log out",
            success: false,
            error: error.message
        })
    }
}


export default Logout;