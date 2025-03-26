<<<<<<< HEAD
const express = require("express");
const router = express.Router();
const cors = require("cors");
const session = require("express-session");
const path = require("path");
const fs = require("fs");
const exe = require("../connection");
const fileUpload = require("express-fileupload");

// Middleware Setup
router.use(cors());
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(fileUpload());
=======
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
>>>>>>> 38ea21bddd5cc6a5bdfeae59af09aaf0eb3275ca

// Add Session Middleware in Admin Routes
router.use(session({
    secret: "sahil",
    resave: false,
    saveUninitialized: true
}));

// Middleware for Admin Authentication
function checkAdminAuth(req, res, next) {
    if (req.session.user_id) {
        next();
    } else {
        res.status(404).send("Page not found");
    }
}

// Render Login Page
router.get("/", function (req, res) {
    res.render("admin/login.ejs");
});

<<<<<<< HEAD
// Process Login
router.post("/login", async function (req, res) {
    var { user_name, user_password } = req.body;

    try {
        var sql = "SELECT * FROM login WHERE user_name = ? AND user_password = ?";
        var data = await exe(sql, [user_name, user_password]);
=======
// Process login

// Process login
router.post("/login" ,async function (req, res) {
    var { user_name, user_password } = req.body; 

    try {
        var sql =` SELECT * FROM login WHERE user_name = 'admin123@gmail.com' AND user_password = 'admin'`;
        var data = await exe(sql, [user_name, user_password]);  
>>>>>>> 38ea21bddd5cc6a5bdfeae59af09aaf0eb3275ca

        if (data.length > 0) {
            req.session.user_id = data[0].login_id;
            res.redirect("/admin/dashboard");
        } else {
            res.send("Login Failed! Invalid username or password.");
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Internal Server Error");
    }
});

<<<<<<< HEAD
// Protected Dashboard Route
router.get("/dashboard", checkAdminAuth, function (req, res) {
    res.render("admin/dashboard.ejs");
});

// Fetch About Page Data
router.get("/about", checkAdminAuth, async function (req, res) {
    try {
        var data = await exe("SELECT * FROM about");
        res.render("admin/about.ejs", { "about_info": data });
=======
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
});

router.get("/meet_guides",async function(row,i){
res.render("/admin/meet_guides.ejs")
});

// router.post("/guide_details", async function(req,res){
    

//     if(req.files){
//         var guide_image=new Date().getTime()+req.files.guide_image.name;
//         req.files.guide_image.mv("public/admin_assets/about/"+guide_image);
//             }
//         var d=req.body;
//         var sql=INSERT INTO guide(guide_name,designation,guide_image,facebook,twitter,insta)VALUES('${d.guide_name}','${d.designation}','${guide_image}','${d.facebook}','${d.twitter}','${d.insta}');
//         var data=await exe(sql);
//         res.redirect("/admin/meet_guides"); 
//     });

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
>>>>>>> 38ea21bddd5cc6a5bdfeae59af09aaf0eb3275ca
    } catch (err) {
        console.error("Error fetching contact data:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Add About Page Data
router.post("/about_details", checkAdminAuth, async function (req, res) {
    try {
        let about_img = "";

<<<<<<< HEAD
        if (req.files && req.files.about_img) {
            about_img = new Date().getTime() + path.extname(req.files.about_img.name);
            req.files.about_img.mv("public/admin_assets/about/" + about_img);
        }

        var { about_description } = req.body;
        var sql = "INSERT INTO about (about_description, about_img) VALUES (?, ?)";
        await exe(sql, [about_description, about_img]);

        res.redirect("/admin/about");
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Delete About Page Data
router.get("/about_delete/:id", checkAdminAuth, async function (req, res) {
    try {
        let aboutId = req.params.id;
        let sql = "DELETE FROM about WHERE about_id = ?";
        await exe(sql, [aboutId]);

        res.redirect("/admin/about");
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
=======
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


router.get("/client_review", async function(req, res) {
   
    var data = await exe(`SELECT * FROM client_reviews`);
    var obj = { "client_info": data };
    res.render("admin/client_review.ejs",obj);

});

router.post("/client_details",async function(req,res){

    if(req.files){
var client_image=new Date().getTime()+req.files.client_image.name;
req.files.client_image.mv("public/admin_assets/services/"+client_image);
    }
var d=req.body;
var sql=`INSERT INTO client_reviews(client_image,client_name,client_location,client_description)VALUES('${client_image}','${d.client_name}','${d.client_location}','${d.client_description}')`;
var data=await exe(sql);
res.redirect("/admin/client_review");  
});


router.get("/service_card", async function(req, res) {
   
    var data = await exe(`SELECT * FROM service_card`);
    var obj = { "service_card_info": data };
    res.render("admin/service_card.ejs",obj);

});

router.post("/service_card_details",async function(req,res){

var d=req.body;
var sql=`INSERT INTO service_card(service_card_title, service_card_description)
VALUES('${d.service_card_title}','${d.service_card_description}')`;
var data=await exe(sql);
res.redirect("/admin/service_card");  
});

router.get("/service_card_delete/:id",async function(req,res){
    var servicecardId =req.params.id;
    var sql =`DELETE FROM service_card where service_card_id=${servicecardId}`;
    await exe(sql);
    res.redirect("/admin/service_card");
})


router.get("/service_edit/:id", async function(req, res) {
    try {
        let servicecardId = req.params.id;
        let data = await exe(`SELECT * FROM service_card WHERE  service_card_id= ${servicecardId}`);
        
        if (data.length === 0) {
            return res.status(404).send("service_card Not Found");
        }

        res.render("admin/service_edit.ejs", { service_card_info: data[0] });
    } catch (err) {
        console.error("Error fetching service data:", err);
        res.status(500).send("Internal Server Error");
    }
});


router.post("/service_update/:id", async function (req, res) {
    try {
        let serviceCardId = req.params.id;
        let { service_card_title, service_card_description } = req.body;

        let sql = `
            UPDATE service_card 
            SET service_card_title = ?, 
                service_card_description = ?
            WHERE service_card_id = ?
        `;

        let queryParams = [service_card_title, service_card_description, serviceCardId];

        await exe(sql, queryParams);  // Secure parameterized query execution
        res.redirect("/admin/service_card");
    } catch (err) {
        console.error("Error updating service card:", err);
        res.status(500).send("Internal Server Error");
    }
});


router.get("/dashboard",function(req,res){
    res.render("admin/dashboard.ejs");
});


router.get("/package_slider",async function(req,res){
    var data = await exe(`SELECT * FROM package_slider`);
    var obj = {"package_slider":data};
    res.render("admin/package_slider.ejs",obj);
});

router.post("/save_package_slider",async function(req,res){
    var slider_image1 = "";
    var slider_image2 = "";
    var slider_image3 = "";

    if(req.files){
        if(req.files.slider_image1){
            slider_image1 = new Date().getTime()+req.files.slider_image1.name;
            req.files.slider_image1.mv("public/admin_assets/package_img/"+slider_image1);
        }
        if(req.files.slider_image2){
            slider_image2 = new Date().getTime()+req.files.slider_image2.name;
            req.files.slider_image2.mv("public/admin_assets/package_img/"+slider_image2);
        }
        if(req.files.slider_image3){
            slider_image3 = new Date().getTime()+req.files.slider_image3.name;
            req.files.slider_image3.mv("public/admin_assets/package_img/"+slider_image3);
        }
    }

    var sql = `INSERT INTO package_slider (slider_image1,slider_image2,slider_image3) VALUES (?,?,?)`;

    var data = await exe (sql,[slider_image1,slider_image2,slider_image3]);

    res.redirect("/admin/package_slider");
});

router.get("/delete_package_slider/:id", async function (req, res) {
    var package_slider_id = req.params.id;

    var sql = `DELETE FROM package_slider WHERE package_slider_id = '${package_slider_id}'`;
    var data =await exe(sql);

    res.redirect("/admin/package_slider");
});

router.get("/edit_package_slider/:id", async function (req, res) {
    var id = req.params.id;

    var sql = "SELECT * FROM package_slider WHERE package_slider_id = ?";
    var result = await exe(sql, [id]);

    res.render("admin/edit_package_slider.ejs", { package_slider:result[0] });
});


router.post("/update_package_slider", async function (req, res) {
    const { package_slider_id } = req.body;

    let slider_image1 = null;
    let slider_image2 = null;
    let slider_image3 = null;

    // Check if a file was uploaded
    if (req.files && req.files.slider_image1) {
        slider_image1 = new Date().getTime() + "-" + req.files.slider_image1.name;
        await req.files.slider_image1.mv("public/admin_assets/package_img/" + slider_image1); 
    } else {
        // If no new file is uploaded, keep the old image
        const oldData = await exe("SELECT slider_image1 FROM package_slider WHERE package_slider_id = ?", [package_slider_id]);
        slider_image1 = oldData[0].slider_image1;
    }

     // Check if a file was uploaded
     if (req.files && req.files.slider_image2) {
        slider_image2 = new Date().getTime() + "-" + req.files.slider_image2.name;
        await req.files.slider_image2.mv("public/admin_assets/package_img/" + slider_image2); 
    } else {
        // If no new file is uploaded, keep the old image
        const oldData = await exe("SELECT slider_image2 FROM package_slider WHERE package_slider_id = ?", [package_slider_id]);
        slider_image2 = oldData[0].slider_image2;
    }

    // Check if a file was uploaded
    if (req.files && req.files.slider_image3) {
        slider_image3 = new Date().getTime() + "-" + req.files.slider_image3.name;
        await req.files.slider_image3.mv("public/admin_assets/package_img/" + slider_image3); 
    } else {
        // If no new file is uploaded, keep the old image
        const oldData = await exe("SELECT slider_image3 FROM package_slider WHERE package_slider_id = ?", [package_slider_id]);
        slider_image3 = oldData[0].slider_image3;
    }

    const sql = `UPDATE package_slider 
                 SET slider_image1 = ?, slider_image2 = ?, slider_image3 = ?  WHERE package_slider_id = ?`;
    const values = [ slider_image1, slider_image2, slider_image3, package_slider_id];

    await exe(sql, values);

    res.redirect("/admin/package_slider");
});



router.get("/package_details",async function(req,res){
    var data = await exe(`SELECT * FROM package_details`);
    var obj = {"package_details":data};
    res.render("admin/package_details.ejs",obj);
});

router.post("/save_package_details",async function(req,res){

    var sql = `INSERT INTO package_details(package_location,package_days,package_person,package_price,package_desc) VALUES (?,?,?,?,?)`;

    var d = req.body;
    var data = await exe (sql,[d.package_location,d.package_days,d.package_person,d.package_price,d.package_desc]);

    res.redirect("/admin/package_details");

});

router.get("/delete_package_details/:id", async function (req, res) {
    var package_details_id = req.params.id;

    var sql = `DELETE FROM package_details WHERE package_details_id = '${package_details_id}'`;
    var data =await exe(sql);

    res.redirect("/admin/package_details");
});


router.get("/edit_package_details/:id", async function (req, res) {
    var id = req.params.id;

    var sql = "SELECT * FROM package_details WHERE package_details_id = ?";
    var result = await exe(sql, [id]);

    res.render("admin/edit_package_details.ejs", { package_details:result[0] });
});

router.post("/update_package_details", async function (req, res) {
    const { package_details_id, package_location, package_days, package_person, package_price, package_desc } = req.body;

    // SQL Update Query
    const sql = `UPDATE package_details 
                 SET package_location = ?, package_days = ?, package_person = ?, package_price = ?, package_desc = ?  
                 WHERE package_details_id = ?`;
    const values = [package_location, package_days, package_person, package_price, package_desc, package_details_id];

    await exe(sql, values);

    res.redirect("/admin/package_details");
});

module.exports = router;
>>>>>>> 38ea21bddd5cc6a5bdfeae59af09aaf0eb3275ca
