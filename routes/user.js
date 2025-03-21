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

    res.render("user/home.ejs")
})


router.get('/about',async (req,res)=>{

    res.render("user/about.ejs")
})
router.get('/services',async (req,res)=>{

    res.render("user/services.ejs")
})
router.get('/packages',async (req,res)=>{

    res.render("user/packages.ejs")
})



router.get('/destination',async (req,res)=>{

    res.render("user/destination.ejs")
})


router.get('/booking',async (req,res)=>{

    res.render("user/booking.ejs")
})


router.get('/team',async (req,res)=>{

    res.render("user/team.ejs")
})


router.get('/testimonial',async (req,res)=>{

    res.render("user/testimonial.ejs")
})


router.get('/not_found',async (req,res)=>{

    res.render("user/not_found.ejs")
})


router.get('/contact',async (req,res)=>{

    res.render("user/contact.ejs")
})
router.get('/signup',async (req,res)=>{

    res.render("user/signup.ejs")
})

router.get('/user/check_available_seat', async (req, res) => {
    res.render("user/check_available_seat.ejs");
});

router.get("/book_bus", async (req, res) => {
    const from = req.query.from || "";
    const to = req.query.to || "";
    res.render("user/book_bus.ejs", { from, to });
});



module.exports = router;