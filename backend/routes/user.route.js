const express=require('express')
const {UserModel}=require('../models/user.model')
const bcrypt=require('bcrypt');
const cookie_parser=require('cookie-parser');
const jwt= require("jsonwebtoken")

const userRoute=express.Router();
userRoute.use(cookie_parser());

userRoute.post('/register',async(req,res)=>{
    const {name,age,gender,email,pass}=req.body;
     try{
        if(!/[A-Z]/.test(pass)||!/\d/.test(pass)||!/[!@#$%^&*]/.test(pass)||!(pass.length>=8)){
           return res.json({mesg:"Incorrect pass word format"})
        }
        const existing_user=await UserModel.findOne({email});
        if(existing_user){
          return  res.json({mesg:"User already exists with this email ID"})
        }
        bcrypt.hash(pass,5,async(err,hash)=>{
             if(err){
                res.status(400).json({error:err})
             }else{
                const user= new UserModel({name,age,gender,email,pass:hash});
                await user.save();
                res.status(200).json({mesg:'user registered'})
             }
        })

     }catch(err){
        res.status(401).json({error:err})
     }
})

userRoute.post('/login', async (req, res) => {
    const { email, pass } = req.body;
    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ mesg: "User not found. Please register." });
        }

        bcrypt.compare(pass, user.pass, (err, result) => {
            if (result) {
                const access_token = jwt.sign({ name: "aditi" }, 'chitchat', { expiresIn: '1d' });
                const refresh_token = jwt.sign({ name: "bhadoriya" }, 'chitchat_app', { expiresIn: '7d' });
                res.cookie('refresh_token', refresh_token, { httpOnly: true, secure: true });
                res.cookie('access_token', access_token, { httpOnly: true, secure: true });
                return res.status(200).json({ mesg: "Login successful" });
            } else {
                return res.status(401).json({ mesg: "Incorrect password" });
            }
        });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});


userRoute.post('/logout',(req,res)=>{
    const access_token=req.headers.authorization?.split(" ")[1]
    const refresh_token=req.headers.authorization?.split(" ")[1]
    try{
        res.clearCookie('refresh_token');
        res.clearCookie('access_token')

        res.status(200).json({mesg:"logout successfull"})

    }catch(err){
            res.status(400).json({error:err})
    }
})

module.exports={
    userRoute
}