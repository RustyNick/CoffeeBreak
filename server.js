const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const port = 3000

app.use(express.static('public'))

const rooms = [
    {
        roomName: "coffeeRoom",
        password: "1234",
        socketId: []
    },
    {
        roomName: "Brainstorming",
        password: "4321",
        socketId: []
    }
]

io.on('connection', (socket) => {

    socket.on('new-user', (data) => {

        rooms.map((room) => {
            if (room.roomName == data.room) {
                if (room.password == data.password) {
                    socket.join(data.room)
                    console.log(data.name)
                    room.socketId.push({ "userId": socket.id, "user": data.name })
                    io.to(room.roomName).emit("enterChat", room.roomName)

                } else {
                    socket.emit("wrongPassword")
                }

            } else {
                let roomCheck = rooms.find(room => room.roomName == data.room)
                if (roomCheck == undefined) {
                    rooms.push({
                        roomName: data.room,
                        password: data.password,
                        socketId: [{ "userId": socket.id, "user": data.name }]
                    })
                    socket.join(data.room)
                    socket.emit("enterChat")
                }
            }
        })
        io.to(data.room).emit('connected', data)

        socket.on("disconnect", () => {
            io.to(data.room).emit('user-disconnected', data)
            let roomCheck = rooms.findIndex(room => room.roomName == data.room)
            let userCheck = rooms.findIndex(user => user.userName == data.user)

            let room = rooms[roomCheck]

            console.log("lsit after disconnect" + rooms)
            rooms[roomCheck].socketId.splice(0, 1)
            delete socket.id
        })

        socket.on("message", (data) => {
            io.to(data.room).emit('message', data)
        })

        socket.on("cmdMessage", (data) => {
            io.to(data.room).emit('cmdMessage', data)
        })


        socket.on('showTyping', (data) => {
            io.to(data.room).emit('showTyping', data)
        })

        socket.on("activeUsers", (data) => {
            let roomCheck = rooms.findIndex(rooms => rooms.roomName == data)
            let userList = rooms[roomCheck].socketId
            console.log(userList)

            socket.emit("activeUsers", userList)
        })



    })
    socket.on('getRoom', () => {
        for (let i = 0; i < rooms.length; i++) {
            const roomList = rooms[i];
            socket.emit('getRoom', roomList.roomName)
        }
    })

})

server.listen(port, () => console.log("listening on port " + port))
