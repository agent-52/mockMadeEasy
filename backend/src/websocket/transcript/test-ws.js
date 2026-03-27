const WebSocket = require("ws")

const socket = new WebSocket("ws://localhost:3000")

socket.on("open", () =>{
    console.log("Connected")
})
socket.on("message", (message) => {
    console.log(message.toString())
})

socket.on("error", (err) => {
  console.log("Error:", err)
})