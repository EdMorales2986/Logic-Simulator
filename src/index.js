const express = require('express') // Import of module express
const app = express() // Express object
const path = require('path') // Module for universal PATH Setting
const session = require('express-session')

// node src/index.js

// Settings
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'static')))

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false
}))

// Routes
app.use(require('./routes/index.routes.js'))
app.listen(4000)
console.log('http://localhost:4000')
