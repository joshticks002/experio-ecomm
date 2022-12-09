"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const dbService = () => {
    try {
        fs_1.default.readFileSync('./products.json');
        fs_1.default.readFileSync('./users.json');
        console.log("Database connected");
    }
    catch (err) {
        fs_1.default.writeFileSync("./products.json", JSON.stringify([], null, 2));
        fs_1.default.writeFileSync("./users.json", JSON.stringify([], null, 2));
        console.log("Database created");
    }
};
exports.default = dbService;
