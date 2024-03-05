import { Router, Request, Response } from "express";
import UserService from "../../Services/UserServices";
import { body, validationResult } from "express-validator";

const signuprouter =  Router();

signuprouter.post('/createuser',[
    body('name').isString().isLength({min:4})
]
,(req:Request,res:Response)=>{   
    //Validation Error check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({error:"Validation Error occured!"});
}
    
    //Accessing cookies
    console.log("Name Cookies:",req.cookies.yournameis)
    console.log("Limited Cookies:",req.cookies.limitedtimecookie)

    //create User
    UserService.createUser({
        name:req.body.name
    });
    
    res.cookie('yournameis', req.body.name);
    //setting cookies
    res.cookie('limitedtimecookie', 'BORA', {
        maxAge: 3600000, // Cookie will expire after 1 hour
        // httpOnly: true, // Cookie is accessible only by the server, not by client-side scripts
      });
    res.send('done');
})

export default signuprouter;