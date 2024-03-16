import { Response } from "express";
import prismaClient from "../db/prismaclient";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const SECRET_KEY = 'manjaroProject';

interface userDataIntereface {
    name: string,
    email: string,
    password: string,
    username: string,
    image: string | null
}

class UserService {
    
    private static generateAccessToken(username: string,email:string) {
        return jwt.sign({ username,email }, SECRET_KEY, { expiresIn: '2 days' })
    }

    public static varifyAccessToken(token:string){
        return jwt.verify(token,SECRET_KEY);
    }

    private static async generateHash(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err: any, hash: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        });

    }


    public static async getUserByEmail(email: string) {
        try {
            return await prismaClient.user.findFirst({ where: { email: email } })
        } catch (error) {
            throw new Error("Something went wrong");
        }
    }

    public static async createUser(params: userDataIntereface, res: Response) {
        try {

            const user = await this.getUserByEmail(params.email);
            if(user){
                throw new Error("User alrady Exists");
            }

            const hashedpass = await this.generateHash(params.password);

            // run npx prisma migrate dev to update schema
            const newuser = await prismaClient.user.create({ data: { name: params.name,username:params.username, email: params.email, password: hashedpass, image: params.image} })

            console.log(newuser);
            return res.status(200).json({ message: 'User created!' })

        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
        }

    }
}

export default UserService;