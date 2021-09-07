let socket = io()
let name = ""

window.onload = () => {
    name = prompt("Whats your name?")
}

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
})

if(typing = true) {
    console.log("type")
}