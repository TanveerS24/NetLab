import mongoose from "mongoose";

export default async function connect() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        await mongoose.connect(MONGODB_URI);
        console.log("Database connected");
        return true;
    } catch (error) {
        console.log("Database connection failed: " + error);
        return false;
    }
}