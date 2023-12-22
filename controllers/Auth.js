const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.loginPage = (req,res)=>{
    res.render("login")
}
exports.signupPage = (req,res)=>{
    res.render("signup")
}
exports.homePage = (req,res)=>{
    res.render("homePage")
}
exports.signup = async(req,res)=>{
try{
    // EXTRACT ALL THE DATA FROM BODY
    const {name,email,password} = req.body;
    const existingUser =await User.findOne({email});
    //CHECK IF USER EXIST OR NOT
    if(existingUser){
        return res.status(400).json({
            status:false,
            message:"User already existed"
        })
    }

    let hashedPassword;
    // DO THE PASSWORD HASHING BEFORE SAVING TO DB
    try{
        hashedPassword =await bcrypt.hash(password,10)
    } catch(err){
        return res.status(400).json({
            status:false,
            message:"Error in hashing password"
        })
    }
    // SAVE ALL THE DATA IN DB
    const user =await User.create({
        name,
        email,
        password:hashedPassword,
    });
    // SEND THE RESPONSE BACK
    res.status(200).json({
        status:true,
        message:"User created successfully",
        data:user
    })
    // IN CASE OF ERROR 
}catch(error){
    console.error(error);
    return res.status(500).json({
        status:false,
        message:"User cannot be registered. Plaese try again"
    })
}
}

exports.login = async(req,res)=>{
    try{
        // RETRIVE THE DATA FROM BODY
        const {email,password} = req.body;
        // CHECK EMAIL AND PASSWORD FIELD IS EMPTY OF FILLED
        if(!email || !password){
            return res.status(400).json({
                status:false,
                message:"Please fill all the field carefully"
            })
        }
        // FIND THE USER WITH THE HELP OF EMAIL
        let user = await User.findOne({email});
        // IF THE GIVEN EMAIL DOES NOT MATCH
        if(!user){
            return res.status(401).json({
                status:false,
                message:"User doesn't exist"
            })
        }
        // CREATE A OBJECT NAMED AS PAYLOAD WHICH WILL BE PASSED WHILE CREATING JWT
        const payload = {
            email:user.email,
            id:user._id,
        }
        // CHECK WHETHER GIVEN PASSWORD MATCHES OR NOT
        if(await bcrypt.compare(password,user.password)){
            // AFTER PASSWORD MATCHED, CREATE A JASON WEB TOKEN(JWT)
            const token = jwt.sign(payload,
                 process.env.JWT_SECRET,
                 {
                   expiresIn:"2h" 
                 })
            // user = user.toObject();
            user.token = token;
            user.password = undefined;
            const options ={
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly:true
            }
            // CREATING COOKIES
            res.cookie("token",token,options).status(200);
            res.redirect("/homepage")
        } else{
            // IF THE PASSWORD DOES NOT MATCHES
            return res.status(403).json({
                status:false,
                message:"Password does not matched "
            })
        }
        // IN CASE OF ANY FAILURE
    } catch(error){
        console.error(error);
        return res.status(500).json({
            status:false,
            message:"Login failed. Please try again"
        })
    }
}