import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from "cookie-parser";

// routes import 
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from './routes/listing.route.js'

import dotenv from 'dotenv';

dotenv.config();



const app = express();

// connect mongoose
mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log('mongoDB connected');
})
.catch(err => console.log(err));


app.listen(3005,()=>{
  console.log('server is runing on port 3005!!')
})



// middlewares
app.use(express.urlencoded({extended:false}));
app.use(cors())
app.use(express.json());
app.use(cookieParser());




// route handling
app.use('/api/user',userRouter);
app.use("/api/auth",authRouter);
app.use("/api/listing",listingRouter);

// error handling middleware
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message= err.message || "Internal server error";
    return res.status(statusCode).json({
      success:false,
      statusCode:statusCode,
      message:message,
    });
  });


 