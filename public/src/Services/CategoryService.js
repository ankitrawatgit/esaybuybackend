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
class CateogryService {
    static createCategory(name, icon, iconFamily, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newcategory = yield prismaclient_1.default.category.create({ data: { tag: name, icon: icon, iconFamily: iconFamily } });
                return res.status(200).json({ message: "Category created!", category: newcategory });
            }
            catch (error) {
                return res.status(500).json({ message: "Server Error", error });
            }
        });
    }
    static getallCategory(res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allcategorys = yield prismaclient_1.default.category.findMany({ where: {} });
                if (allcategorys) {
                    return res.status(200).json({ categories: allcategorys });
                }
                else {
                    throw new Error("Internal Error");
                }
            }
            catch (error) {
                return res.status(500).json({ error: "Server Error", errorMessage: error });
            }
        });
    }
    static deleteCategory(id, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(id);
            try {
                yield prismaclient_1.default.category.delete({ where: { id: id } });
                return res.status(200).json({ message: "Deleted Sucessfully" });
            }
            catch (error) {
                return res.status(500).json({ error: "Internel Server Error", errorMessage: error });
            }
        });
    }
}
exports.default = CateogryService;
