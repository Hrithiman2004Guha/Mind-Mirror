import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectRoute = async(req,res,next) =>{
    try{
        const token = req.header("Authorization").replace("Bearer ","");
        if(!token) return res.status(401).json({message:"Access denied"});
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        if(!user)
        {
            return res.status(400).json({message:"Token is invalid"});
        }
        req.user = user;
        next();
    }catch(error){
        console.error("Authentication error", error);
        res.status(401).json({message:"Token is not valid"});
    }
};
export default protectRoute;