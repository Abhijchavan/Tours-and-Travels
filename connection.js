// var mysql = require("mysql");
// var util = require("util");

// var conn;

// try {
//     conn = mysql.createConnection({
//         host: "bjggynpor9l8tkxsngoc-mysql.services.clever-cloud.com",
//         user: "usd6jvwiumne7mgr",
//         password: "usd6jvwiumne7mgr",
//         database: "bjggynpor9l8tkxsngoc"
//     });

//     conn.connect((err) => {
//         if (err) {
//             console.error("Database connection failed: ", err);
//             return;
//         }
//         console.log("Connected to database successfully");
//     });
// } catch (error) {
//     console.error("Error while establishing database connection: ", error);
// }
// var exe=util.promisify(conn.query).bind(conn);
// module.exports=exe;
var mysql = require("mysql");
var util = require("util");
var conn = mysql.createConnection({
    host: "bjggynpor9l8tkxsngoc-mysql.services.clever-cloud.com",
    user: "usd6jvwiumne7mgr",
    password: "1uk5LmSfuuXvuEqqx22f",
    database: "bjggynpor9l8tkxsngoc",
    ssl: {
        rejectUnauthorized: false
    }
});
var exe = util.promisify(conn.query).bind(conn);
module.exports = exe;
