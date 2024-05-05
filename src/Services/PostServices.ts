import { Response } from "express";
import prismaClient from "../db/prismaclient";

type user = {
    id: number,
    email: string
}

interface Postdata {
    title: string,
    description: string,
    price: number,
    Address:string,
    images: string[],
    categoryid: number,
    user: user
}

interface DeletePostdata{
    id:number,
    user:user
}

class PostService {


    public static async DeletePost(params:DeletePostdata,res:Response){
        try {
            const post = await prismaClient.post.findFirst({where:{id:params.id}});
            if(!post){
                return res.status(404).json({error:"Post Not found founded"})
            }

            if(post.authorid != params.user.id){
                return res.status(404).json({error:"This is not your post"})
            }

            await prismaClient.post.delete({where:{id:post.id}})

            return res.status(200).json({message:"Deleted Sucessfully",id:post.id})

        } catch (error) {
            
        }
    }


    public static async GetPostsByCategoriId(ids:number[],res:Response){
        try {
            //console.log(ids);
    
            const posts: any[] = [];
    
            await Promise.all(ids.map(async (id) => {
                const post = await prismaClient.category.findFirst({ where: { id }, include: { posts: true } });
                //console.log(post);
    
                if (post) {
                    posts.push(post);
                }
            }));
    
            return res.status(200).json({ message: "success", posts: posts });
        } catch (error:any) {
            return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
        }
    }

    public static async GetPostByUserid(id:number,res:Response){
        //console.log(id);
        
        try {
            const Allposts = await prismaClient.post.findMany({where:{
                authorid:id
            },include:{category:{
                select:{
                    id:true
                }
            },author:{
                select: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                    image: true,
                }
            }}})    ;
            //console.log(Allposts);
            
            if(!Allposts){
                return res.status(404).json({error:"No Posts founded"})
            }

            return res.status(200).json({message:"Sucess",posts:Allposts})

        } catch (error:any) {
            return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
        }
    }

    public static async GetAllpost(res:Response){
        try {
            const Allposts = await prismaClient.post.findMany({where:{},include:{category:{
                select:{
                    id:true
                }
            },author:{
                select: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                    image: true,
                }
            }}})    ;
            //console.log(Allposts);
            
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
            const { title, description, price,Address, images, categoryid, user } = params;
            
            //console.log("params",params);
            
            

            const findcategory = await prismaClient.category.findFirst({where:{id:1}})
            //console.log(findcategory);
            
            if(!findcategory){
                return res.status(404).json({error:"categorynotfound"})
            }

            const newpost = await prismaClient.post.create({
                data: {
                    title,
                    description,
                    price,
                    Address,
                    images,
                    categoryId:1,
                    authorid:user.id
            }});

            //console.log(newpost);


            return res.status(200).json({ message: "Post created!", id: newpost.id });

        } catch (error: any) {
            return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
        }

    }

    public static async serachpost(query:string,res:Response){
        try {
            const posts = await prismaClient.post.findMany({
              where: {
                OR: [
                  { title: { contains: query, mode: 'insensitive' } }, // Search in title
                  { description: { contains: query, mode: 'insensitive' } }, // Search in description
                  { Address: { contains: query, mode: 'insensitive' } },
                  {category: { tag: { contains: query, mode: 'insensitive' } } }, // Search in category tag
                  { author: { name: { contains: query, mode: 'insensitive' } } } // Search in address
                ]
              },
              include: {
                author: {
                    select:{
                        id: true,
                        name: true,
                        username: true,
                        email: true,
                        image: true,
                    }
                } // Include author information
              }
            });

            


            return res.status(200).json({posts:posts});
          } catch (error:any) {
            console.error('Error searching posts:', error);
            return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
          }
    }



}


export default PostService;