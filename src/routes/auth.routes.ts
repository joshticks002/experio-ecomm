import express from "express";
const authRouter = express.Router();
import validateUserData from "../middleware/validate-user-data";
import validateLogin from "../middleware/validate-login";
const { registerUser, handleLogin, handleLogout } = require("../controllers/auth.controller")


authRouter.post('/register', validateUserData, registerUser);
authRouter.post('/login', validateLogin, handleLogin)
authRouter.get('/logout', handleLogout)

export default authRouter;