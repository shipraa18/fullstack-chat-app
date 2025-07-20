import { generateToken } from "../lib/utils.js";
import User from  "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";



export const signup =async (req,res)=>{
    const {email,fullName,password}=req.body;
    try{

        if(!email || !fullName || !password)
        {
            return res.status(400).json({
                message: "all fields are required"
            });

        }
        if(password.length <6)
        {
            return res.status(400).json({
                message: "password must be at least 6 characters long"
            });
        }

        const user=await User.findOne({email});
        if(user)
        {
            return res.status(400).json({
                message: "user already exists with this email"
            })
        }
        const salt=await bcrypt.genSalt(5);
        const hashedPass=await bcrypt.hash(password,salt);
        const newUser=await new User({
            email,
            fullName,
            password: hashedPass,
        })
        if(newUser)
        {
            //generate jwt token here
            await newUser.save();
            generateToken(newUser._id,res);
            return res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                profilePic: newUser.profilePic,
            })
        }
        else{
            return res.status(400).json({
                message: "invalid user data"
            });
        }


    }catch(error)
    {
        console.log("error in signup controller",error.message);
        return res.status(500).json({message: "internal server error"});
    }
};
export const login = async (req,res)=>{
    const {email, password}=req.body;
    try{
        if(!email || !password)
        {
            return res.status(400).json({
                message: "the fields are required"
            });
        }
        const user=await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({
                message: "invalid email id provide correct email"
            })
        }
        const orgpass=user.password;
        const isPasswordCorrect=await bcrypt.compare(password,orgpass);
        if(!isPasswordCorrect)
        {
            return res.status(400).json({
                message: "invalid credentials"
            })
        }

        generateToken(user._id, res);
        return res.status(200).json({
            _id:user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch(error)
    {
        console.log("error in login controller",error.message);
        return res.status(500).json(
            {
                message: "internal server error"
            }
        )
    }
}

export const logout = async (req, res)=>{
    try{
        res.cookie("jwt","",{maxAge:0})
        return res.status(200).json({message: "logged out successfully"});
    }
    catch(error)
    {
        console.log("error in logout controller", error.message);
        return res.status(500).json({message: "internal server error"});
    }
    
}

export const updateProfile=async (req,res)=>{
    try{
        const {profilePic}=req.body;
        const userId=req.user._id;
        if(!profilePic)
        {
            return res.status(401).json({
                message: "profile pic is required"
            })
        }

        const uploadResponse=await cloudinary.uploader.upload(profilePic);
        const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});
        return  res.status(200).json(updatedUser)
    
    }catch(error)
    {
        console.log("error in update profile",error)
        return  res.status(400).json({message: "internal server error"})

    }
};

export const checkAuth=(req,res)=>{
    try{
       return res.status(200).json(req.user);
    }catch(error)
    {
        console.log("error in checkauth controller", error.message)
        return res.status(500).json({message: "internal server error"});
    }
}