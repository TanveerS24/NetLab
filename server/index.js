import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connect from "./config/db.config.js";
import Router from "./routes/index.route.js";
import logger from "./middleware/logger.middleware.js"

const PORT = process.env.PORT;

app.use(logger);
app.use("/api/v1", Router);

const startServer = async () => {
    try {
        await connect();
        app.listen(PORT, () => {
            console.log(`server is running on ${PORT}`);
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

startServer();
