import User from "../../models/user.model.js";

const DeleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                success: false
            })
        }

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