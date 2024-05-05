"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const ChatService_1 = __importDefault(require("../../Services/ChatService"));
const TokenVarify_1 = __importDefault(require("../../Middleware/TokenVarify"));
const chatrouter = (0, express_1.Router)();
chatrouter.post('/createRoom', [
    (0, express_validator_1.body)('participant').isNumeric(),
], TokenVarify_1.default, (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ message: "validation Error." });
    }
    if (!req.body.user) {
        return res.status(404).json({ error: "User not varifyed." });
    }
    const firstperson = req.body.user;
    const { participant } = req.body;
    ChatService_1.default.createOrGetRoom(firstperson.id, participant, res);
});
chatrouter.post('/isRoomexists', [
    (0, express_validator_1.body)('participant').isNumeric(),
], TokenVarify_1.default, (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ message: "validation Error." });
    }
    if (!req.body.user) {
        return res.status(404).json({ error: "User not varifyed." });
    }
    const firstperson = req.body.user;
    const { participant } = req.body;
    ChatService_1.default.isRoomalradyexist(firstperson.id, participant, res);
});
chatrouter.post('/deletechat', [(0, express_validator_1.body)("id").isString()], TokenVarify_1.default, (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ message: "validation Error." });
    }
    ChatService_1.default.DeleteChat(req.body.user.id, req.body.id, res);
});
exports.default = chatrouter;
