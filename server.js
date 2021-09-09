const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const port = 3000

app.use(express.static('public'))


const users = {}

io.on('connection', (socket) => {
    socket.join('some room', () => {
        io.to('some room').emit('some event');
    })

    socket.on('new-user', name => {
        users[socket.id] = name
        io.emit('user-connected', name)
    })

    socket.on("disconnect", () => {
        io.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })

    socket.on("message", (name) => {
        io.emit('message', name)
    })

    socket.on('showTyping', (name) => {
        io.emit('showTyping', name)
    })

})

server.listen(port, () => console.log("listening on port " + port))