import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import User from "../models/user.model.js"

export const protectRoute=async (req,res,next)=>{
    try{
        const token=req.cookies.jwt
        if(!token)
        {
            return res.status(401).json({message: "Unauthorized-no token provided"});
        }
        const decoded_token=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded_token)
        {
            return res.status(401).json({message: "unauthorzed-invalid token"});
        }

        const user=await User.findById(decoded_token.userId).select("-password");
        if(!user)
        {
            return res.status(401).json({message: "user not found"});
        }

        req.user=user;

        next();

    }catch(error)
    {
        console.log("error in protectroute middleware",error.message);
        return res.status(500).json({message: "internal server error"});
        
    }

} 