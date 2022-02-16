var express = require("express");
var app = express.Router();
const service = require("./service")

app.get("/", function (req, res) {
  if (req.session.loggedin) {
		// Output username
		res.send('Welcome back, ' + req.session.username + '!');
	} else {
		// Not logged in
		res.send('Please login to view this page!');
	}
});

module.exports=app;