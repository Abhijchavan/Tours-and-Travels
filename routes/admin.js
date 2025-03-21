
var express = require("express")
var cors = require("cors")
var session = require('express-session')
var path = require("path")
var fs  =require("fs")
var exe = require("../connection")
const router = express.Router();

router.use(cors());
router.use(express.urlencoded({ extended: true }));

router.use(express.urlencoded({ extended: true }));

router.get("/admin", (req, res) => {
    res.render("/admin/index.html")
});




module.exports = router;