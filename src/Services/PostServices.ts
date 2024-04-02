import { Response } from "express";
import prismaClient from "../db/prismaclient";

type user = {
    id: number,
    email: string
}

interface Postdata {
    title: string,
    discription: string,
    price: number,
    images: string[],
    category: string,
    user: user
}


class PostService {


    public static async GetAllpost(res:Response){
        try {
            const Allposts = prismaClient.post.findMany({where:{}})    ;
            
            if(!Allposts){
                return res.status(404).json({error:"No Posts founded"})
            }

            return res.status(200).json({message:"Sucess",posts:Allposts})

        } catch (error:any) {
            return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
        }
    }

    public static async CreatePost(params: Postdata, res: Response) {
        try {
            const { title, discription, price, images, category, user } = params;

            console.log(params);

            const newpost = await prismaClient.post.create({
                data: {
                    title, description: discription, price, category, authorid: user.id,
                    images:{
                        create:images.map((url)=>({url}))
                    }
                }
            });
            console.log(newpost);


            return res.status(200).json({ message: "Post created!", id: newpost.id });

        } catch (error: any) {
            return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
        }

    }




}


export default PostService;