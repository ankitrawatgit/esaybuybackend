import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import ChatService from "../../Services/ChatService";
import Tokenvarify from "../../Middleware/TokenVarify";


const chatrouter = Router();

chatrouter.post('/createRoom',
    [
        body('participant').isNumeric(),
    ],Tokenvarify
,(req:Request,res:Response)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(401).json({message:"validation Error."})
    }
    
    if(!req.body.user){
        return res.status(404).json({ error: "User not varifyed." });
    }
    
    const firstperson = req.body.user;
    const {participant} = req.body;

    ChatService.createOrGetRoom(firstperson.id,participant,res);

})


chatrouter.post('/isRoomexists',
    [
        body('participant').isNumeric(),
    ],Tokenvarify
,(req:Request,res:Response)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(401).json({message:"validation Error."})
    }
    
    if(!req.body.user){
        return res.status(404).json({ error: "User not varifyed." });
    }
    
    const firstperson = req.body.user;
    const {participant} = req.body;

    ChatService.isRoomalradyexist(firstperson.id,participant,res);

})

chatrouter.post('/deletechat',[body("id").isString()],Tokenvarify,(req:Request,res:Response)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(401).json({message:"validation Error."})
    }

    ChatService.DeleteChat(req.body.user.id,req.body.id,res)


})


export default chatrouter;