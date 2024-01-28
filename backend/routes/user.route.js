const express = require('express');
const { UserModel } = require('../models/user.model');
const bcrypt = require('bcrypt');
const cookie_parser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const userRoute = express.Router();
userRoute.use(cookie_parser());
userRoute.use(express.urlencoded({ extended: true }));
userRoute.use(express.json());
userRoute.use(express.static('public'));

userRoute.post('/register', upload.single('avatar'), async (req, res) => {
    const { name, email, pass } = req.body;
    const imgLink = req.file ||`data:image/png;base64,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`;


    try {
        // if (!/[A-Z]/.test(pass) || !/\d/.test(pass) || !/[!@#$%^&*]/.test(pass) || !(pass.length >= 8)) {
        //     return res.json({ mesg: "Incorrect password format" });
        // }

        const existing_user = await UserModel.findOne({ email });

        if (existing_user) {
            return res.json({ mesg: "User already exists with this email ID" });
        }

        bcrypt.hash(pass, 5, async (err, hash) => {
            if (err) {
                res.status(400).json({ error: err });
            } else {
                const user = new UserModel({ name, imgLink, email, pass: hash });
                await user.save();
                res.status(200).json({ mesg: 'User registered successfully' });
            }
        });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

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
                // localStorage.setItem('user',user.name)
                // console.log(user)
                return res.status(200).json({ mesg: "Login successful",userName: user.name,userImg:user.imgLink});
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