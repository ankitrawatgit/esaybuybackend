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
class PostService {
    static DeletePost(params, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield prismaclient_1.default.post.findFirst({ where: { id: params.id } });
                if (!post) {
                    return res.status(404).json({ error: "Post Not found founded" });
                }
                if (post.authorid != params.user.id) {
                    return res.status(404).json({ error: "This is not your post" });
                }
                yield prismaclient_1.default.post.delete({ where: { id: post.id } });
                return res.status(200).json({ message: "Deleted Sucessfully", id: post.id });
            }
            catch (error) {
            }
        });
    }
    static GetPostsByCategoriId(ids, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //console.log(ids);
                const posts = [];
                yield Promise.all(ids.map((id) => __awaiter(this, void 0, void 0, function* () {
                    const post = yield prismaclient_1.default.category.findFirst({ where: { id }, include: { posts: true } });
                    //console.log(post);
                    if (post) {
                        posts.push(post);
                    }
                })));
                return res.status(200).json({ message: "success", posts: posts });
            }
            catch (error) {
                return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
            }
        });
    }
    static GetPostByUserid(id, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log(id);
            try {
                const Allposts = yield prismaclient_1.default.post.findMany({ where: {
                        authorid: id
                    }, include: { category: {
                            select: {
                                id: true
                            }
                        }, author: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                email: true,
                                image: true,
                            }
                        } } });
                //console.log(Allposts);
                if (!Allposts) {
                    return res.status(404).json({ error: "No Posts founded" });
                }
                return res.status(200).json({ message: "Sucess", posts: Allposts });
            }
            catch (error) {
                return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
            }
        });
    }
    static GetAllpost(res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Allposts = yield prismaclient_1.default.post.findMany({ where: {}, include: { category: {
                            select: {
                                id: true
                            }
                        }, author: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                email: true,
                                image: true,
                            }
                        } } });
                //console.log(Allposts);
                if (!Allposts) {
                    return res.status(404).json({ error: "No Posts founded" });
                }
                return res.status(200).json({ message: "Sucess", posts: Allposts });
            }
            catch (error) {
                return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
            }
        });
    }
    static CreatePost(params, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, description, price, Address, images, categoryid, user } = params;
                //console.log("params",params);
                const findcategory = yield prismaclient_1.default.category.findFirst({ where: { id: 1 } });
                //console.log(findcategory);
                if (!findcategory) {
                    return res.status(404).json({ error: "categorynotfound" });
                }
                const newpost = yield prismaclient_1.default.post.create({
                    data: {
                        title,
                        description,
                        price,
                        Address,
                        images,
                        categoryId: 1,
                        authorid: user.id
                    }
                });
                //console.log(newpost);
                return res.status(200).json({ message: "Post created!", id: newpost.id });
            }
            catch (error) {
                return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
            }
        });
    }
    static serachpost(query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield prismaclient_1.default.post.findMany({
                    where: {
                        OR: [
                            { title: { contains: query, mode: 'insensitive' } }, // Search in title
                            { description: { contains: query, mode: 'insensitive' } }, // Search in description
                            { Address: { contains: query, mode: 'insensitive' } },
                            { category: { tag: { contains: query, mode: 'insensitive' } } }, // Search in category tag
                            { author: { name: { contains: query, mode: 'insensitive' } } } // Search in address
                        ]
                    },
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                email: true,
                                image: true,
                            }
                        } // Include author information
                    }
                });
                return res.status(200).json({ posts: posts });
            }
            catch (error) {
                console.error('Error searching posts:', error);
                return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
            }
        });
    }
}
exports.default = PostService;
