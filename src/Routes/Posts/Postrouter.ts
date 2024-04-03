import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import PostService from "../../Services/PostServices";
import Tokenvarify from "../../Middleware/TokenVarify";


const postrouter = Router();

postrouter.post('/createPost',Tokenvarify,
[
    body('title').isLength({min:10,max:50}),
    body('discription').isLength({min:10,max:100}),
    body('price').isNumeric(),
    body('images').isArray().isLength({min:2}),
    body('categoryid').isNumeric()

], async(req:any,res:Response)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Validation Error occured!"});
    }
    
    if(!req.body.user){
        return res.status(404).json({ error: "User not varifyed." });
    }
    
    console.log(req.body);
   
    PostService.CreatePost(req.body,res);
    
});

postrouter.get('/getAll',(_req:Request,res:Response)=>{
    PostService.GetAllpost(res);
})

postrouter.get('/getpostbyCategory',[
    body('ids').isArray()
],(req:Request,res:Response)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Validation Error occured!"});
    }

    PostService.GetPostsByCategoriId(req.body.ids,res);
    
})


export default postrouter;