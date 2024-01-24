const express=require('express');
const http=require('http');
const path=require("path")
const {connection}=require('./db')
const {userRoute}=require('./routes/user.route')
const {WebSocketServer}=require('ws');

const app= express();
const server=http.createServer(app);
const wss=new WebSocketServer({server})

app.use(express.static(path.join(__dirname,"../frontend")));

wss.on("connection",(socket)=>{
    console.log("new web Connection");
    if(socket.readyState===WebSocketServer.OPEN){
        socket.send("Welcome to the chat");
    }
   
    // socket.send("hello from the web socket server")
    socket.on('message',(mesg)=>{
        wss.clients.forEach((client)=>{
            if(client!==socket && client.readyState===WebSocketServer.OPEN){
                client.send(mesg);
            }
        })
    })
   
})

app.use(express.json());
app.use('/users',userRoute);

app.get('/',(req,res)=>{
    res.send("this is home page")
})


server.listen(8080,async()=>{
    try{
       await connection;
       console.log('connected to db')
       console.log("Server is running at port 8080")
    }catch(err){
        console.log(err)
    }
   
})