import { Response } from "express";
import prismaClient from "../db/prismaclient";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const saltRounds = 100;
const SECRET_KEY = 'your-secret-key-here';

interface userDataIntereface {
    name: string,
    email: string,
    password: string,
    username: string,
    image: string | null
}

class UserService {
    //simple jwt logic, can be improved 
    private static async generateAccessToken(username: string): string {
        return new Promise((resolve, reject) => {
            if (!username) {
                reject("Require a username");
            }
            else {
                resolve(jwt.sign({ username }, SECRET_KEY, { expiresIn: '2 days' }))
            }
        })

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

            // const user = await this.getUserByEmail(params.email);
            // if(user){
            //     throw new Error("User alrady Exists");
            // }

            const hashedpass = await this.generateHash(params.password);

            const user = await prismaClient.user.create({ data: { name: params.name, email: params.email, password: hashedpass, image: params.image } })

            console.log(user);

            return res.status(200).json({ message: 'User created!' })

        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
        }

    }
}

export default UserService;