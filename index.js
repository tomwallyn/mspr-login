var express = require('express');
var session = require('express-session');
const app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var http = require('http');
var https = require('https');
//var privateKey  = fs.readFileSync('sslcert/certificat.key', 'utf8');
//var certificate = fs.readFileSync('sslcert/certificat.crt', 'utf8');
//var credentials = {key: privateKey, cert: certificate};
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
const cert = require("./cert/route");

app.use("/app", appli);
app.use("/login", login);
app.use(auth);
app.use("/.well-known/pki-validation/6AE823BB57F6704EB497CF2AEA7D6616.txt", cert)

//var httpServer = http.createServer(app);
//var httpsServer = https.createServer(credentials, app);

//httpServer.listen(4001);
//httpsServer.listen(4000);
app.listen(4000)

console.log("Environment : "+global.AUTH.env)