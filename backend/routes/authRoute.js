import express from "express";
import "dotenv/config";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const router = express.Router();
const generateToken =(userId) =>{
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "15d"});
}
router.post("/register", async (req, res) => {
    try {
        const {email, username, password} = req.body;
        if(!email || !username || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        if(username.length < 3)
            return res.status(400).json({message:"Username must be atleast 3 characters"});
        if(password.length < 6)
            return res.status(400).json({message:"Password must be atleast 6 characters"});
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const profileImage = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${username}`
        const newUser = new User({
            email,
            username,
            password: hashedPassword,
            profileImage
        })
        await newUser.save();
        const token = generateToken(newUser._id);
        res.status(201).json({
            token,
            user: {
                id:newUser._id,
                username: newUser.username,
                email: newUser.email,
                profileImage: newUser.profileImage,
                createdAt: newUser.createdAt
            },
        });
    } catch (error) {
        console.log("Error occured: ",error);
        res.status(500).json({message:"Internal server error"});
    }
});
router.post("/login", async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password)
            return res.status(400).json({message:"All fields are required"});
        const existingUser = await User.findOne({email});
        if(!existingUser)
            return res.status(400).json({message:"User does not exist"});
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if(!isMatch)
            return res.status(400).json({message:"Invalid credentials"});
          const token = generateToken(existingUser._id);
        res.status(201).json({
            token,
            user: {
                id:existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                profileImage: existingUser.profileImage,
                createdAt: newUser.createdAt
            },
        });
    } catch (error) {
        console.log("Error occured in login route: ", error);
        res.status(500).json({message: "Internal server error"});
    }
});
export default router;