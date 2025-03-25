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

// Process login
router.post("/login" ,async function (req, res) {
    var { user_name, user_password } = req.body; 

    try {
        var sql =` SELECT * FROM login WHERE user_name = 'admin123@gmail.com' AND user_password = 'admin'`;
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
    } catch (err) {
        console.error("Error fetching contact data:", err);
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




module.exports = router;