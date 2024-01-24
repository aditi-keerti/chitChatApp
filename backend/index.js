const express=require('express');
const {connection}=require('./db')
const {userRoute}=require('./routes/user.route')

const app= express();
app.use(express.json());
app.use('/users',userRoute);

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