
// var express = require("express")
// var cors = require("cors")
// var session = require('express-session')
// var path = require("path")
// var fs  =require("fs")
// var exe = require("../connection")
// const router = express.Router();
var express = require("express");
var exe = require("../connection");
var router = express.Router();


// router.use(cors());
// router.use(express.urlencoded({ extended: true }));

<<<<<<< Updated upstream
router.get("/",function(req,res){
    res.render("admin/login.ejs");
});


router.get("/dashboard",function(req,res){
    res.render("admin/dashboard.ejs");
});
=======
router.get("/admin",async (req,res)=>{
>>>>>>> Stashed changes

    res.render("admin/dashboard.ejs")
})



module.exports = router;


