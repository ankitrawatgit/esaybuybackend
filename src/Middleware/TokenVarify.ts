import UserService from "../Services/UserServices";

const Tokenvarify = (req:any,res:any,next:any)=>{
    if (!req.cookies.token) {
        return res.status(401).json({
            "error": "Auth error",
            "errorMessage": "Cookie not found."
        });
    }

    const token = req.cookies.token;
    
    // Verify the access token
    const user = UserService.varifyAccessToken(token);
    if(!user){
        return res.status(401).json({
            "error": "Auth error",
            "errorMessage": "Hacker!!?"
        });
    }
    
    req.body.user = user;
    next();
}

export default Tokenvarify;