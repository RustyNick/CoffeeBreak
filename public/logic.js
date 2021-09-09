let socket = io()
let name = ""
let inputField = document.getElementById('message')

let typingContainer = document.getElementById(showTyping)
showTyping.style.display = "none"


async function firstCommand () {

    let response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita")
    let result = await response.json()
    console.log("ingredients: " + result.drinks[0].strIngredient1 + ", " + result.drinks[0].strIngredient2 + ", " + result.drinks[0].strIngredient3 + ", " + result.drinks[0].strIngredient4)
    await console.log(result.drinks[0].strInstructions)
}

async function secondCommand () {

    let response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita")
    let result = await response.json()
    console.log("ingredients: " + result.drinks[4].strIngredient1 + ", " + result.drinks[0].strIngredient2 + ", " + result.drinks[0].strIngredient3 + ", " + result.drinks[0].strIngredient4 + ", " + result.drinks[0].strIngredient5 + ", " + result.drinks[0].strIngredient6)
    await console.log(result.drinks[4].strInstructions)
}

async function thirdCommand () {
    let response = await fetch("https://catfact.ninja/fact")
    let result = await response.json()
    console.log(result.fact)
}

function keyDownFunction() {
    if ( inputField.value.includes("/margarita") == true) {
        console.log("a message")
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
    socket.emit('showTyping', { name })
})

socket.on('showTyping', (incoming) => {
    showTyping.innerText = incoming.name + " is typing"
    showTyping.style.display = 'block'
    setTimeout(() => {
        showTyping.style.display = 'none'
    }, 5000)
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
