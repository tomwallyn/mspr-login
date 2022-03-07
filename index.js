var express = require('express');
var session = require('express-session');
const app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('sslcert/key.pem', 'utf8');
var certificate = fs.readFileSync('sslcert/cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};
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

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(4000);
httpsServer.listen(4001);

console.log("Environment : "+global.AUTH.env)