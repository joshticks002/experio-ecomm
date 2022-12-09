import express from "express";
import errorHandler from "./middleware/error-handler";
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override')
require("dotenv").config()
import dbService from "./database/db";
import router from './routes/index.routes';
dbService()

const app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(methodOverride('_method'))

app.use(router);
app.use(errorHandler)

export default app;