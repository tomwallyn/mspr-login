var express = require("express");
var app = express.Router();
const path = require('path');

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + '/6AE823BB57F6704EB497CF2AEA7D6616.txt'));
});

module.exports=app;