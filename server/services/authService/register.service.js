import User from "../../models/user.model.js";
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const existingUser = await User.findOne({
            $or: [
                { email },
                { username }
            ]
        });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        if (newUser) {
            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                //data: newUser
            });
        }

    } catch (error) {
        console.log("Error creating user: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}


export default registerUser;