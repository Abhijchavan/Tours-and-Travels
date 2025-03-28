// var express = require("express")
// var upload = require("express-fileupload")
// var bodyparser = require("body-parser")
var path = require('path')

// let session  = require("express-session")
// let fs = require('fs')

// let app  = express();
// const cors = require('cors')
// app.use(cors())

// app.use(express.static(path.join(__dirname,'public')));

// app.use(express.json())
// app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
// app.use('/aos', express.static(path.join(__dirname, 'node_modules/aos/dist')));

// app.use(session({
//     secret:"sahil",
//     resave:false,
//     saveUninitialized:true
// }));

// app.use(upload())

// app.use(bodyparser.urlencoded({extended:true}));


// let admin = require('./routes/admin')
// let user = require('./routes/user')

// app.use('/admin',admin)
// app.use('/',user)

// app.listen(3000,()=>{
//     console.log('server is running on Port 3000')
// })

var express = require("express");
var bodyparser = require("body-parser");
var upload = require("express-fileupload");
var session = require("express-session");
var admin_routes = require("./routes/admin");
var user_routes = require("./routes/user");
var app = express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(upload());
 app.use(session({
         secret:"sahil",
         resave:false,
         saveUninitialized:true
     }));

app.use(express.static("public/"));
app.use("/admin",admin_routes);
app.use("/",user_routes);
 
 
app.listen(3000,function(){
    console.log("Server is running at 3000");
})