const  express=require('express')
const path=require('path');
const app=express();
const PORT=process.env.PORT||4000
const server= app.listen(PORT,()=>{
    console.log(`server on port ${PORT}`)
})

const io=require('socket.io')(server)

app.use(express.static(path.join(__dirname,'view')))

io.on('connection',onConnected)

let socketsConnected=new Set()

function onConnected(socket){
    console.log(socket.id)
    socketsConnected.add(socket.id)

   io.emit('clients-total',socketsConnected.size)

    socket.on('disconnect',()=>{
        console.log("socket disconnected",socket.id)
        socketsConnected.delete(socket.id)
    })

    socket.on('message',(data)=>{
        console.log(data)
        socket.broadcast.emit('chat-mesg',data)
    })
}