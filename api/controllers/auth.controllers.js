import User from "../models/user.model.js";
import bcrypt from "bcrypt";


export const signup = async (req,res ,next)=>{
    const {username, email,password} = req.body;

    const hashedpassword = await bcrypt.hash(password,8);
    const newUser =  new User({username,email,password:hashedpassword});
   
    try {
        await newUser.save()
        res.status(201).json({msg:"user created successfully"})
    } catch (error) {
        next(error);
    }
}