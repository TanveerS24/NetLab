import express from "express";
import healthStatus from "../services/health.service.js";

const Router = express.Router();

Router.get("/health", healthStatus);

export default Router;