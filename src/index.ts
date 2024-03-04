import express from 'express';
import signuprouter from './Routes/Auths/signup';
var cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser())
app.use(express.json());
app.use('/signup',signuprouter);


app.listen(8000,()=>{
    console.log("Server started!");
});