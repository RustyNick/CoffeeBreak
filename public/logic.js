let socket = io()
let name = ""

//enter click på tangerbordet för att skicka meddelande
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage()
    }
})

window.onload = () => {
    name = prompt("Whats your name?")
    const room = prompt("which room would you like to join?")
    socket.emit('join', { name, room: 'starship' })
}

socket.on('joined', (incomning) => {
    console.log(incomning.name + " joined the room")
})

socket.on('message', (incoming) => {
    const list = document.getElementById("messages")
    let listItem = document.createElement("li")
    listItem.innerText = incoming.name + ": " + incoming.message
    list.appendChild(listItem)
})

function sendMessage() {
    let input = document.getElementById('message')
    const message = input.value
    input.value = ""
    socket.emit('message', { name, message })
}

socket.on('disconnect', () => {
    const list = document.getElementById("messages")
    let listItem = document.createElement("li")
    listItem.innerText = name + " user left"
    list.appendChild(listItem)
});