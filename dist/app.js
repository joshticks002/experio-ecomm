"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors_1 = __importDefault(require("cors"));
require("dotenv").config();
const db_1 = __importDefault(require("./database/db"));
const index_routes_1 = __importDefault(require("./routes/index.routes"));
(0, db_1.default)();
const app = (0, express_1.default)();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
app.use(logger("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((0, cors_1.default)());
app.use(index_routes_1.default);
app.use(error_handler_1.default);
exports.default = app;
