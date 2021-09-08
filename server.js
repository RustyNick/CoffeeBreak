const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const port = 3000

app.use(express.static('public'))


io.on('connection', (socket) => {

    socket.on('join', (incomning) => {
        console.log('connected')
        socket.id
        socket.join(incomning.room)
        io.to(incomning.room).emit('joined', { name: incomning.name })
    })

    socket.on("message", (incoming) => {
        console.log(incoming)
        io.emit('message', incoming)
    })

    socket.on("disconnect", () => {
        console.log("user disconnected")
    })
})

http.listen(port, () => console.log("listening on port " + port))