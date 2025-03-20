var express = require("express")
var upload = require("express-fileupload")
var bodyparser = require("body-parser")
var path = require('path')

let session  = require("express-session")
let fs = require('fs')

let app  = express();
const cors = require('cors')
app.use(cors())

app.use(express.static(path.join(__dirname,'public')));

app.use(express.json())
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/aos', express.static(path.join(__dirname, 'node_modules/aos/dist')));

app.use(session({
    secret:"A2Z IT Hub",
    resave:false,
    saveUninitialized:true
}));

app.use(upload())

app.use(bodyparser.urlencoded({extended:true}));


let admin = require('./routes/admin')
let user = require('./routes/user')

app.use('/admin',admin)
app.use('/',user)

app.listen(1000,()=>{
    console.log('server is running on Port 1000')
})
