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

interface LoginInterface{
    email:string | undefined,
    username: string | undefined,
    password: string
}



class UserService {
    
    private static generateAccessToken(id:number,email:string) {
        return jwt.sign({ id,email }, SECRET_KEY, { expiresIn: '2 days' })
    }

    public static varifyAccessToken(token:string){
        try {
          const user =  jwt.verify(token,SECRET_KEY);
          return user;
        } catch (error) {
            return null;
        }
         
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

    public static async getUserById(id:number){
        try {
            return await prismaClient.user.findUnique({ where: { id:id } })
        } catch (error) {
            throw new Error("Something went wrong");
        }
    }

    public static async getUserByEmail(email: string) {
        try {
            return await prismaClient.user.findUnique({ where: { email: email } })
        } catch (error) {
            throw new Error("Something went wrong while finding userbyemil");
        }
    }

    private static async getByUsername(username:string){
        try {
            return await prismaClient.user.findUnique({ where: { username: username } })
        } catch (error) {
            throw new Error("Something went wrong while finding byusername");
        }
    }

    public static async createUser(params: userDataIntereface, res: Response) {
        try {

            const user = await this.getUserByEmail(params.email);
            if(user){
                throw new Error("User alrady Exists");
            }
            const usrname =await this.getByUsername(params.username);
            
            if(usrname){
                throw new Error("Username Alrady Exists");                
            }

            const hashedpass = await this.generateHash(params.password);

            // run npx prisma migrate dev to update schema
            const newuser = await prismaClient.user.create({ data: { name: params.name,username:params.username, email: params.email, password: hashedpass, image: params.image} })

            // console.log(newuser);

            const jwt = this.generateAccessToken(newuser.id,newuser.email);

            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 7)
            res.cookie('token', jwt, {
                // Cookie options
                expires:expirationDate, // Expires after 15 minutes
                httpOnly: true, // Cookie is only accessible via HTTP(S)
                // Other options can be set as per your requirements
              });
            
            

            return res.status(200).json({message:"User created!",user:{
                id: newuser.id,
                name: newuser.name,
                username: newuser.username,
                email: newuser.email,
                image: newuser.image
            }});

        } catch (error: any) {
            // console.log(error);
            return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
        }

    }


    public static async loginUser(params:LoginInterface,res:Response){
        
        try {
          const user = await (params.email ? this.getUserByEmail(params.email!) : this.getByUsername(params.username!));
            if(!user){
                throw new Error("User Not Found");
            }

            const match = await bcrypt.compare(params.password, user.password);
            
            if(!match) {
                res.status(401).json({error:"Password wrong"});
                return;
            }

            const jwt = this.generateAccessToken(user.id,user.email);

            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 7)
            res.cookie('token', jwt, {
                expires:expirationDate, // Expires after 15 minutes
                httpOnly: true, // Cookie is only accessible via HTTP(S)
                // Other options can be set as per your requirements
              });

            return res.status(200).json({ message: 'Login Sucess!',user:{
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                image: user.image
            }});

        } catch (error:any) {
            return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
        }
    }

    public static async getLogedInuser(email:string,res:Response){
        try {
            const user = await this.getUserByEmail(email);
            if(!user){
                throw new Error("User Not Exists")
            }

            res.status(200).json({user:{
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                image: user.image
            }});

        } catch (error:any) {
            return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
        }
    }   



}

export default UserService;