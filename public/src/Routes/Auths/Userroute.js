"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserServices_1 = __importDefault(require("../../Services/UserServices"));
const express_validator_1 = require("express-validator");
const TokenVarify_1 = __importDefault(require("../../Middleware/TokenVarify"));
const userrouter = (0, express_1.Router)();
//Signup Route
userrouter.post('/createuser', [
    (0, express_validator_1.body)('name').isString().isLength({ min: 4, max: 15 }),
    (0, express_validator_1.body)('email').isEmail().isLength({ max: 30 }),
    (0, express_validator_1.body)('username').isString().isLength({ min: 5, max: 10 }),
    (0, express_validator_1.body)('password').isString().isLength({ min: 6, max: 12 }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Validation Error check
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Validation Error occured!" });
    }
    const { name, email, password, image, username } = req.body;
    //create User
    yield UserServices_1.default.createUser({
        name, email, password, image, username
    }, res);
}));
//Login Route
userrouter.post('/login', [
    (0, express_validator_1.oneOf)([
        (0, express_validator_1.body)('username').exists(),
        (0, express_validator_1.body)('email').exists()
    ]),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).exists().withMessage('Password is required')
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Validation Error check
    //console.log(req.body);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Validation Error occured!", errors: { errors } });
    }
    const { username, email, password } = req.body;
    UserServices_1.default.loginUser({ username, email, password }, res);
}));
userrouter.post('/getLogedInuser', TokenVarify_1.default, (req, res) => {
    //console.log(req.body.user);
    if (!req.body.user) {
        return res.status(401).json({ error: "User Not authorized!" });
    }
    UserServices_1.default.getLogedInuser(req.body.user.email, res);
});
userrouter.post('/getUserbyid', (req, res) => {
    const id = req.body.id;
    if (!id) {
        return res.status(400).json({ error: "Validation Error." });
    }
    UserServices_1.default.getUserById(id, res);
});
userrouter.post('/updateprofile', (0, express_validator_1.body)('name').isString().isLength({ min: 4, max: 15 }), TokenVarify_1.default, (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Validation Error occured!" });
    }
    if (!req.body.user) {
        return res.status(404).json({ error: "User not verifyed." });
    }
    const { name, image, user } = req.body;
    // //console.log(req.body);
    UserServices_1.default.updateProfile(user.id, { name, image }, res);
});
exports.default = userrouter;
