const express = require("express");
const path = require("path");
const mysql = require("mysql");
const cookieParser = require('cookie-parser');
// dotenv provide global variable process.env

const app = express();

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory))

// Parse URL Encoded bodies as sent by HTML forms
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'hbs');


db.connect((err) => {
    if (err) {
        console.log("Error")
    } else {
        console.log("DB Success!");
    }
})

// Define Routes 

app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

app.listen(9000, () => {
    console.log("Server Running...")
})