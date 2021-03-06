let socket = io()
let name = ""
let room = ""
let data = ""
let bot = 'BaristaBot'
let inputField = document.getElementById('message')

let typingContainer = document.getElementById(showTyping)
showTyping.style.display = "none"

window.onload = () => {
    appendJoinRoomInput()
}

document.getElementById("loginBtn").addEventListener("click", login)
document.getElementById('loginBtn').addEventListener('mouseenter', () => {

    let btn = document.getElementById('loginBtn')
    btn.style.transition = "0.5s"
    btn.innerHTML = `<i class="far fa-comments"></i>`

})
document.getElementById('loginBtn').addEventListener('mouseleave', () => {

    let btn = document.getElementById('loginBtn')
    btn.style.transition = "0.5s"
    btn.innerHTML = `Join Chat`

})

document.getElementById('signout').addEventListener('mouseenter', () => {

    let btn = document.getElementById('signout')
    btn.style.transition = "0.5s"
    btn.innerHTML = `<i class="fas fa-door-open"></i>`

})
document.getElementById('signout').addEventListener('mouseleave', () => {

    let btn = document.getElementById('signout')
    btn.style.transition = "0.5s"
    btn.innerHTML = `<i class="fas fa-door-closed">`

})

document.getElementById("checkUser").addEventListener("click", activeUsers)

function activeUsers() {

    if (document.getElementById("membersContainer") != undefined) {
        document.getElementById("membersContainer").remove()
        let membersContainer = document.createElement("div")
        membersContainer.id = "membersContainer"



        socket.emit("activeUsers", room)

        document.getElementById("body").appendChild(membersContainer)
    } else {
        let membersContainer = document.createElement("div")
        membersContainer.id = "membersContainer"


        socket.emit("activeUsers", room)
        document.getElementById("body").appendChild(membersContainer)
    }
}


socket.on("activeUsers", (data) => {
    document.getElementById("membersContainer")

    let users = data.map((user) => {
        let p = document.createElement("p")
        p.innerText = user.user
        p.style.fontSize = "2em"

        document.getElementById("membersContainer").appendChild(p)

    })

    let exitList = document.createElement('button')
    exitList.id = "exitList"
    exitList.innerText = "close"
    exitList.addEventListener('click', () => {
        let container = document.getElementById('membersContainer')
        container.style.animationName = "moveBack"
        container.style.animationDuration = "1s"
        container.style.top = "-50%"
        setTimeout(() => { container.remove }, 1000)
    })
    document.getElementById('membersContainer').append(exitList)
})


function collectData() {
    name = document.getElementById("inputName").value
    room = document.getElementById("roomInput").value
    password = document.getElementById("inputPass").value

    data = { name, room, password }
    return data
}

function clearData() {
    name = document.getElementById("inputName").innerText = ""
    room = document.getElementById("inputRoom").innerText = ""
    password = document.getElementById("inputPass").innerText = ""
}

function login() {
    collectData()
    if (data.name == "" || data.room == "" || data.password == "") {
        alert("You have to enter a name and a room")
        return
    } else {
        socket.emit('new-user', data)
    }
}

function showChat() {
    document.getElementById("loginBlock").style.display = "none"
}

socket.on("enterChat", (data) => {
    showChat()
    document.getElementById('roomName').innerText = data
})

function hideFunc() {
    showTyping.style.display = 'none'
    clearTimeout(typingTimer)
}

async function firstCommand() {

    let response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita")
    let result = await response.json()
    let ingredients = "ingredients: " + result.drinks[0].strIngredient1 + ", " + result.drinks[0].strIngredient2 + ", " + result.drinks[0].strIngredient3 + ", " + result.drinks[0].strIngredient4
    let instruction = result.drinks[0].strInstructions
    let cmd = ingredients + instruction
    let number = "1"
    socket.emit('cmdMessage', { number, room, cmd })
}

async function secondCommand() {

    let response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita")
    let result = await response.json()
    let ingredients = "ingredients: " + result.drinks[4].strIngredient1 + ", " + result.drinks[0].strIngredient2 + ", " + result.drinks[0].strIngredient3 + ", " + result.drinks[0].strIngredient4 + ", " + result.drinks[0].strIngredient5 + ", " + result.drinks[0].strIngredient6
    let instruction = result.drinks[4].strInstructions
    let cmd = ingredients + instruction
    let number = "2"
    socket.emit('cmdMessage', { number, room, cmd })
}

async function thirdCommand() {
    let response = await fetch("https://catfact.ninja/fact")
    let result = await response.json()
    let cmd = result.fact
    let number = "3"
    socket.emit('cmdMessage', { number, room, cmd })
}

