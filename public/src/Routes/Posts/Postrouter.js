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
const express_validator_1 = require("express-validator");
const PostServices_1 = __importDefault(require("../../Services/PostServices"));
const TokenVarify_1 = __importDefault(require("../../Middleware/TokenVarify"));
const postrouter = (0, express_1.Router)();
postrouter.post('/createPost', TokenVarify_1.default, [
    (0, express_validator_1.body)('title').isLength({ min: 10, max: 50 }),
    (0, express_validator_1.body)('description').isLength({ min: 10, max: 200 }),
    (0, express_validator_1.body)('price').isNumeric(),
    (0, express_validator_1.body)('Address').isLength({ min: 5, max: 30 }),
    (0, express_validator_1.body)('images').isArray().isLength({ min: 2 }),
    (0, express_validator_1.body)('categoryid').isNumeric()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Validation Error occured!", data: errors });
    }
    if (!req.body.user) {
        return res.status(404).json({ error: "User not varifyed." });
    }
    PostServices_1.default.CreatePost(req.body, res);
}));
postrouter.post('/delete', TokenVarify_1.default, [
    (0, express_validator_1.body)('id').isNumeric()
], (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Validation Error occured!" });
    }
    if (!req.body.user) {
        return res.status(404).json({ error: "User not varifyed." });
    }
    const data = req.body;
    PostServices_1.default.DeletePost(data, res);
});
postrouter.get('/getAll', (_req, res) => {
    PostServices_1.default.GetAllpost(res);
});
postrouter.get('/getpostbyCategory', [
    (0, express_validator_1.body)('ids').isArray()
], (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Validation Error occured!" });
    }
    PostServices_1.default.GetPostsByCategoriId(req.body.ids, res);
});
postrouter.post('/getbyuserid', (req, res) => {
    const id = req.body.id;
    if (!id) {
        return res.status(400).json({ error: "validation error." });
    }
    PostServices_1.default.GetPostByUserid(id, res);
});
postrouter.post('/search', [(0, express_validator_1.body)("searchquery").isString().isLength({ min: 2 })], (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Validation Error occured!" });
    }
    const searchquery = req.body.searchquery;
    PostServices_1.default.serachpost(searchquery, res);
});
exports.default = postrouter;
