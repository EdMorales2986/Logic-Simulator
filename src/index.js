const express = require('express')
const app = express()
const path = require('path')

const http = require('http')
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

// Settings
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'static')))

//Socket
const { handler } = require('./socket')
handler(io)

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.use(require('./routes/index.routes.js'))
server.listen(4000)
console.log('http://localhost:4000')


// npm run dev
// peerjs --port 4001