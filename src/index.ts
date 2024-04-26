import express from 'express';
import jwtvarify from './Middleware/TokenVarify';
import postrouter from './Routes/Posts/Postrouter';
import PostService from './Services/PostServices';
import userrouter from './Routes/Auths/Userroute';
import categoryrouter from './Routes/categorys/categoyroute';
var cookieParser = require('cookie-parser');
var cors = require('cors');
const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use('/auth',userrouter);
app.use('/post',postrouter);
app.use('/category',categoryrouter);

// app.post('/createcategory',(req,res)=>{
//     PostService.createCategory(res)
// })

//test code
// app.use('/',jwtvarify);
// app.post('/',(req:any,res:any)=>{
//     //console.log(req.user);    
//     res.send('done');
// })

app.listen(8000,()=>{
    //console.log("Server started!");
});