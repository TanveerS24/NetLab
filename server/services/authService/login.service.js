import User from "../../models/user.model.js";
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
                message: "User not found",
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