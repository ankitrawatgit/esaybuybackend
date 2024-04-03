"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authroute_1 = __importDefault(require("./Routes/Auths/authroute"));
const TokenVarify_1 = __importDefault(require("./Middleware/TokenVarify"));
const Postrouter_1 = __importDefault(require("./Routes/Posts/Postrouter"));
var cookieParser = require('cookie-parser');
var cors = require('cors');
const app = (0, express_1.default)();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(express_1.default.json());
app.use('/auth', authroute_1.default);
app.use('/post', Postrouter_1.default);
// app.post('/createcategory',(req,res)=>{
//     PostService.createCategory(res)
// })
//test code
app.use('/', TokenVarify_1.default);
app.post('/', (req, res) => {
    console.log(req.user);
    res.send('done');
});
app.listen(8000, () => {
    console.log("Server started!");
});
