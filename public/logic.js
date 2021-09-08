//const e = require("express")

//const { emit } = require("nodemon")

let socket = io()
let name = ""
let inputField = document.getElementById('message')
let inputTyping = inputField.value
let typingTimer

let typingContainer = document.getElementById(showTyping)
showTyping.style.display = "none"

function hideFunc() {
    showTyping.style.display = 'none'
    clearTimeout(typingTimer)

}

    
//enter click på tangerbordet för att skicka meddelande
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage()
    }


    inputField.addEventListener('input', (e) => {
        showTyping.style.display = 'block'
        setTimeout(() => {
            showTyping.style.display = 'none'
        }, 5000)
    })
//})

socket.on(() => {
        document.addEventListener('keypress', function (e) {
        
        socket.emit(showTyping.style.display = 'block')
        
        })
})


window.onload = () => {
    name = prompt("Whats your name?")
    const room = prompt("which room would you like to join?")
    socket.emit('join', { name, room: 'starship' })
}

socket.on('joined', (incoming) => {
    console.log(incoming.name + " joined the room")
    const list = document.getElementById("messages")
    let listItem = document.createElement("li")
    listItem.innerText = incoming.name + " joined"
    list.appendChild(listItem)
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

socket.on('disconnected', (incoming) => {
    console.log(incoming)
    const list = document.getElementById("messages")
    let listItem = document.createElement("li")
    listItem.innerText = incoming.name + " user disconnected"
    list.appendChild(listItem)
    console.log("user disconnected")
});
