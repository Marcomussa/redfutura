require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const bcrypt = require("bcrypt");
const methodOverride = require("method-override");
const connectToDB = require('./api/db/connect');

const app = express();

// Middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'html', 'views'));
app.use(express.static(path.join(__dirname, 'html')));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());
app.use(session({
    secret: '123456',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// Import routers
const indexRouter = require('./routes/index');
const productosRouter = require('./routes/productos');
const proveedoresRouter = require('./routes/proveedores');
const integrantesRouter = require('./routes/integrantes');
const contactoRouter = require('./routes/contacto');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const uploadRouter = require('./routes/upload');

// Use routers
app.use('/', indexRouter);
app.use('/productos', productosRouter);
app.use('/proveedores', proveedoresRouter);
app.use('/integrantes', integrantesRouter);
app.use('/contacto', contactoRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/upload', uploadRouter);


// Passport configuration and user setup
const users = [];
const user = {
    id: Date.now().toString(),
    name: "Red Futura",
    email: "a",
    password: ""
};

async function hashPass() {
    const pass = await bcrypt.hash("a", 10);
    user.password = pass;
    users.push(user);
    return pass;
}
hashPass();

const initializePassport = require("./passport-config");
initializePassport(passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

// Server setup
const PORT = process.env.PORT || 3000;
connectToDB(app, PORT);
