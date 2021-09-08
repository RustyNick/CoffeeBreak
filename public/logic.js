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

//socket.on(() => {

    //enter click på tangerbordet för att skicka meddelande
    document.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage()
        }
        
        //emit to join on
        //emit skickar till server, där ska meddelande med incoming.name tas emot för att sedan
        //skicka tillbaka name för att på kliented renderas ut tillsammans med typing..
        inputField.addEventListener('input', (e) => {
            socket.emit('show', showTyping.style.display = 'block')
            setTimeout( () => {
                socket.emit(showTyping.style.display = 'none')
            }, 5000)
         })
    
    })
//})

socket.on(() => {
        document.addEventListener('keypress', function (e) {
        
        socket.emit(showTyping.style.display = 'block')
        
        })
})


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
    //let input = document.getElementById('message')
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