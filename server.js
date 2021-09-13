const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const port = 3000

app.use(express.static('public'))

const rooms = [
    {
        roomName: "starship",
        password: "123321",
        socketId: []
    },
    {
        roomName: "a",
        password: "123321",
        socketId: []
    }
]

    socket.on("message", (msg) => {
        console.log(msg)
        io.emit('message', msg)
    })
io.on('connection', (socket) => {

    socket.on('new-user', (data) => {

        socket.join(data.room) 
const chatBot = 'Barista Bot'

const users = []

        let name = socket.id
        // const user = {
        //     id: socket.id,
        //     userName: data.name,
        // }
        let roomId = rooms.map((room) => {
            if (room.roomName == data.room)
            room.socketId.push(socket.id)
        })
        console.log(rooms.roomName, data.room)

        //roomId.push(name)
        io.to(data.room).emit('connected', data)
        console.log(rooms)

        socket.on("disconnect", () => {
            io.to(data.room).emit('user-disconnected', data)
            delete socket.id
        })

        socket.on("message", (data) => {
            // let findId = users.findIndex(user => user.id == socket.id)
    
            // let theRoom = users[findId].roomName
            
            // let sameRoom = users.filter(user => user.roomName == theRoom)
            // console.log(sameRoom)
            
            io.emit('message', data)

        })

        socket.on('showTyping', (data) => {
            console.log(data + "rad 62")
            io.to(data.room).emit('showTyping', data)
        })

    })


})

server.listen(port, () => console.log("listening on port " + port))
