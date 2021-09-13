let socket = io()
let name = ""
let room = ""
let data = ""
let inputField = document.getElementById('message')

let typingContainer = document.getElementById(showTyping)
showTyping.style.display = "none"

window.onload = () => {
    name = prompt("Whats your name?")
    room = prompt("which room would you like to join?")
    password = prompt("Enter password")
    data = {name, room, password}
    socket.emit('new-user', data)
}

function hideFunc() {
    showTyping.style.display = 'none'
    clearTimeout(typingTimer)
}

async function firstCommand () {

    let response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita")
    let result = await response.json()
    let ingredients = "ingredients: " + result.drinks[0].strIngredient1 + ", " + result.drinks[0].strIngredient2 + ", " + result.drinks[0].strIngredient3 + ", " + result.drinks[0].strIngredient4
    let instruction = result.drinks[0].strInstructions
    appendMessage(`${ingredients}`)
    appendMessage(`${instruction}`)
}

async function secondCommand () {

    let response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita")
    let result = await response.json()
    let ingredients = "ingredients: " + result.drinks[4].strIngredient1 + ", " + result.drinks[0].strIngredient2 + ", " + result.drinks[0].strIngredient3 + ", " + result.drinks[0].strIngredient4 + ", " + result.drinks[0].strIngredient5 + ", " + result.drinks[0].strIngredient6
    let instruction = result.drinks[4].strInstructions
    appendMessage(`${ingredients}`)
    appendMessage(`${instruction}`)
}

async function thirdCommand () {
    let response = await fetch("https://catfact.ninja/fact")
    let result = await response.json()
    appendMessage(`${result.fact}`)
}

function keyDownFunction() {
    if ( inputField.value.includes("/margarita") == true) {
        firstCommand()
    } else if ( inputField.value.includes("/strawberry") == true ) {
        secondCommand()
    } else if ( inputField.value.includes("/cats") == true) {
        thirdCommand()
    }
}

document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage()
    }
    socket.emit('showTyping', {name, room})
})

socket.on('showTyping', (data) => {
    console.log(data)
    showTyping.innerText = data.name + " is typing"
    showTyping.style.display = 'block'
    setTimeout(() => {
        showTyping.style.display = 'none'
    }, 5000)
})

socket.on('connected', (data) => {
    appendMessage(`${data.name}: joined the room`)
})

socket.on('user-disconnected', data => {
    appendMessage(`${data.name}: disconnected`)
});

socket.on('message', data => {
    appendMessage(`${data.name}: ${data.message}`)
})

function sendMessage() {
    let input = document.getElementById('message')
    const message = input.value
    input.value = ""
    socket.emit('message', { name, message, room })
}

function appendMessage(message) {
    const list = document.getElementById("messages")
    let listItem = document.createElement("li")
    listItem.innerText = message
    list.appendChild(listItem)
}

socket.on('wrongPassword', () => {
    location.reload()
})