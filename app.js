require('dotenv').config()
const express = require("express")
const bodyParser = require('body-parser')
const path = require('path')
const axios = require('axios')
const cors = require('cors')
const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")
const bcrypt = require("bcrypt")
const adminRouter = require("./app/routes/adminRoutes")
const initializePassport = require("./passport-config")
const methodOverridee = require("method-override")
const app = express()
const connectToDB = require('./api/db/connect');
const users = []

const user = {
    id: Date.now().toString(),
    name: "Red Futura",
    email: "a",
    password: ""
}
async function hashPass() {
    const pass = await bcrypt.hash("a", 10)
    user.password = pass
    users.push(user)
    console.log(users)
    return pass
}
hashPass()

//! Passport & Check Auth
initializePassport(passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

//! Express Settings  
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/html/', 'views'))
app.use(express.static(path.join(__dirname, 'html')))
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverridee("_method"))

app.use("/admin", adminRouter)

//! Routes
//? GET
app.get("/", (req ,res) => {
    res.render("index")
})

app.get("/productos", (req ,res) => {
    res.render("prod-sec")
})

app.get("/proveedores", (req ,res) => {
    res.render("prov-sec")
})

app.get("/integrantes", (req ,res) => {
    res.render("int-sec")
})

app.get("/contacto", (req, res) => {
    res.render("contacto")
})

app.get("/login", checkNotAuthenticated, (req, res) => {
    res.render("login")
})

app.get("/admin", checkAuthenticated, (req, res) => {
    res.render("admin")
})

app.get("/admin/productos", checkAuthenticated, (req, res) => {
    res.render("productos")
})

app.get("/admin/proveedores", checkAuthenticated, (req, res) => {
    res.render("proveedores")
})

app.get("/admin/integrantes", checkAuthenticated, (req, res) => {
    res.render("integrantes")
})

//* POST
app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "admin/productos",
    failureRedirect: "login",
    failureFlash: true
}))

app.delete('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        res.redirect('/login');
    })
})

//! Server
app.listen(3000, async () => {
    try {
        // TODO: Commented because DB is not configured => it will throw error
        // await connectToDB();
        console.log("Server on Port 3000")
    } catch (error) {
        console.log('Error while connecting to DB: ', error)
    }
})