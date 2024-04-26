import { Router, Request, Response, request } from "express";
import UserService from "../../Services/UserServices";
import { body, oneOf, validationResult } from "express-validator";
import Tokenvarify from "../../Middleware/TokenVarify";

const userrouter = Router();

//Signup Route
userrouter.post('/createuser', [
    body('name').isString().isLength({ min: 4,max:15 }),
    body('email').isEmail().isLength({max:30}),
    body('username').isString().isLength({min:5,max:10}),
    body('password').isString().isLength({ min: 6,max:12 }),
]
    , async (req: Request, res: Response) => {
        //Validation Error check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: "Validation Error occured!" });
        }
        const { name, email, password, image ,username} = req.body;

        //create User
        await UserService.createUser({
            name, email, password, image,username
        }, res);
    });


    //Login Route
    userrouter.post('/login',[
        oneOf([
            body('username').exists(),
            body('email').exists()
        ]),
        body('password').isLength({ min: 6 }).exists().withMessage('Password is required')
    ], async (req: Request, res: Response) => {
        //Validation Error check
        //console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: "Validation Error occured!",errors:{errors}});
        }
        const {username,email,password} = req.body;
        

        UserService.loginUser({username,email,password},res);
    }
    
    )


    userrouter.post('/getLogedInuser',Tokenvarify,(req:Request,res:Response)=>{
        //console.log(req.body.user);
        
        if(!req.body.user){
            return res.status(401).json({ error: "User Not authorized!"});
        }

        UserService.getLogedInuser(req.body.user.email,res);
        
    });


    userrouter.post('/getUserbyid',(req:Request,res:Response)=>{
        const id = req.body.id;
        if(!id){
            return res.status(400).json({error:"Validation Error."})
        }

        UserService.getUserById(id,res);

    })

    userrouter.post('/updateprofile',
    body('name').isString().isLength({ min: 4,max:15 }),
    Tokenvarify,
    (req:Request,res:Response)=>{

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: "Validation Error occured!" });
        }
        
        if(!req.body.user){
            return res.status(404).json({ error: "User not verifyed." });
        }

        const {name,image,user} = req.body;
        // //console.log(req.body);
        
        UserService.updateProfile(user.id,{name,image},res);

    })


export default userrouter;