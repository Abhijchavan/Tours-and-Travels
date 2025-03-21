var mysql = require("mysql");
var util = require("util");

var conn;

try {
    conn = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "tours_and_travels"
    });

    conn.connect((err) => {
        if (err) {
            console.error("Database connection failed: ", err);
            return;
        }
        console.log("Connected to database successfully");
    });
} catch (error) {
    console.error("Error while establishing database connection: ", error);
}

var exe = util.promisify(conn.query).bind(conn);
module.exports = exe;