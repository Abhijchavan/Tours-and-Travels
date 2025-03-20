
var express = require("express")
var cors = require("cors")
var session = require('express-session')
var path = require("path")
var exe=("../connection")
var fs  =require("fs")

const router = express.Router();

router.use(cors());
router.use(express.urlencoded({ extended: true }));

router.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
    res.send("Admin Dashboard");
});




module.exports = router;