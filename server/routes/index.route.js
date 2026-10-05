import express from "express";
import healthStatus from "../services/health.service.js";
import AuthRouter from "./auth.route.js";

const Router = express.Router();

Router.get("/health", healthStatus);

Router.use("/auth", AuthRouter);


export default Router;