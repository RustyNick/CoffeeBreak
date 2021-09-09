let socket = io()
let name = ""
let inputField = document.getElementById('message')
let inputTyping = inputField.value
let typingTimer

let typingContainer = document.getElementById(showTyping)
showTyping.style.display = "none"

window.onload = () => {
    name = prompt("Whats your name?")
    const room = prompt("which room would you like to join?")
    socket.emit('new-user', { name })
}

function hideFunc() {
    showTyping.style.display = 'none'
    clearTimeout(typingTimer)

}

//enter click på tangerbordet för att skicka meddelande
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage()
    }
    socket.emit('showTyping', { name })
})

socket.on('showTyping', (name) => {
    showTyping.innerText = name.name + " is typing"
    showTyping.style.display = 'block'
    setTimeout(() => {
        showTyping.style.display = 'none'
    }, 5000)
})


socket.on('user-connected', ({ name }) => {
    appendMessage(`${name}: joined chat`)
})

socket.on('user-disconnected', name => {
    appendMessage(`${name.name}: disconnected`)
});

socket.on('message', name => {
    appendMessage(`${name.name}: ${name.message}`)
})

function sendMessage() {
    let input = document.getElementById('message')
    const message = input.value
    input.value = ""
    socket.emit('message', { name, message })
}

function appendMessage(message) {
    const list = document.getElementById("messages")
    let listItem = document.createElement("li")
    listItem.innerText = message
    list.appendChild(listItem)
}
