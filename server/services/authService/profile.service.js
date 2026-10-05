import User from "../../models/user.model.js";

const Profile = async (req, res) => {
    try {
        const id = req.user.user_id;

        const user = await User.findById(id);

        return res.status(200).json({
            message: "Profile fetched successfully",
            success: true,
            data: user
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        })
    }
}

export default Profile;