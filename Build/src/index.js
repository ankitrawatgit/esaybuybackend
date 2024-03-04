"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signup_1 = __importDefault(require("./Routes/Auths/signup"));
var cookieParser = require('cookie-parser');
const app = (0, express_1.default)();
app.use(cookieParser());
app.use(express_1.default.json());
app.use('/signup', signup_1.default);
app.listen(8000, () => {
    console.log("Server started!");
});
