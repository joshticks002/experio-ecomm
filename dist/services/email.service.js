"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sgMail = require("@sendgrid/mail");
const config_1 = __importDefault(require("../utils/config"));
sgMail.setApiKey(config_1.default.sendgridKey);
const sendEmail = async (emailObject) => {
    try {
        const { subject, content, to } = emailObject;
        const msg = {
            to,
            from: "jaysonkedylove@gmail.com",
            subject,
            html: content,
        };
        await sgMail.send(msg);
        console.log("Email sent");
    }
    catch (err) {
        console.log("Mail sender failed");
        if (err.response) {
            console.log(err.response.body);
        }
    }
};
exports.default = sendEmail;
