"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Postrouter_1 = __importDefault(require("./Routes/Posts/Postrouter"));
const Userroute_1 = __importDefault(require("./Routes/Auths/Userroute"));
const categoyroute_1 = __importDefault(require("./Routes/categorys/categoyroute"));
const chatrouter_1 = __importDefault(require("./Routes/chat/chatrouter"));
var cookieParser = require('cookie-parser');
var cors = require('cors');
const app = (0, express_1.default)();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(express_1.default.json());
app.use('/auth', Userroute_1.default);
app.use('/post', Postrouter_1.default);
app.use('/category', categoyroute_1.default);
app.use('/chat', chatrouter_1.default);
app.listen(8000, () => {
    //console.log("Server started!");
});
exports.default = app;
