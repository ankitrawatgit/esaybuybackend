import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const postrouter = Router();

postrouter.post('/createPost',
[
    body('title').isLength({min:10,max:30}),
    body('discription').isLength({min:10,max:30}),
    body('images').isObject().isLength({min:2})
], async(req:Request,res:Response)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Validation Error occured!" });
    }


})


export default postrouter;