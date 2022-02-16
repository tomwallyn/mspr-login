var express = require("express");
var app = express.Router();
const path = require('path');
var mail = require("../authentification/service")

app.get("/", function (req, res) {
    //mail.sendMail("tomwallyntel@gmail.com", "Test send mail", "Coucou toi")
    res.sendFile(path.join(__dirname + '/login.html'));
});

module.exports=app;