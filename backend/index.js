const express=require('express');
const {connection}=require('./db')





const app= express();

app.get('/',(req,res)=>{
    res.send("this is home page")
})

app.listen(8080,async()=>{
    try{
       await connection;
       console.log('connected to db')
       console.log("Server is running at port 8080")
    }catch(err){
        console.log(err)
    }
   
})