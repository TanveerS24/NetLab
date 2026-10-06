import "dotenv/config";
import app from "./app.js";
import connect from "./config/db.config.js";
const PORT = process.env.PORT;


const startServer = async () => {
    try {
        if (await connect()) {
            app.listen(PORT, () => {
                console.log(`server is running on ${PORT}`);
            });
        }
        else {
            throw new Error("Database connection failed");
        }
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

startServer();
