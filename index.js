var express = require('express');
var session = require('express-session');
const app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
require('./helpers/config');

app.use(cookieParser());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

const appli = require("./app/route");
const login = require("./login/route");
const auth = require("./authentification/route");

app.use("/app", appli);
app.use("/login", login);
app.use(auth);

app.listen(4000);
console.log("Environment : "+global.AUTH.env)