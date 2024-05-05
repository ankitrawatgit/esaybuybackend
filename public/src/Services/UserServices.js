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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = 'manjaroProject';
class UserService {
    static generateAccessToken(id, email) {
        return jsonwebtoken_1.default.sign({ id, email }, SECRET_KEY, { expiresIn: '2 days' });
    }
    static varifyAccessToken(token) {
        try {
            const user = jsonwebtoken_1.default.verify(token, SECRET_KEY);
            return user;
        }
        catch (error) {
            return null;
        }
    }
    static generateHash(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                bcrypt_1.default.hash(password, 10, (err, hash) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(hash);
                    }
                });
            });
        });
    }
    static getUserById(id, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prismaclient_1.default.user.findUnique({ where: { id: id } });
                if (!user) {
                    return res.status(404).json({ message: "user not found." });
                }
                return res.status(200).json({ user: {
                        id: user.id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        image: user.image,
                        createdAt: user.createdAt,
                    } });
            }
            catch (error) {
                return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
            }
        });
    }
    static getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prismaclient_1.default.user.findUnique({ where: { email: email } });
            }
            catch (error) {
                throw new Error("Something went wrong while finding userbyemil");
            }
        });
    }
    static getByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prismaclient_1.default.user.findUnique({ where: { username: username } });
            }
            catch (error) {
                throw new Error("Something went wrong while finding byusername");
            }
        });
    }
    static createUser(params, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.getUserByEmail(params.email);
                if (user) {
                    throw new Error("User alrady Exists");
                }
                const usrname = yield this.getByUsername(params.username);
                if (usrname) {
                    throw new Error("Username Alrady Exists");
                }
                const hashedpass = yield this.generateHash(params.password);
                // run npx prisma migrate dev to update schema
                const newuser = yield prismaclient_1.default.user.create({ data: { name: params.name, username: params.username, email: params.email, password: hashedpass, image: params.image } });
                // //console.log(newuser);
                const jwt = this.generateAccessToken(newuser.id, newuser.email);
                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 7);
                res.cookie('token', jwt, {
                    expires: expirationDate,
                    httpOnly: true,
                    secure: true,
                });
                return res.status(200).json({ message: "User created!", user: {
                        id: newuser.id,
                        name: newuser.name,
                        username: newuser.username,
                        email: newuser.email,
                        image: newuser.image
                    } });
            }
            catch (error) {
                // //console.log(error);
                return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
            }
        });
    }
    static loginUser(params, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield (params.email ? this.getUserByEmail(params.email) : this.getByUsername(params.username));
                if (!user) {
                    throw new Error("User Not Found");
                }
                const match = yield bcrypt_1.default.compare(params.password, user.password);
                if (!match) {
                    res.status(401).json({ errorMessage: "Password wrong" });
                    return;
                }
                const jwt = this.generateAccessToken(user.id, user.email);
                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 7);
                res.cookie('token', jwt, {
                    expires: expirationDate,
                });
                return res.status(200).json({ message: 'Login Sucess!', user: {
                        id: user.id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        image: user.image
                    } });
            }
            catch (error) {
                return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
            }
        });
    }
    static getLogedInuser(email, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.getUserByEmail(email);
                if (!user) {
                    throw new Error("User Not Exists");
                }
                const rooms = yield prismaclient_1.default.chatRoom.findMany({
                    where: {
                        participants: {
                            some: { id: user.id }
                        },
                    },
                    include: {
                        participants: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                email: true,
                                createdAt: true,
                                image: true
                            }
                        }
                    }
                });
                res.status(200).json({ user: {
                        id: user.id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        image: user.image,
                        createdAt: user.createdAt,
                        chatrooms: rooms
                    } });
            }
            catch (error) {
                return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
            }
        });
    }
    static updateProfile(userId, newData, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prismaclient_1.default.user.findUnique({ where: { id: userId } });
                if (!user) {
                    throw new Error("User not found");
                }
                // Update only name and image if provided in newData
                const updatedUser = yield prismaclient_1.default.user.update({
                    where: { id: userId },
                    data: {
                        name: newData.name !== undefined ? newData.name : user.name,
                        image: newData.image !== undefined ? newData.image : user.image,
                    },
                });
                return res.status(200).json({
                    message: "Profile updated successfully!",
                    user: {
                        id: updatedUser.id,
                        name: updatedUser.name,
                        username: updatedUser.username,
                        email: updatedUser.email,
                        image: updatedUser.image
                    }
                });
            }
            catch (error) {
                return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
            }
        });
    }
}
exports.default = UserService;
