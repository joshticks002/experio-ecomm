import express from "express";
import validateUserData from "../middleware/validate-user-data";
import validateLogin from "../middleware/validate-login";
import validateToken from "../middleware/authentication";
import validatePassword from "../middleware/validate-password";
import validateEmail from "../middleware/validate-email";

const authRouter = express.Router();

const {
  registerUser,
  verifyEmail,
  handleLogin,
  forgotPassword,
  resetPassword,
  handleLogout,
} = require("../controllers/auth.controller");

authRouter.post("/sign-up", validateUserData, registerUser);
authRouter.get("/verify-email", verifyEmail);
authRouter.post("/login", validateLogin, handleLogin);
authRouter.post("/forgot-password", validateEmail, forgotPassword);
authRouter.post("/reset-password", validatePassword, resetPassword);
authRouter.get("/logout", validateToken, handleLogout);

export default authRouter;
