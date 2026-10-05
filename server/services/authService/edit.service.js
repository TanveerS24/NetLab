import User from "../../models/user.model.js";
import bcrypt from "bcrypt";

const EditUser = async (req, res) => {
    try {
        const id = req.user.user_id;
        const { username, password, email } = req.body;

        const user = await User.findById(id);

        if (email) {
            user.email = email;
        }
        if (username) user.username = username;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

export default EditUser;