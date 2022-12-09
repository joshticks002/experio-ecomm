"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { connectDB, disconnectDB } = require("../../in_memory/dbsetup");
const app_1 = __importDefault(require("../app"));
const supertest_1 = __importDefault(require("supertest"));
describe("POST Request", () => {
    beforeAll(async () => {
        await connectDB();
    });
    afterAll(async () => {
        await disconnectDB();
    });
    it("should create a user account", async () => {
        const resp = await (0, supertest_1.default)(app_1.default).post("/register").send({
            "fullname": "John Doe",
            "email": "johndoe@gmail.com",
            "password": "abc123456",
            "confirm_password": "abc123456",
            "gender": "male",
            "phone": "+2348123456789",
            "address": "No 2 Example close, second gate"
        });
        console.log(resp.body.message, resp.status);
        //    expect(resp.status).toBe(201);
        //    expect(resp.message).toMatch(/successfully/gi);
    });
});
//  const userWork = await request(app)
//          .post("/superadmin/user/create")
//          .set("authorization", `Bearer ${login.body.token}`)
//          .send({
//             firstname: "Adeleke",
//             lastname: "Oba",
//             email: "john404@gmail.com",
//             squad: 10,
//             stack: "62ed32168caecd292097dae6",
//          });
