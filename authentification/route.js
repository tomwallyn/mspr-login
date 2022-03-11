var express = require('express');
var router = express.Router();
var service = require('./service');
const rateLimit = require("express-rate-limit");
require('../helpers/config');

var requestIp = require('request-ip');

const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 60 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

router.get('/2fa/:code/:username', function(req, res){
    service.check2fa(req.params.code, req.params.username, requestIp.getClientIp(req)).then(function (result){
        if(result == true){
            service.checkNavigator(req.params.username, req.headers['user-agent']).then(function (response){
                if(response == true) {
                    req.session.loggedin = true;
                    req.session.username = req.params.username;
                    service.saveIpAdresse(req.params.username, requestIp.getClientIp(req));
                    res.redirect('/app');
                } else {
                    service.getUser(req.params.username).then(function(result){
                        service.setToken(req.params.username, result.mail, requestIp.getClientIp(req));
                        service.setNewBrowser(req.params.username, req.headers['user-agent']);
                        res.send("Your browser is unknown, we will send you a confirmation email ")
                    })
                }
            });
        } else {
            res.send("[ERROR]: Token is not valid")
        }
    })
})

router.post('/auth', limiter, function(request, response) {
    console.log("Ipv6 adresse : "+requestIp.getClientIp(request))
    console.log("Navigator : "+request.headers['user-agent'])
    // Capture the input fields
    let username = request.body.username;
    let password = request.body.password;
    // Ensure the input fields exists and are not empty
    if(service.checkIpCountry(requestIp.getClientIp(request)) == null || service.checkIpCountry(requestIp.getClientIp(request)).country == 'FR') {
        if (username && password) {
            // Execute SQL query that'll select the account from the database based on the specified username and password
            service.checkAuthActiveDirectory(username, password).then(function(auth){
                if (auth != false) {
                    service.setToken(username, auth, requestIp.getClientIp(request));
    
                    response.send('An email has been sent!');
                    
                    service.checkIp(username, requestIp.getClientIp(request)).then(function (response){
                        if(response == false){
                            service.sendMail(auth, "Tentative de connexion", "Une Ip inabhituelle à essayer de ce connecter à votre compte")
                        }
                    });
                } else {
                    response.status(401);
                    response.send('Incorrect Username and/or Password!');
                }			
                response.end();
            })
        } else {
            response.send('Please enter Username and Password!');
            response.end();
        }
    } else {
        response.send('Ip non autorisé !');
    }
});

module.exports = router;