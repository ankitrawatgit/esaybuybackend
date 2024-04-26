import { Response } from "express";
import prismaClient from "../db/prismaclient";

class CateogryService{
    public static async createCategory(name:string,icon:string,res:Response){
        try {
            const newcategory = await prismaClient.category.create({data:{tag:name,icon:icon}})
            return res.status(200).json({message:"Category created!",category:newcategory})
        } catch (error) {
            return res.status(500).json({message:"Server Error",error})
        }
    }

    public static async getallCategory(res:Response){
        try {
            const allcategorys =await prismaClient.category.findMany({where:{}})
            if(allcategorys){
                return res.status(200).json({categories:allcategorys})
            }else{
                throw new Error("Internal Error")
            }
        } catch (error:any) {
            return res.status(500).json({error:"Server Error",errorMessage:error})
        }
    }

    public static async deleteCategory(id:number,res:Response){
        console.log(id);
        
        try {
            await prismaClient.category.delete({where:{id:id}})
            return res.status(200).json({message:"Deleted Sucessfully"})
        } catch (error) {
            return res.status(500).json({error:"Internel Server Error",errorMessage:error})
        }
    }

    

}

export default CateogryService;