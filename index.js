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

var ActiveDirectory = require('activedirectory');
var config = { url: 'ldap://AD.mspr.local',//172.16.147.128
               baseDN: 'dc=mspr,dc=local',
               username: 'MSPR\\MSPR',
               password: 'Azerty123' }
var ad = new ActiveDirectory(config);

var username = 'john.smith@domain.com';
var password = 'password';
 
ad.authenticate(username, password, function(err, auth) {
  if (err) {
    console.log('ERROR: '+JSON.stringify(err));
    return;
  }
  
  if (auth) {
    console.log('Authenticated!');
  }
  else {
    console.log('Authentication failed!');
  }
});

const appli = require("./app/route");
const login = require("./login/route");
const auth = require("./authentification/route");

app.use("/app", appli);
app.use("/login", login);
app.use(auth);

app.listen(4000);
console.log("Environment : "+global.AUTH.env)