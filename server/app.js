import express from "express";
import logger from "./middleware/logger.middleware.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(logger);

export default app;