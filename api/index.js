import express from 'express';
import mongoose from 'mongoose';

// routes import 
import userRouter from "./routes/user.route.js";

import dotenv from 'dotenv';
dotenv.config();



const app = express();

// connect mongoose
mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log('mongoDB connected');
})
.catch(err => console.log(err));


app.use('/api/user',userRouter);

app.listen(3005,()=>{
    console.log('server is runing on port 3005!!')
})