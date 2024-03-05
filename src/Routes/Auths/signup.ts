import { Router, Request, Response } from "express";
import UserService from "../../Services/UserServices";
import { body, validationResult } from "express-validator";

const signuprouter = Router();

signuprouter.post('/createuser', [
    body('name').isString().isLength({ min: 4 }),
    body('email').isEmail(),
    body('password').isString().isLength({ min: 6 }),
]
    , async (req: Request, res: Response) => {
        //Validation Error check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: "Validation Error occured!" });
        }
        const { name, email, password, image } = req.body;

        //create User
        await UserService.createUser({
            name, email, password, image
        }, res);
    })

export default signuprouter;