async function fourthCommand() {
    let response = await fetch("https://api.sampleapis.com/coffee/hot")
    let result = await response.json()
    let randomNumber = Math.floor(Math.random() * 19) + 1;
    let cmd = result[randomNumber]
    let number = "4"
    socket.emit('cmdMessage', { number, room, cmd })
    document.getElementById("commands").style.display = "none"
}

function keyDownFunction() {

    socket.emit('showTyping', { name, room })
    if (inputField.value.includes("/") == true) {
        document.getElementById("commands").style.display = "block"
    } else if (inputField.value.includes("") == true) {
        document.getElementById("commands").style.display = "none"
    } else {
        document.getElementById("commands").style.display = "none"

    }

}

function appendCreateRoomInput() {
    document.getElementById('roomDiv').innerText = ""

    let div = document.createElement('div')

    let roomInput = document.createElement('input')
    roomInput.id = "roomInput"
    roomInput.placeholder = "Room name..."
    roomInput.style.width = "100%"

    let togglebtn = document.createElement('button')
    togglebtn.innerText = "Join a existing room"
    togglebtn.style.width = "100%"
    togglebtn.addEventListener('click', appendJoinRoomInput)

    div.append(roomInput, togglebtn,)
    document.getElementById('roomDiv').appendChild(div)
}

function appendJoinRoomInput() {
    document.getElementById('roomDiv').innerText = ""
    getRoomlist()
    let div = document.createElement('div')

    let roomList = document.createElement('select')
    roomList.id = "roomInput"
    roomList.style.width = "100%"

    let togglebtn = document.createElement('button')
    togglebtn.style.width = "100%"
    togglebtn.innerText = "Create a Room"
    togglebtn.addEventListener('click', appendCreateRoomInput)

    div.append(roomList, togglebtn)
    document.getElementById('roomDiv').appendChild(div)

}
socket.on('getRoom', (data) => {
    let selectRoom = document.getElementById('roomInput')
    let option = document.createElement('option')
    option.value = data
    option.text = data
    selectRoom.append(option)
})

function getRoomlist() {
    socket.emit('getRoom')
}

document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage()
    }
})


socket.on('showTyping', (data) => {
    showTyping.innerText = data.name + " is typing..."
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
    document.getElementById("commands").style.display = "none"
    return
})

socket.on('cmdMessage', (data) => {

    let cmd = data.cmd
    console.log(cmd)
    if (data.number === '1') {
        appendBotMessage(`${cmd}`)
    } else if (data.number === "2") {
        appendBotMessage(`${cmd}`)
    } else if (data.number === "3") {
        appendBotMessage(`${cmd}`)
    } else if (data.number === '4') {
        appendBotMessage(`${cmd.title}, Desc: ${cmd.description} Ingredients: ${cmd.ingredients}`)
    }
})


function sendMessage() {
    let input = document.getElementById('message')
    const message = input.value
    input.value = ""

    if (message === '/coffee') {
        fourthCommand()
        return
    } else if (message === '/margarita') {
        firstCommand()

    } else if (message === '/strawberry') {
        secondCommand()

    } else if (message === '/cats') {
        thirdCommand()

    }
    socket.emit('message', { name, message, room })

}

function getDateAndTime() {
    let dateTime = ""
    let today = new Date();

    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    if (today != today) {
        dateTime = "sent" + date
    } else {
        dateTime = "Today at " + time
    }

    return dateTime
}



function appendMessage(message) {
    const list = document.getElementById("messages")
    let listItem = document.createElement("li")
    let chatItem = document.createElement("div")
    chatItem.style.width = "100%"
    chatItem.innerHTML = `<span> ${getDateAndTime()}</span > <p>${message}</p>`
    listItem.append(chatItem)
    list.appendChild(listItem)
    window.scrollTo(0, document.body.scrollHeight)
}

function appendBotMessage(message) {
    const list = document.getElementById("messages")
    let listItem = document.createElement("li")
    listItem.style.backgroundColor = "#a3937a"
    listItem.style.color = "#edd2a8"
    let chatItem = document.createElement("div")
    chatItem.style.width = "100%"
    chatItem.innerHTML = `<span>BaristaBot</span><span> ${getDateAndTime()}</span > <p>${message}</p>`
    listItem.append(chatItem)
    list.appendChild(listItem)
    window.scrollTo(0, document.body.scrollHeight)
}

socket.on('wrongPassword', () => {
    alert("wrong password, try again")
    location.reload()
    return
})

function newRoom() {
    socket.emit("new-room", data)
}
