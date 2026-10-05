import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";

const RefreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
                success: false
            })
        }

        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decoded.user_id);

        if (!user || !user.refreshToken) {
            return res.status(401).json({
                message: "Unauthorized",
                success: false
            })
        }

        const isRefreshTokenValid = await bcrypt.compare(token, user.refreshToken);

        if (!isRefreshTokenValid) {
            return res.status(401).json({
                message: "Unauthorized",
                success: false
            })
        }

        const newAccessToken = jwt.sign(
            {
                user_id: user._id
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m"
            }
        )

        const newRefreshToken = jwt.sign(
            {
                user_id: user._id
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: "7d"
            }
        )

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        })
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const hashedToken = await bcrypt.hash(newRefreshToken, 10);
        await User.findByIdAndUpdate(user._id, {
            refreshToken: hashedToken
        });

        return res.status(200).json({
            message: "Tokens refreshed successfully",
            success: true
        })
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired refresh token",
            success: false,
            error: error.message
        })
    }
}


export default RefreshToken;