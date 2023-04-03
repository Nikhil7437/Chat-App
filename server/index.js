const http = require('http')
const express = require('express')
const cors = require('cors')
const app = express()
const socketIO = require("socket.io")

const port = 4500 || process.env.PORT

const users=[{}]
app.use(cors())


app.get("/", (req, res) => {
    res.send("hellow world")
})

const server = http.createServer(app)
const io = socketIO(server)


io.on("connection", (socket) => {

    console.log("new connection ");
    
    socket.on('joined',({name})=>
    {
        users[socket.id]=name
        console.log(socket.id)
        console.log(`${name}  has joined the chat` )


        socket.emit('welcome',{message:"welcome to the chat "})
        socket.broadcast.emit('userjoined',{name:'admin',message:`${users[socket.id]}joined the chat`})
          
    })
    socket.on('message',({message,id})=>
    {
        io.emit("sendmsg",{user:users[id],message,id})

    })

    socket.on('disconnect',()=>
    {
        socket.emit('leave',{name:"Admin",message: `${users[socket.id]} has left the chat`})
        console.log(`${users[socket.id]} user left`)
      
    })


})


server.listen(port, () => {
    console.log(`app is listning at port  http://localhost:${port}`)
})

