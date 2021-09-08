const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const port = 3000

app.use(express.static('public'))


io.on('connection', (socket) => {


    socket.on('join', (incoming) => {
        console.log('connected', incoming.room)
        socket.id
        socket.join(incoming.room)
        io.to(incoming.room).emit('joined', { name: incoming.name })
    })

    socket.on("message", (incoming) => {
        console.log(incoming)
        io.emit('message', incoming)
    })

    socket.on("disconnect", (incoming) => {
        console.log(incoming.name + " disconnected")
        io.emit('disconnected', { name: incoming.name })
    })

        socket.on("message", (incoming) => {
        //console.log(incoming)
        io.emit('message', incoming)
    })

    socket.on('showTyping', (incoming) => {
        io.emit('showTyping', incoming)
    })
})

http.listen(port, () => console.log("listening on port " + port))