import { Router,Request,Response } from "express";
import { body } from "express-validator";
import CateogryService from "../../Services/CategoryService";


const categoryrouter = Router();


categoryrouter.post("/createCategory",[
    body('name').isString()
    
],(req:Request,res:Response)=>{
    const {name,icon,key} = req.body;
    if(key!="unknowpassword"){
        return res.status(404).json({error:'path not found'})
    }

    CateogryService.createCategory(name,icon,res);

});

categoryrouter.get('/getall',(_res:Request,res:Response)=>{
    CateogryService.getallCategory(res);
})

categoryrouter.post('/delete',(req:Request,res:Response)=>{
    const {key,id} = req.body;
    if(key!="unknowpassword"){
        return res.status(404).json({error:'path not found'})
    }
    CateogryService.deleteCategory(id,res);
})

export default categoryrouter;