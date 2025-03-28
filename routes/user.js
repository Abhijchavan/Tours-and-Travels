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
    var about = await exe(`SELECT * FROM about`);
    res.render("user/home.ejs",{about:about});

})


router.get("/about",async function(req,res){
    var about = await exe(`SELECT * FROM about`);
    res.render("user/about.ejs",{about:about});

});

router.get('/services',async (req,res)=>{
    res.render("user/services.ejs")
})
// router.get('/packages',async (req,res)=>{
//     var data = await exe(`SELECT * FROM package_slider`);
//     var data1 = await exe(`SELECT * FROM package_details`);
//     var obj = {"package_slider":data, "package_details":data1};
//     res.render("user/packages.ejs",obj);
// })
// router.get('/packages', async (req, res) => {
//     var data = await exe(`SELECT * FROM package_slider`);
//     var data1 = await exe(`SELECT * FROM package_details`);

//     // Remove duplicate package_id from package_slider (for divs)
//     let uniquePackages = [];
//     let seenPackageIds = new Set();

//     data.forEach(slider => {
//         if (!seenPackageIds.has(slider.package_id)) {
//             seenPackageIds.add(slider.package_id);
//             uniquePackages.push(slider);
//         }
//     });

//     var obj = { 
//         "package_slider": uniquePackages, // For div (No duplicates)
//         "package_details": data1, // For table (All records)
//         "all_packages": data  // Keeping all package records for the table
//     };

//     res.render("user/packages.ejs", obj);
// });

router.get('/packages', async (req, res) => {
    var data = await exe(`SELECT * FROM package_slider`);
    var data1 = await exe(`SELECT * FROM package_details`);


    var obj = { "package_slider": data, "package_details": data1 };
    res.render("user/packages.ejs", obj);
});



router.get('/destination',async (req,res)=>{

    res.render("user/destination.ejs")
})


router.get('/booking',async (req,res)=>{
    

    res.render("user/booking.ejs")
})


router.get('/gallary',async (req,res)=>{

    res.render("user/gallary.ejs")
})


router.get('/testimonial',async (req,res)=>{

    res.render("user/testimonial.ejs")
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

router.post("/book_tour", async (req, res) => {
    const { name, user_name,date_time, destination, special_request } = req.body;
   
        await exe(`INSERT INTO tour_travels(name, user_name,date_time, destination, special_request) VALUES ('${name}', '${user_name}', '${date_time}', '${destination}', '${special_request}')`);
        // res.redirect("user/about");
        res.redirect("/home");

    
});
// router.get("/user/booking", async (req, res) => {
//     const booking = await exe(`SELECT * FROM booking`);
//     res.render("user/booking.ejs", { booking });
// });




module.exports = router;