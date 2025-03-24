const express = require("express");
const upload = require("express-fileupload");
const bodyparser = require("body-parser");
const path = require('path');
const session = require("express-session");
const fs = require('fs');
const cors = require('cors');

let app = express();
app.use(cors());

// Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/aos', express.static(path.join(__dirname, 'node_modules/aos/dist')));

// Middleware
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(upload());

// Session Middleware (Ensure it's applied globally)
app.use(session({
    secret: "sahil",
    resave: false,
    saveUninitialized: true
}));

// Routes
let admin = require('./routes/admin');
let user = require('./routes/user');

app.use('/admin', admin);
app.use('/', user);

app.listen(3000, () => {
    console.log('Server is running on Port 3000');
});
