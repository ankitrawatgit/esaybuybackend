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
const prismaclient_1 = __importDefault(require("../db/prismaclient"));
const firestore_1 = require("firebase/firestore");
const app_1 = require("firebase/app");
const app = (0, app_1.initializeApp)({
    apiKey: "AIzaSyCq-G8y1jENXrT3ansHPxvBzYWS7Gt6BDk",
    authDomain: "easybuychat-e2938.firebaseapp.com",
    projectId: "easybuychat-e2938",
    storageBucket: "easybuychat-e2938.appspot.com",
    messagingSenderId: "787785893150",
    appId: "1:787785893150:web:8aa6c87e643cb8d85cb50f",
    measurementId: "G-1VB88C45PP"
});
class ChatService {
    static createOrGetRoom(participant1, participant2, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (participant1 == participant2) {
                return res.status(401).json({ message: "something is wrong." });
            }
            try {
                // Check if both participants exist and retrieve their IDs
                const participant1id = yield prismaclient_1.default.user.findUnique({ where: { id: participant1 } });
                if (!participant1id) {
                    return res.status(404).json({ message: "user not found." });
                }
                const participant2id = yield prismaclient_1.default.user.findUnique({ where: { id: participant2 } });
                if (!participant2id) {
                    return res.status(404).json({ message: "user not found." });
                }
                const existsroom = yield prismaclient_1.default.chatRoom.findFirst({
                    where: {
                        AND: [
                            { participants: { some: { id: participant1id.id } } },
                            { participants: { some: { id: participant2id.id } } }
                        ]
                    }
                });
                if (existsroom) {
                    return res.status(200).json({ message: "Room alrady Exists", roomid: existsroom.roomid });
                }
                const chatRef = (0, firestore_1.collection)((0, firestore_1.getFirestore)(app), 'chats');
                const chatDocRef = yield (0, firestore_1.addDoc)(chatRef, {
                    participants: {
                        [participant1id.id]: true,
                        [participant2id.id]: true
                    }
                });
                const roomidis = chatDocRef.id;
                // Create the room
                const newRoom = yield prismaclient_1.default.chatRoom.create({
                    data: {
                        roomid: roomidis,
                        participants: {
                            connect: [
                                { id: participant1id.id },
                                { id: participant2id.id }
                            ]
                        }
                    }
                });
                return res.status(200).json({ message: "Room created successfully", roomid: newRoom.roomid });
            }
            catch (error) {
                return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
            }
        });
    }
    static isRoomalradyexist(participant1, participant2, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const participant1id = yield prismaclient_1.default.user.findUnique({ where: { id: participant1 } });
                if (!participant1id) {
                    return res.status(404).json({ message: "user not found." });
                }
                const participant2id = yield prismaclient_1.default.user.findUnique({ where: { id: participant2 } });
                if (!participant2id) {
                    return res.status(404).json({ message: "user not found." });
                }
                const roomidis = participant1id.id + "room" + participant2id.id;
                const existsroom = yield prismaclient_1.default.chatRoom.findFirst({
                    where: {
                        AND: [
                            { participants: { some: { id: participant1id.id } } },
                            { participants: { some: { id: participant2id.id } } }
                        ]
                    }
                });
                if (existsroom) {
                    return res.status(200).json({ message: "Room alrady Exists", isExists: true, roomid: existsroom.roomid });
                }
                else {
                    return res.status(200).json({ message: "Room Not Exists", isExists: false });
                }
            }
            catch (error) {
                return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
            }
        });
    }
    static DeleteChat(userId, roomId, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the chat room by its roomId
                const chatRoom = yield prismaclient_1.default.chatRoom.findFirst({
                    where: { roomid: roomId },
                    include: {
                        participants: true
                    }
                });
                // If the chat room doesn't exist, return 404 Not Found
                if (!chatRoom) {
                    return res.status(404).json({ message: "Chat room not found." });
                }
                const userExists = chatRoom.participants.some(participant => participant.id === userId);
                if (!userExists) {
                    return res.status(404).json({ message: "User is not in the room's participants list.", isInRoom: false });
                }
                const firestore = (0, firestore_1.getFirestore)(app);
                const messagesCollectionRef = (0, firestore_1.collection)(firestore, `chats/${roomId}/messages`);
                yield (0, firestore_1.deleteDoc)((0, firestore_1.doc)(messagesCollectionRef));
                // console.log(messagesCollectionRef);
                // Delete the chat room
                yield prismaclient_1.default.chatRoom.deleteMany({
                    where: { roomid: roomId }
                });
                return res.status(200).json({ message: "Chat room deleted successfully." });
            }
            catch (error) {
                return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
            }
        });
    }
}
exports.default = ChatService;
