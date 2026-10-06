import express from "express";
import healthStatus from "../services/health.service.js";
import AuthRouter from "./auth.route.js";

import AuthMiddleWare from "../middleware/auth.middleware.js";

const Router = express.Router();

Router.get("/health", healthStatus);

Router.use("/auth", AuthMiddleWare, AuthRouter);

export default Router;