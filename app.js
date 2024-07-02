require('dotenv').config()
const express = require("express")
const bodyParser = require('body-parser')
const path = require('path')
const axios = require('axios')
const cors = require('cors')
const app = express()

//! Express Settings  
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/html/', 'views'))
app.use(express.static(path.join(__dirname, 'html')))
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//! Routes
app.get("/", (req, res) => {
    res.render("index")
})

app.listen(3000, () => {
    console.log("Server on Port 3000")
})