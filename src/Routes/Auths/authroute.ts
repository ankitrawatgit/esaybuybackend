import { Router, Request, Response } from "express";
import UserService from "../../Services/UserServices";
import { body, oneOf, validationResult } from "express-validator";

const authrouter = Router();

//Signup Route
authrouter.post('/createuser', [
    body('name').isString().isLength({ min: 4 }),
    body('email').isEmail(),
    body('username').isString().isLength({min:10}),
    body('password').isString().isLength({ min: 6 }),
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
    authrouter.post('/login',[
        oneOf([
            body('username').exists(),
            body('email').exists()
        ]),
        body('password').isLength({ min: 6 }).exists().withMessage('Password is required')
    ], async (req: Request, res: Response) => {
        //Validation Error check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: "Validation Error occured!",errors:{errors}});
        }
        const {username,email,password} = req.body;

        UserService.loginUser({username,email,password},res);
    }
    
    )


export default authrouter;