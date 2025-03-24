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

// Process Login
router.post("/login", async function (req, res) {
    var { user_name, user_password } = req.body;

    try {
        var sql = "SELECT * FROM login WHERE user_name = ? AND user_password = ?";
        var data = await exe(sql, [user_name, user_password]);

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

// Protected Dashboard Route
router.get("/dashboard", checkAdminAuth, function (req, res) {
    res.render("admin/dashboard.ejs");
});

// Fetch About Page Data
router.get("/about", checkAdminAuth, async function (req, res) {
    try {
        var data = await exe("SELECT * FROM about");
        res.render("admin/about.ejs", { "about_info": data });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Add About Page Data
router.post("/about_details", checkAdminAuth, async function (req, res) {
    try {
        let about_img = "";

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
