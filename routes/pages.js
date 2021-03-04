const express = require("express");
const path = require("path");
const mysql = require("mysql");

const router = express.Router();

router.get("/", (req, res) => {
    res.render('index');
})

router.get("/register", (req, res) => {
    res.render('register');
})
router.get("/login", (req, res) => {
    res.render('login');
})

module.exports = router;