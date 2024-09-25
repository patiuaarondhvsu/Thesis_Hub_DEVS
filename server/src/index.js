const express = require("express");
const cors = require('cors');
const session = require('express-session');
const expbs = require('express-handlebars');
const path = require("path");
const thesisCollection = require("./thesisdb");
const RCDCollection = require("./rcd");

// routers
const profileRoute = require('../routes/profile');
const uploadRoute = require('../routes/upload');
const userRoute = require('../routes/user');
const userviewRoute = require('../routes/userview');
const thesisRoute = require('../routes/theses');
const deleteRoute = require('../routes/delete');
const editRoute = require('../routes/edit');
const logsRoute = require('../routes/logs');
const recoverRoute = require('../routes/recover');

const app = express();

// Environment variables
require("dotenv").config();

// Template engine setup (Handlebars)
app.set("views", path.join(__dirname, '../templates'));
app.set('view engine', 'hbs');
app.engine('handlebars', expbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'templates/layouts')
}));

// for session storing
const MongoStore = require('connect-mongo');

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 * (60 * 24), secure: false },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL,
        collectionName: 'sessions'})
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Static files
app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));
// to read pdf files
app.use('/files', express.static(path.join(__dirname, 'files')));

// Routes
app.use(profileRoute);
app.use(uploadRoute);
app.use(userRoute);
app.use(userviewRoute);
app.use(thesisRoute);
app.use(deleteRoute);
app.use(editRoute);
app.use(logsRoute);
app.use(recoverRoute);

// Page routes
app.get('/index', (req, res) => {
    res.render('index', { title: 'Index' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

app.get("/", (req, res) => {
    res.render("landingPage");
});


app.get('/search/:key', async (req, res) => {
    console.log(req.params.key);
    try {
        const data = await thesisCollection.find({
            "$or": [
                { filename: { $regex: req.params.key, $options: 'i' } },
                { brand: { $regex: req.params.key, $options: 'i' } },
                { category: { $regex: req.params.key, $options: 'i' } },
            ]
        });
        res.send(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

module.exports = app;
