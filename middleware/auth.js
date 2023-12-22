const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.auth = (req,res,next)=>{
    try{
        const token = req.body.token || req.cookies.token;
        // I AM NOT ABLE TO USE THIS : req.header("Authorization").replace("Bearer ", "")
        
        // console.log("token",token);
        if(!token || token === undefined){
            return res.status(401).json({
                status:false,
                message:"Token Missing"
            })
        }
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            // console.log("decode",decode);
            req.user = decode;
        } catch(err){
            return res.status(401).json({
                status:false,
                message:"Invalid token"
            })
        }
    
    } catch(error){
        console.error(error)
        return res.status(401).json({
            status:false,
            message:"Something went wrong. Please try again"
        })
    }
    next();
}