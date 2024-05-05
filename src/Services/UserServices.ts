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

    public static async getUserById(id:number,res:Response){
        try {
            const user =  await prismaClient.user.findUnique({ where: { id:id } })
            if(!user){
                return res.status(404).json({message:"user not found."})
            }
            
           return res.status(200).json({user:{
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                image: user.image,
                createdAt:user.createdAt,
            }});

        } catch (error:any) {
            return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
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

            // //console.log(newuser);

            const jwt = this.generateAccessToken(newuser.id,newuser.email);

            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 7)
            res.cookie('token', jwt, {
                expires: expirationDate,
                httpOnly: true,
                secure:true,
            });
            
            

            return res.status(200).json({message:"User created!",user:{
                id: newuser.id,
                name: newuser.name,
                username: newuser.username,
                email: newuser.email,
                image: newuser.image
            }});

        } catch (error: any) {
            // //console.log(error);
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
                res.status(401).json({errorMessage:"Password wrong"});
                return;
            }

            const jwt = this.generateAccessToken(user.id,user.email);

            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 7)
            res.cookie('token', jwt, {
                expires: expirationDate,
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
            
            const rooms = await prismaClient.chatRoom.findMany({
                where: {
                    participants: {
                        some: { id: user.id }
                    },
                },
                include:{
                    participants:{
                        select:{
                            id: true,
                            name: true,
                            username: true,
                            email: true,
                            createdAt: true,
                            image:true
                        }
                    }
                }
            });

            res.status(200).json({user:{
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                image: user.image,
                createdAt:user.createdAt,
                chatrooms:rooms
            }});

        } catch (error:any) {
            return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
        }
    }   


    public static async updateProfile(userId: number, newData: { name?: string, image?: string }, res: Response) {
        try {
            const user = await prismaClient.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw new Error("User not found");
            }
    
            // Update only name and image if provided in newData
            const updatedUser = await prismaClient.user.update({
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
        } catch (error: any) {
            return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
        }
    }




}

export default UserService;