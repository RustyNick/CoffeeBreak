const express = require('express')
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

    socket.on('new-user', (data) => {

        
        let name = socket.id
        // const user = {
            //     id: socket.id,
            //     userName: data.name,
            // }
            let roomId = rooms.map((room) => {
                if(room.roomName == data.room && room.password != data.password){
                    console.log("banan")
                    io.emit("wrongPassword")
                    return
                } else if (room.roomName == data.room && room.password == data.password) {
                socket.join(data.room) 
                room.socketId.push(socket.id)
            }  /* else {
                rooms.push( {
                    roomName: data.room,
                    password: "",
                    socketId: [ socket.id ]
                }) 
        }




/* 
            else if (room.roomName == data.room && roomName.password == data.password) {
                room.socketId.push(socket.id)

            } else if (room.roomName != data.room && roomName.password != data.password) {
                alert("wrong password")
                return
            } else {
                rooms.push( {
                    roomName: data.room,
                    password: "",
                    socketId: [ socket.id ]
                })
            } */
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
            
            io.to(data.room).emit('message', data)
            console.log(rooms)
        })

        socket.on('showTyping', (data) => {
            io.to(data.room).emit('showTyping', data)
        })

    })


})

server.listen(port, () => console.log("listening on port " + port))
