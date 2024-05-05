import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import PostService from "../../Services/PostServices";
import Tokenvarify from "../../Middleware/TokenVarify";


const postrouter = Router();

postrouter.post('/createPost',Tokenvarify,
[
    body('title').isLength({min:10,max:50}),
    body('description').isLength({min:10,max:200}),
    body('price').isNumeric(),
    body('Address').isLength({min:5,max:30}),
    body('images').isArray().isLength({min:2}),
    body('categoryid').isNumeric()

], async(req:any,res:Response)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Validation Error occured!",data:errors});
    }
    
    if(!req.body.user){
        return res.status(404).json({ error: "User not varifyed." });
    }
    
   
    PostService.CreatePost(req.body,res);
    
    
});

postrouter.post('/delete',Tokenvarify,[
    body('id').isNumeric()
],(req:Request,res:Response)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Validation Error occured!"});
    }
    
    if(!req.body.user){
        return res.status(404).json({ error: "User not varifyed." });
    }

    const data = req.body;

    PostService.DeletePost(data,res);

})


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


postrouter.post('/getbyuserid',(req:Request,res:Response)=>{
    const id = req.body.id;
    
    if(!id){
        return res.status(400).json({error:"validation error."})
    }
    PostService.GetPostByUserid(id,res);
})


postrouter.post('/search',[body("searchquery").isString().isLength({min:2})],(req:Request,res:Response)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Validation Error occured!"});
    }

    
    const searchquery = req.body.searchquery;
    
    PostService.serachpost(searchquery,res)
})


export default postrouter;