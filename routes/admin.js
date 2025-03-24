
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

//contact page
router.get("/contact", async function(req, res) {
   
    var data = await exe(`SELECT * FROM contact`);
    var obj = { "contact_info": data };
    res.render("admin/contact.ejs",obj);

});

router.post("/contact_details",async function(req,res){

    if(req.files){
var contact_image=new Date().getTime()+req.files.contact_image.name;
req.files.contact_image.mv("public/admin_assets/contact/"+contact_image);
    }
var d=req.body;
var sql=`INSERT INTO contact(contact_image,contact_description,office_address,mobile_number,email_address)VALUES('${contact_image}','${d.contact_description}','${d.office_address}','${d.mobile_number}','${d.email_address}')`;
var data=await exe(sql);
res.redirect("/admin/contact");  
});

router.get("/contact_delete/:id",async function(req,res){
    var contactId =req.params.id;
    var sql =`DELETE FROM contact where id=${contactId}`;
    await exe(sql);
    res.redirect("/admin/contact");
})


router.get("/contact_edit/:id", async function(req, res) {
    try {
        let contactId = req.params.id;
        let data = await exe(`SELECT * FROM contact WHERE  id= ${contactId}`);
        
        if (data.length === 0) {
            return res.status(404).send("Contact Not Found");
        }

        res.render("admin/contact_edit.ejs", { contact_info: data[0] });
    } catch (err) {
        console.error("Error fetching contact data:", err);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/home_update/:id", async function(req, res) {
    try {
        let Id = req.params.id;
        let { home_page_slider, home_page_title, doctor_name, home_image, doctor_description, contact, card_no } = req.body;

        // Base query
        let updateQuery = `UPDATE home_web SET 
                               home_page_slider = ?, 
                               home_page_title = ?, 
                               doctor_name = ?, 
                               doctor_description = ?, 
                               contact = ?, 
                               card_no = ?`;
        
        let queryParams = [home_page_slider, home_page_title, doctor_name, doctor_description, contact, card_no];

        // Handle file upload
        if (req.files && req.files.home_page_slider) {
            let home_page_slider = new Date().getTime() + "_" + req.files.home_page_slider.name;
            await req.files.home_page_slider.mv("public/admin_assets/home/" + home_page_slider);
            
            updateQuery += ", home_page_slider = ?";
            queryParams.push(home_page_slider);
        }

        // Add WHERE clause
        updateQuery += " WHERE id = ?";
        queryParams.push(Id);

        // Execute query
        await exe(updateQuery, queryParams);

        res.redirect("/admin/home");
    } catch (err) {
        console.error("Error updating home data:", err);
        res.status(500).send("Internal Server Error");
    }
});
router.post("/contact_update/:id", async function (req, res) {
   

    try {
        let contactId = req.params.id;
        let { contact_image, contact_description, office_address, mobile_number, email_address } = req.body;
        let updateQuery = `
            UPDATE contact SET 
                contact_image = ?, 
                contact_description = ?, 
                office_address = ?, 
                mobile_number = ?, 
                email_address = ? 
        `;

    
    let queryParams = [contact_image, contact_description, office_address, mobile_number, email_address];

        if (req.files && req.files.contact_image) {
            let contact_image = new Date().getTime() + "_" + req.files.contact_image.name;
            await req.files.contact_image.mv("public/admin_assets/contact/" + contact_image);
            updateQuery += ", contact_image = ?";
            queryParams.push(contact_image);
        }

     
        updateQuery += " WHERE id = ?";
        queryParams.push(contactId);

        await exe(updateQuery, queryParams);
        res.redirect("/admin/contact");
    } catch (err) {
        console.error("Error updating contact:", err);
        res.status(500).send("Internal Server Error");
    }
});


router.get("/client_details", async function(req, res) {
   
    var data = await exe(`SELECT * FROM client_review`);
    var obj = { "client_info": data };
    res.render("admin/client_review.ejs",obj);

});


router.get("/dashboard",function(req,res){
    res.render("admin/dashboard.ejs");
});




module.exports = router;


