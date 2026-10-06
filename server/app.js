import express from "express";
import logger from "./middleware/logger.middleware.js";
import cookieParser from "cookie-parser";
import Router from "./routes/index.route.js";
import NotFoundPage from "./services/404page.service.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(logger);
app.use("/api/v1", Router);
app.use(NotFoundPage);

export default app;