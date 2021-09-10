let socket = io()
let name = ""
let room = ""
let inputField = document.getElementById('message')
let chatMessages = document.getElementById('messages')

let typingContainer = document.getElementById(showTyping)
showTyping.style.display = "none"

window.onload = () => {
    name = prompt("Whats your name?")
    room = prompt("which room would you like to join?")
    socket.emit('new-user', { name, room })
}

function hideFunc() {
    showTyping.style.display = 'none'
    clearTimeout(typingTimer)
}

async function firstCommand() {

    let response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita")
    let result = await response.json()
    let ingredients = "ingredients: " + result.drinks[0].strIngredient1 + ", " + result.drinks[0].strIngredient2 + ", " + result.drinks[0].strIngredient3 + ", " + result.drinks[0].strIngredient4
    let instruction = result.drinks[0].strInstructions
    appendMessage(`${ingredients}`)
    appendMessage(`${instruction}`)
}

async function secondCommand() {

    let response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita")
    let result = await response.json()
    let ingredients = "ingredients: " + result.drinks[4].strIngredient1 + ", " + result.drinks[0].strIngredient2 + ", " + result.drinks[0].strIngredient3 + ", " + result.drinks[0].strIngredient4 + ", " + result.drinks[0].strIngredient5 + ", " + result.drinks[0].strIngredient6
    let instruction = result.drinks[4].strInstructions
    appendMessage(`${ingredients}`)
    appendMessage(`${instruction}`)
}

async function thirdCommand() {
    let response = await fetch("https://catfact.ninja/fact")
    let result = await response.json()
    appendMessage(`${result.fact}`)
}

function keyDownFunction() {
    if (inputField.value.includes("/margarita") == true) {
        firstCommand()
    } else if (inputField.value.includes("/strawberry") == true) {
        secondCommand()
    } else if (inputField.value.includes("/cats") == true) {
        thirdCommand()
    }
}

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


socket.on('user-connected', (user) => {
    console.log(user)
    appendMessage(`${user.userName}: joined chat ${user.roomName}`)
})

socket.on('user-disconnected', name => {
    appendMessage(`${name.name}: disconnected`)
});

socket.on('message', (msg) => {
    /* appendMessage(`${ name.message }`) */
    console.log(msg)
    appendMessage(`${msg.name}: ${msg.message}`)

    chatMessages.scrollTop = chatMessages.scrollHeight;
})

function sendMessage() {
    let input = document.getElementById('message')
    const message = input.value
    input.value = ""
    socket.emit('message', { name, message })
    input.focus()
}

/* function appendMessage(message) {
    const list = document.getElementById("messages")
    let listItem = document.createElement("li")
    listItem.innerText = message
    list.appendChild(listItem)
} */

function appendMessage(message) {
    console.log(message)
    const list = document.getElementById("messages")
    let listItem = document.createElement("li")
    let chatItem = document.createElement("div")
    chatItem.innerHTML = `<span>USER</span> <span> sent 10: 25</span> <p>${message}</p>`
    listItem.append(chatItem)
    list.appendChild(listItem)
}
function getUser(id) {
    return user.find(user => user.id === id)
}