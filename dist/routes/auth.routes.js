"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRouter = express_1.default.Router();
const validate_user_data_1 = __importDefault(require("../middleware/validate-user-data"));
const validate_login_1 = __importDefault(require("../middleware/validate-login"));
const { registerUser, handleLogin, handleLogout } = require("../controllers/auth.controller");
authRouter.post('/register', validate_user_data_1.default, registerUser);
authRouter.post('/login', validate_login_1.default, handleLogin);
authRouter.get('/logout', handleLogout);
exports.default = authRouter;
