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
    categoryid: number,
    user: user
}


class PostService {


    public static async GetPostsByCategoriId(ids:number[],res:Response){
        try {
            console.log(ids);
    
            const posts: any[] = [];
    
            await Promise.all(ids.map(async (id) => {
                const post = await prismaClient.category.findFirst({ where: { id }, include: { posts: true } });
                console.log(post);
    
                if (post) {
                    posts.push(post);
                }
            }));
    
            return res.status(200).json({ message: "success", posts: posts });
        } catch (error:any) {
            return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
        }
    }

    public static async GetAllpost(res:Response){
        try {
            const Allposts = await prismaClient.post.findMany({where:{},include:{category:true}})    ;
            console.log(Allposts);
            
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
            const { title, discription, price, images, categoryid, user } = params;

            console.log(params);
            const findcategory = await prismaClient.category.findFirst({where:{id:categoryid}})
            
            if(!findcategory){
                return res.status(404).json({error:"categorynotfound"})
            }

            const newpost = await prismaClient.post.create({
                data: {
                    title,
                    description: discription,
                    price,
                    images,
                    categoryId:categoryid,
                    authorid:user.id
            }});

            console.log(newpost);


            return res.status(200).json({ message: "Post created!", id: newpost.id });

        } catch (error: any) {
            return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
        }

    }


    //for admins only, means we need to call it mannually, maybe we implement it better later
    public static async createCategory(res:Response){
        
        const categoriesData = [
            { tag: "Electronic" },
            { tag: "Clothing" },
            { tag: "Books" }
          ];

        const newcategory = await prismaClient.category.createMany({data:categoriesData})

        console.log(newcategory);

        return res.status(200).json({message:"done"})
        
    }




}


export default PostService;