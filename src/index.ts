import express from 'express';
import signuprouter from './Routes/Auths/signup';
var cookieParser = require('cookie-parser');
var cors = require('cors');
const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use('/signup',signuprouter);


app.listen(8000,()=>{
    console.log("Server started!");
});