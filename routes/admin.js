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
router.get("/about",checkAdminAuth,  async function(req, res) {
   
        var data = await exe(`SELECT * FROM about`);
        var obj = { "about": data };
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

router.get("/about_edit/:id", async function (req, res) {
    var id = req.params.id;

    var sql = "SELECT * FROM about WHERE about_id = ?";
    var result = await exe(sql, [id]);

    res.render("admin/about_edit.ejs", { about:result[0] });
});

router.post("/update_about", async function (req, res) {
    const { about_id, about_description} = req.body;

    let about_img = null;

    // Check if a file was uploaded
    if (req.files && req.files.about_img) {
        about_img = new Date().getTime() + "-" + req.files.about_img.name;
        await req.files.about_img.mv("public/admin_assets/about/" + about_img); 
    } else {
        // If no new file is uploaded, keep the old image
        const oldData = await exe("SELECT about_img FROM about WHERE about_id = ?", [about_id]);
        about_img = oldData[0].about_img;
    }

    

    // SQL Update Query
    const sql = `UPDATE about 
                 SET about_description = ? , about_img = ?
                 WHERE about_id = ?`;
    const values = [about_description, about_img, about_id];

    await exe(sql, values);

    res.redirect("/admin/about");
});

router.get("/about_delete/:id",async function (req,res) {
   
    let aboutId = req.params.id;
    let sql = `DELETE FROM about WHERE about_id = ${aboutId}`;
    await exe(sql);
    res.redirect("/admin/about");
});

router.get("/about_guide",checkAdminAuth, async function(req,res){
    var data = await exe(`SELECT * FROM tour_guide`);
    var obj = {"tour_guide":data};
    res.render("admin/about_guide.ejs",obj);
});

router.post("/save_guide", checkAdminAuth, async function(req,res){
    var guide_img = "";

    if(req.files){
        if(req.files.guide_img){
            guide_img = new Date().getTime()+req.files.guide_img.name;
            req.files.guide_img.mv("public/admin_assets/about_guide_img/"+guide_img);
        }
    }

    var sql = `INSERT INTO tour_guide(guide_name, guide_experience, instagram_link, facebook_link, whatsapp_link, guide_img)
     VALUES (?,?,?,?,?,?)`;

    var d = req.body;
    var data = await exe (sql,[d.guide_name,d.guide_experience,d.instagram_link,d.facebook_link,d.whatsapp_link,guide_img]);

    res.redirect("/admin/about_guide");

});

router.get("/delete_about_guide/:id", async function (req, res) {
    var tour_guide_id = req.params.id;


    var sql = `DELETE FROM tour_guide WHERE tour_guide_id = '${tour_guide_id}'`;

    var data =await exe(sql);

    res.redirect("/admin/about_guide");
});

router.get("/edit_about_guide/:id", async function (req, res) {
    var id = req.params.id;

    var sql = "SELECT * FROM tour_guide WHERE tour_guide_id = ?";
    var result = await exe(sql, [id]);

    res.render("admin/edit_about_guide.ejs", { tour_guide:result[0] });
});

router.post("/update_guide", async function (req, res) {
    const { tour_guide_id, guide_name, guide_experience, instagram_link, facebook_link, whatsapp_link } = req.body;

    let guide_img = null;

    // Check if a file was uploaded
    if (req.files && req.files.guide_img) {
        guide_img = new Date().getTime() + "-" + req.files.guide_img.name;
        await req.files.guide_img.mv("public/admin_assets/about_guide_img/" + guide_img); 
    } else {
        // If no new file is uploaded, keep the old image
        const oldData = await exe("SELECT guide_img FROM tour_guide WHERE tour_guide_id = ?", [tour_guide_id]);
        guide_img = oldData[0].guide_img;
    }

    

    // SQL Update Query
    const sql = `UPDATE tour_guide 
                 SET guide_name = ?, guide_experience = ?, instagram_link = ?, facebook_link = ?, whatsapp_link = ? , guide_img = ?
                 WHERE tour_guide_id = ?`;
    const values = [guide_name, guide_experience, instagram_link, facebook_link, whatsapp_link,guide_img, tour_guide_id];

    await exe(sql, values);

    res.redirect("/admin/about_guide");
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
router.get("/contact", checkAdminAuth, async function(req, res) {
   
    var data = await exe(`SELECT * FROM contact_form`);
    var obj = { "contact": data };
    res.render("admin/contact.ejs",obj);

});


    

router.get("/contact_delete/:id",async function(req,res){
    var contactId =req.params.id;
    var sql =`DELETE FROM contact_form where contact_id=${contactId}`;
    await exe(sql);
    res.redirect("/admin/contact");
})


router.get("/client_review", async function(req, res) {
   
    var data = await exe(`SELECT * FROM client_reviews`);
    var obj = { "client_info": data };
    res.render("admin/client_review.ejs",obj);

});

router.post("/client_details",checkAdminAuth, async function(req,res){

if(req.files){
var client_image=new Date().getTime()+req.files.client_image.name;
req.files.client_image.mv("public/admin_assets/client_review/"+client_image);
    }
var d=req.body;
var sql=`INSERT INTO client_reviews(client_image,client_name,client_location,client_description)VALUES('${client_image}','${d.client_name}','${d.client_location}','${d.client_description}')`;
var data=await exe(sql);
res.redirect("/admin/client_review");  
});

router.get("/client_review_delete/:id",async function(req,res){
    var client_reviewId =req.params.id;
    var sql =`DELETE FROM client_reviews where id=${client_reviewId}`;
    await exe(sql);
    res.redirect("/admin/client_review");
});

router.get("/client_review_edit/:id", async function (req, res) {
    var id = req.params.id;

    var sql = `SELECT * FROM client_reviews WHERE id = ?`;
    var result = await exe(sql, [id]);

    res.render("admin/client_review_edit.ejs", { client_info:result[0] });
});

router.post("/client_update", async function (req, res) {
    const { id,client_name,client_location,client_description } = req.body;

    let client_image = null;
   

    // Check if a file was uploaded
    if (req.files && req.files.client_image) {
        client_image = new Date().getTime() + "-" + req.files.client_image.name;
        await req.files.client_image.mv("public/admin_assets/client_review/" + client_image); 
    } else {
        // If no new file is uploaded, keep the old image
        const oldData = await exe("SELECT client_image FROM client_reviews WHERE id = ?", [id]);
        client_image = oldData[0].client_image;
    }

      const sql = `UPDATE client_reviews 
                 SET client_name = ?, client_location = ?, client_description = ?, client_image = ? 
                 WHERE id = ?`;
    const values = [client_name, client_location, client_description, client_image,id];

    await exe(sql, values);

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


router.get("/dashboard",checkAdminAuth, async function(req,res){

    var accepted = `SELECT COUNT(*) as accepted_count FROM tour_travels WHERE booking_status = 'Accepted'`;
    var rejected = `SELECT COUNT(*) as rejected_count FROM tour_travels WHERE booking_status = 'Rejected'`;
    var pending = `SELECT COUNT(*) as pending_count FROM tour_travels WHERE booking_status = 'pending'`;
    var total = `SELECT COUNT(*) as total_count FROM tour_travels`;

    var data = await exe(accepted);
    var accepted_count = data[0].accepted_count;
    data = await exe(rejected);
    var rejected_count = data[0].rejected_count;
    data = await exe(pending);
    var pending_count = data[0].pending_count;
    data = await exe(total);
    var total_count = data[0].total_count;

    var obj = {
        "accepted_count": accepted_count,
        "rejected_count": rejected_count,
        "pending_count": pending_count,
        "total_count": total_count
    }
    res.render("admin/dashboard.ejs", obj);
});




router.get("/package_details",async function(req,res){
    var data = await exe(`SELECT * FROM package_details`);
    var obj = {"package_details":data};
    res.render("admin/package_details.ejs",obj);
});

router.post("/save_package_details",async function(req,res){
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

    var sql = `INSERT INTO package_details(package_location,package_days,package_person,package_price,package_desc,slider_image1,slider_image2,slider_image3) VALUES (?,?,?,?,?,?,?,?)`;

    var d = req.body;
    var data = await exe (sql,[d.package_location,d.package_days,d.package_person,d.package_price,d.package_desc,slider_image1,slider_image2,slider_image3]);

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

    var sql = `SELECT * FROM package_details WHERE package_details_id = ?`;
    var result = await exe(sql, [id]);

    res.render("admin/edit_package_details.ejs", { package_details:result[0] });
});

router.post("/update_package_details", async function (req, res) {
    const { package_details_id, package_location, package_days, package_person, package_price, package_desc } = req.body;

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

router.get("/booking_list",async function(req,res){
    var data = await exe(`SELECT * FROM tour_travels WHERE booking_status = 'pending'`);
    var obj = {"booking":data};
    res.render("admin/booking_list.ejs",obj);
});
router.get("/accepted",async (req,res)=>{
    var data = await exe(`SELECT * FROM tour_travels WHERE booking_status = 'Accepted'`);
    var obj = {"booking":data};
    res.render("admin/accepted.ejs",obj);
})
router.get("/rejected",async (req,res)=>{   
    var data = await exe(`SELECT * FROM tour_travels WHERE booking_status = 'Rejected'`);
    var obj = {"booking":data};
    res.render("admin/rejected.ejs",obj);
});

router.get("/booking_accepted/:id",async function(req,res){
    var id = req.params.id;
    var sql = `UPDATE tour_travels SET booking_status = 'Accepted' WHERE id = ?`;
    await exe(sql, [id]);
    res.redirect("/admin/booking_list");
});
router.get("/booking_rejected/:id",async function(req,res){
    var id = req.params.id;
    var sql = `UPDATE tour_travels SET booking_status = 'Rejected' WHERE id = ?`;
    await exe(sql, [id]);
    res.redirect("/admin/booking_list");
});


router.get("/accepted_delete/:id",async function(req,res){
    var acceptedId =req.params.id;
    var sql =`DELETE FROM tour_travels where id=${acceptedId}`;
    await exe(sql);
    res.redirect("/admin/accepted");
})

router.get("/rejected_deleted/:id",async function(req,res){    
    var rejectedId =req.params.id;
    var sql =`DELETE FROM tour_travels where id=${rejectedId}`;
    await exe(sql);
    res.redirect("/admin/rejected");
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
                 SET package_location = ?, package_days = ?, package_person = ?, package_price = ?, package_desc = ? , slider_image1 = ?, slider_image2 = ?, slider_image3 = ? 
                 WHERE package_details_id = ?`;
    const values = [package_location, package_days, package_person, package_price, package_desc,slider_image1, slider_image2, slider_image3, package_details_id];

    await exe(sql, values);

    res.redirect("/admin/package_details");
});




router.get("/faq", async function(req, res) {
   
    var data = await exe(`SELECT * FROM faq`);
    var obj = { "faq_info": data };
    res.render("admin/faq.ejs",obj);

});

router.post("/faq_details",async function(req,res){

    var d=req.body;
    var sql=`INSERT INTO faq(faq_question,faq_answer)VALUES('${d.faq_question}','${d.faq_answer}')`;
    var data=await exe(sql);
    res.redirect("/admin/faq");  
    });
    
    router.get("/faq_delete/:id",async function(req,res){
        var faqId =req.params.id;
        var sql =`DELETE FROM faq where faq_id=${faqId}`;
        await exe(sql);
        res.redirect("/admin/faq");
    })

router.post("/contact_list", async function(req, res) {
   
    
    res.render("admin/faq.ejs",obj);

});



router.get("/faq", async function(req, res) {
   
    var data = await exe(`SELECT * FROM faq`);
    var obj = { "faq_info": data };
    res.render("admin/faq.ejs",obj);

});

router.post("/gallary_details",async function(req,res){

    if(req.files){
var gallary_image=new Date().getTime()+req.files.gallary_image.name;
req.files.gallary_image.mv("public/admin_assets/gallary/"+gallary_image);
    }
var d=req.body;
var sql=`INSERT INTO gallary (gallary_image)VALUES('${gallary_image}')`;
var data=await exe(sql);
res.redirect("/admin/gallary");  
});

router.get("/gallary_delete/:id", async function (req, res) {
    var gallaryid = req.params.id;

    var sql = `DELETE FROM gallary WHERE gallary_id = '${gallaryid}'`;
    var data =await exe(sql);

    res.redirect("/admin/gallary");
});


router.get("/Add_Bus",async (req,res)=>{

    res.render("admin/add_bus.ejs")
})
module.exports = router;