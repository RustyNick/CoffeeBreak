const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const port = 3000

app.use(express.static('public'))


const users = []

io.on('connection', (socket) => {
    socket.on('join', ({ name, room }) => {
        io.to(room).emit('joined', { name })
    })

    socket.on('new-user', ({ name, room }) => {
        /* users[socket.id] = name */
        const user = {
            id: socket.id,
            userName: name,
            roomName: room
        }
        users.push(user)
        io.emit('user-connected', user)
    })

    socket.on("disconnect", () => {
        io.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })

    socket.on("message", (msg) => {
        console.log(msg)
        io.emit('message', msg)
    })

    socket.on('showTyping', (name) => {
        io.emit('showTyping', name)
    })

})

server.listen(port, () => console.log("listening on port " + port))