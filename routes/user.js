var express = require("express")
var cors = require("cors")
var session = require('express-session')
var path = require("path")
var fs  =require("fs")
var exe = require("../connection")
const { route } = require("./admin")
const router = express.Router();

router.use(cors());
router.use(express.urlencoded({ extended: true }));

router.use(express.urlencoded({ extended: true }));


router.get("/",async (req,res)=>{
    var service = await exe(`SELECT * FROM service_card`);
    var client_reviews = await exe(`SELECT * FROM client_reviews`);
  var data = await exe(`SELECT * FROM package_details`)
var faq = await exe(`SELECT * FROM faq`)
  var client_review= await exe(`SELECT * FROM client_reviews`)
    var obj = {"service_card_info":service,"client_info":client_reviews , "package_details":data, "faq_info":faq, "client_review":client_review};
    res.render("user/home.ejs",obj);

})

router.get("/about",async function(req,res){
    var about = await exe(`SELECT * FROM about`);
    var tour_guide = await exe(`SELECT * FROM tour_guide`);
    res.render("user/about.ejs",{"about":about,"tour_guide":tour_guide});

});

router.get('/services', async (req, res) => {
    try {
        var service = await exe(`SELECT * FROM service_card`);
        var client_reviews = await exe(`SELECT * FROM client_reviews`);

        res.render("user/services.ejs", {
            service_card_info: service,
            client_info: client_reviews
        });
    } catch (error) {
        console.error("Error fetching services data:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/packages', async (req, res) => {

    var data = await exe(`SELECT * FROM package_details`);
    var obj = { "package_details": data };
    res.render("user/packages.ejs", obj);
});

router.get('/booking',async (req,res)=>{

    res.render("user/booking.ejs")
})

router.get('/gallary',async (req,res)=>{
var gallary = await exe(`SELECT * FROM gallary`);
var obj = {"gallary_info":gallary};
    res.render("user/gallary.ejs",obj)
})


router.get('/testimonial',async (req,res)=>{

    res.render("user/testimonial.ejs")
})





router.get('/contact',async (req,res)=>{
    var data = await exe(`SELECT * FROM contact_form`);
    var obj = {"contact":data};
   
    res.render("user/contact.ejs", obj)
});

router.post('/save_contact',async (req,res)=>{
   
    var d=req.body;
    
    const sql = `INSERT INTO contact_form (name, email, subject, message) VALUES
     ('${d.name}','${d.email}','${d.subject}','${d.message}')`;
   
    var data=await exe(sql);  
    res.render("user/contact.ejs",)
});

router.get('/signup',async (req,res)=>{

    res.render("user/signup.ejs")
})

router.get('/user/check_available_seat', async (req, res) => {
    res.render("user/check_available_seat.ejs");
});
router.get('/user/select_destination', async (req, res) => {
    res.render("user/select_destination.ejs");
});

router.get('/user/conformation', async (req, res) => {
    res.render("user/conformation.ejs");
});


router.get("/book_bus", async (req, res) => {
    const from = req.query.from || "";
    const to = req.query.to || "";
    res.render("user/book_bus.ejs", { from, to });
});

router.get('/user/check_available_seat', async (req, res) => {
    const from = req.query.from || "";
    const to = req.query.to || "";
    const date = req.query.date || "";
  
    res.render("user/check_available_seat.ejs",{from,to,date});
});

module.exports = router;