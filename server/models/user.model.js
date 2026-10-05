import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 30
        },
        password: {
            type: String,
            required: true,
            //trim: true,
            minlength: 6,
            //maxlength: 50
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"]
        },
        isVerified: {
            type: Boolean,
            default: false,
            required: false
        },
        refreshToken: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
)

const User = new mongoose.model("User", userSchema);

export default User;