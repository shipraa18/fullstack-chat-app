import jwt from 'jsonwebtoken'



export const generateToken = (userId, res)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{expiresIn: '7d'});
    res.cookie("jwt",token,{
        maxAge: 7*24*60*60*1000,
        httpOnly: true, // prevents XSS attacks by not allowing client-side scripts to access the cookie
        secure: process.env.NODE_ENV !== 'development', // Set to true in production
        sameSite: "strict", //CSRF attacks cross-site request forgery attacks
    });
    return token;
}