"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const products_routes_1 = __importDefault(require("./products.routes"));
const authentication_1 = __importDefault(require("../middleware/authentication"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.status(200).json({
        message: "Service running fine",
        data: {},
        status: true,
    });
});
router.use(auth_routes_1.default);
router.use(authentication_1.default);
router.use(products_routes_1.default);
router.use(function (req, res, next) {
    res.status(404).render('error', {
        message: "Page not found"
    });
});
exports.default = router;
