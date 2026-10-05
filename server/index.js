import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const PORT = process.env.PORT;

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Database connected");
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const startServer = async () => {
    if (await connect()) {
        try {
            app.listen(PORT, () => {
                console.log(`server is running on ${PORT}`);
            });
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log("Server failed to start");
        process.exit(1);
    }
}

startServer();
