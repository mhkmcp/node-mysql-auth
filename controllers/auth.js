const mysql = require('mysql');

const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
require('dotenv').config()

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

// console.log("DB: ", db);
console.log(process.env.DATABASE);
console.log(process.env.USER);
console.log(process.env.PASSWORD);

exports.register = (req, res) => {
    console.log(req.body);
    // res.send("Form Submitted");
    // const name = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;

    const { name, email, password, confirmPassword } = req.body;

    // var sql = "SELECT email FROM user WHERE email = ?";

    db.query("SELECT email FROM user WHERE email = ?", [email], async (error, results) => {
        if (error) {
            console.log("Register Err", error);
        }
        if (results.length > 0) {
            return res.render('register', {
                message: "The Email is already in use"
            })
        } else if (password !== confirmPassword) {
            return res.render('register', {
                message: "Password Did Not Match!"
            })
        }
        // try {
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query("INSERT INTO user SET ?", { name: name, email: email, password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error)
            } else {
                console.log("Results: ", results);
                return res.render("register", {
                    message: "User Registered Successfully!"
                })
            }
        })

        // } catch (error) {
        //     console.log(error);
        // }
    })
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).render('login', {
                message: "Please provide an email and password"
            })
        }

        db.query("SELECT * FROM user WHERE email = ? ", [email], async (error, results) => {
            if (error) {
                console.log("Error qsl: ", error);
            }
            console.log("Results: ", results);
            // const hashedPass = await bcrypt.hash(password, 8);
            if (!results || !(await bcrypt.compare(password, results[0].password))) {
                console.log("pass: ", password);
                // console.log("hashed: ", hashedPass);
                console.log("results: ", results[0].password);

                res.status(401).render('login', {
                    message: "Email or Password is incorrect"
                })
            } else {
                const id = results[0].id;
                const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                })

                console.log("The token is: ", token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/");

            }
        })
    } catch (error) {
        console.log(error);
    }
}