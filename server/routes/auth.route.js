import express from "express";
import RegisterUser from "../services/authService/register.service.js";
import Login from "../services/authService/login.service.js";
import DeleteUser from "../services/authService/delete.service.js";
import EditUser from "../services/authService/edit.service.js"
import Logout from "../services/authService/logout.service.js";
import Profile from "../services/authService/profile.service.js";
import RefreshToken from "../services/authService/refreshToken.service.js";

import AuthMiddleWare from "../middleware/auth.middleware.js";

const AuthRouter = express.Router();

AuthRouter.post("/register", RegisterUser);
AuthRouter.post("/login", Login);
AuthRouter.delete("/delete", AuthMiddleWare, DeleteUser);
AuthRouter.patch("/edit", AuthMiddleWare, EditUser);
AuthRouter.post("/logout", Logout);
AuthRouter.get("/profile", AuthMiddleWare, Profile);
AuthRouter.post("/refreshToken", RefreshToken);

export default AuthRouter;
