"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserServices_1 = __importDefault(require("../Services/UserServices"));
const Tokenvarify = (req, res, next) => {
    if (!req.cookies.token) {
        return res.status(401).json({
            "error": "Auth error",
            "errorMessage": "Cookie not found."
        });
    }
    const token = req.cookies.token;
    // Verify the access token
    const user = UserServices_1.default.varifyAccessToken(token);
    if (!user) {
        return res.status(401).json({
            "error": "Auth error",
            "errorMessage": "Hacker!!?"
        });
    }
    req.body.user = user;
    next();
};
exports.default = Tokenvarify;
