import crypto from "crypto";
import User from "../../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const Login = async (req, res) => {
    try {
        const { identifier, password } = req.body || {};

        if (!identifier || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            })
        }
        const ExistingUser = await User.findOne({
            $or: [
                { username: identifier },
                { email: identifier }
            ]
        })

        if (!ExistingUser) {
            return res.status(404).json({
                message: "Invalid Credentials",
                success: false
            })
        }

        const isPasswordValid = await bcrypt.compare(password, ExistingUser.password);
        console.log("Verification done")
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials",
                success: false
            })
        }

        const accessToken = jwt.sign(
            {
                user_id: ExistingUser._id
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m"
            }
        )

        const refreshToken = jwt.sign(
            {
                user_id: ExistingUser._id
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: "7d"
            }
        )

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        })

        const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
        await User.findByIdAndUpdate(ExistingUser._id, {
            refreshToken: hashedToken
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            message: "Logged in successfully",
            success: true
        })
    } catch (error) {
        console.log("Error logging in user: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

export default Login;