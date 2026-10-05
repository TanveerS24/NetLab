import express from "express";
import registerUser from "../services/authService/register.service.js";
import Login from "../services/authService/login.service.js";
import DeleteUser from "../services/authService/delete.service.js";
import EditUser from "../services/authService/edit.service.js"

const AuthRouter = express.Router();

AuthRouter.post("/register", registerUser);
AuthRouter.post("/login", Login);
AuthRouter.delete("/delete/:id", DeleteUser);
AuthRouter.patch("/edit/:id", EditUser);

export default AuthRouter;
