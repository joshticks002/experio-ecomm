import express from "express";
import cors from "cors";
import errorHandler from "./middleware/error-handler";
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();
import dbService from "./database/db";
import router from "./routes/index.routes";
dbService();

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(router);
app.use(errorHandler);

export default app;
