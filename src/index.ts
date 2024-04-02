import express from 'express';
import authrouter from './Routes/Auths/authroute';
import jwtvarify from './Middleware/TokenVarify';
import postrouter from './Routes/Posts/Postrouter';
var cookieParser = require('cookie-parser');
var cors = require('cors');
const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use('/auth',authrouter);
app.use('/post',postrouter);

//test code
app.use('/',jwtvarify);
app.post('/',(req:any,res:any)=>{
    console.log(req.user);    
    res.send('done');
})

app.listen(8000,()=>{
    console.log("Server started!");
});