const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const port = 3000

app.use(express.static('public'))

const chatBot = 'Barista Bot'

const users = []

io.on('connection', (socket) => {
    socket.on('joinRoom', ({ userName, roomName }) => {
        const user = userJoin(socket.id, userName, roomName);
        console.log(user)


        socket.join(user.roomName);

        io.to(user.roomName)
            .emit('')

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
        io.emit('user-disconnected', users)
        delete users[socket.id]
        //      users[socket.id].splice(0, 1)
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