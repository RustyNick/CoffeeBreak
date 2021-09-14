const express = require('express')
const { exit } = require('process')
const { REPL_MODE_SLOPPY } = require('repl')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const port = 3000

app.use(express.static('public'))

const rooms = [
    {
        roomName: "starship",
        password: "1234",
        socketId: []
    },
    {
        roomName: "a",
        password: "4321",
        socketId: []
    }
]

io.on('connection', (socket) => {
    
/*             socket.on('newRoom', (data) => {
            rooms.push({
                roomName: data.room,
                password: data.password,
                socketId: [ socket.id ]
            })
            console.log(rooms)
            io.to(rooms.roomName).emit("enterChat")
        }) */

    socket.on('new-user', (data) => {
        
            rooms.map((room) => {
                if(room.roomName == data.room) {
                    if(room.password == data.password) {
                        socket.join(data.room) 
                        room.socketId.push(socket.id)
                        io.to(room.roomName).emit("enterChat")
                        
                    } else {
                        socket.emit("wrongPassword")
                    }

                } else {
                    let roomCheck = rooms.find(room => room.roomName == data.room)
                    if(roomCheck == undefined) {
                        rooms.push( {
                            roomName: data.room,
                            password: data.password,
                            socketId: [ socket.id ]
                        })
                    socket.join(data.room) 
                    socket.emit("enterChat")
                    }
                }
            })
            
            console.log(rooms)
        
        //roomId.push(name)
        io.to(data.room).emit('connected', data)

        socket.on("disconnect", () => {
            io.to(data.room).emit('user-disconnected', data)
            delete socket.id
        })

        socket.on("message", (data) => {
            console.log("message serverside")
            io.to(data.room).emit('message', data)
        })

        socket.on('showTyping', (data) => {
            io.to(data.room).emit('showTyping', data)
        })

    })


})

server.listen(port, () => console.log("listening on port " + port))
