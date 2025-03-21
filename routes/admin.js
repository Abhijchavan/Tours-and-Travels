
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

router.get("/",function(req,res){
    res.render("admin/login.ejs");
});
function checkAdminAuth(req, res, next) {
    if (req.session.user_id) {
        next();
    } else {
        res.status(404).send("Page not found");
    }
}


// Process login
router.post("/login", checkAdminAuth ,async function (req, res) {
    var { user_name, user_password } = req.body; 

    try {
        var sql = `SELECT * FROM login WHERE user_name = 'admin123@gmail.com' AND user_password = 'admin';`;
        var data = await exe(sql, [user_name, user_password]);  

        if (data.length > 0) {
            var user_id = data[0].login_id;  
            req.session.user_id = user_id;

            res.redirect("/admin/dashboard");
            
        } 
        else {
            res.send("Login Failed! Invalid username or password.");
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/about", async function(req, res) {
   
        var data = await exe(`SELECT * FROM about`);
        var obj = { "about_info": data };
        res.render("admin/about.ejs",obj);
   
});
router.post("/about_details",async function(req,res){

    if(req.files){
var about_img=new Date().getTime()+req.files.about_img.name;
req.files.about_img.mv("public/admin_assets/about/"+about_img);
    }
var d=req.body;
var sql=`INSERT INTO about(about_description,about_img)VALUES('${d.about_description}','${about_img}')`;
var data=await exe(sql);
res.redirect("/admin/about");  
});
router.get("/about_delete/:id",async function (req,res) {
   
    let aboutId = req.params.id;
    let sql = `DELETE FROM about WHERE about_id = ${aboutId}`;
    await exe(sql);
    res.redirect("/admin/about");
})


router.get("/dashboard",function(req,res){
    res.render("admin/dashboard.ejs");
});




module.exports = router;


