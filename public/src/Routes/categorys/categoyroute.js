"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const CategoryService_1 = __importDefault(require("../../Services/CategoryService"));
const categoryrouter = (0, express_1.Router)();
categoryrouter.post("/createCategory", [
    (0, express_validator_1.body)('name').isString()
], (req, res) => {
    const { name, icon, iconFamily, key } = req.body;
    if (key != "unknowpassword") {
        return res.status(404).json({ error: 'path not found' });
    }
    CategoryService_1.default.createCategory(name, icon, iconFamily, res);
});
categoryrouter.get('/getall', (_res, res) => {
    CategoryService_1.default.getallCategory(res);
});
categoryrouter.post('/delete', (req, res) => {
    const { key, id } = req.body;
    if (key != "unknowpassword") {
        return res.status(404).json({ error: 'path not found' });
    }
    CategoryService_1.default.deleteCategory(id, res);
});
exports.default = categoryrouter;
