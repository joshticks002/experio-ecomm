import express from "express";
const authRouter = express.Router();
import validateUserData from "../middleware/validate-user-data";
import validateLogin from "../middleware/validate-login";
import validateToken from "../middleware/authentication";

const {
  registerUser,
  verifyEmail,
  handleLogin,
  handleLogout,
} = require("../controllers/auth.controller");

authRouter.post("/sign-up", validateUserData, registerUser);
authRouter.get("/verify-email", verifyEmail);
authRouter.post("/login", validateLogin, handleLogin);
authRouter.get("/logout", validateToken, handleLogout);

export default authRouter;
