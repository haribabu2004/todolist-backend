const express = require("express")
const router = express.Router()
const asyncHandler = require('express-async-handler')
const UserSchema = require("../Models/UserAuth")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

router.post("/register" , asyncHandler(async(req,res)=>{
    const{username,email,password} = req.body;

    if(!username || !email ||!password){
        res.status(400);
        throw new Error("Enter ALL Details")
    }

    const userAvail =await UserSchema.findOne({email})
    // console.log(userAvail);
    if(userAvail){
        res.status(409);
        throw new Error("User Already Exists")
    }

    const hashedPass = await bcrypt.hash(password,10);
    const user = await UserSchema.create({
        name: username,
        email: email,
        password : hashedPass
    })
    // console.log(user);
    
    if(user){
        res.status(201).json(user);
    }else{
        res.status(400);
        throw new Error("Can't create user");
    }
}))

router.post("/login", asyncHandler(async (req,res)=>{
    const{email,password} = req.body;

    if(!email || !password){
        res.status(400).json({message:"All feilds are mandatory"});
        throw new Error("All feilds are mandatory");
    }

    const user = await UserSchema.findOne({email});

    if(!user){
        res.status(404).json({message:"User doesn't exists"});
    }

    if(user && (await bcrypt.compare(password,user.password))){
        const usertoken = jwt.sign(
            {
                user:{
                    name:user.name,
                    email: user.email,
                    id: user.id,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "15m"}
        );
        console.log({message:`user login successful`})
        res.status(200).json({
            message: "Login successful",
            token: usertoken
        });
    }else{
        res.status(401);
        throw new Error("email or password is not valid");
    }
    
}))

module.exports = router;