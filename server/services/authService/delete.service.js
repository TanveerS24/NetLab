import User from "../../models/user.model.js";

const DeleteUser = async (req, res) => {
    try {
        const id = req.user.user_id;

        await User.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        })
    } catch (error) {
        return res.status(500).json({
            error: 'Internal server error',
            success: false
        })
    }

}

export default DeleteUser;