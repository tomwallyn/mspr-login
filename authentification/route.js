var express = require('express');
var router = express.Router();
var service = require('./service');
require('../helpers/config');

var mysql = require('mysql');
var requestIp = require('request-ip');

var connection = mysql.createConnection({
    host: global.AUTH.bdd_ip,
    port: global.AUTH.bdd_port,
    user: "root",
    password: "my_secret_password",
    database: "app_db"
});

router.get('/2fa/:code/:idUser', function(req, res){
    service.check2fa(req.params.code, req.params.idUser, requestIp.getClientIp(req)).then(function (result){
        if(result == true){
            service.checkNavigator(req.params.idUser, req.headers['user-agent']).then(function (response){
                if(response == true) {
                    service.getUser(req.params.idUser).then(function(result){
                        req.session.loggedin = true;
                        req.session.username = result[0].email;
                        res.redirect('/app');
                    })
                } else {
                    service.getUser(req.params.idUser).then(function(result){
                        service.setToken(req.params.idUser, requestIp.getClientIp(req), result[0].email);
                        service.setNewBrowser(req.params.idUser, requestIp.getClientIp(req), req.headers['user-agent'], "logged");
                        res.send("Your browser is unknown, we will send you a confirmation email ")
                    })
                }
            });
        } else {
            res.send("[ERROR]: Token is not valid")
        }
    })
})

router.post('/auth', function(request, response) {
    console.log("Ip adresse : "+requestIp.getClientIp(request))
    console.log("Navigator : "+request.headers['user-agent'])
    // Capture the input fields
    let username = request.body.username;
    let password = request.body.password;
    // Ensure the input fields exists and are not empty
    if (username && password) {
        // Execute SQL query that'll select the account from the database based on the specified username and password
        connection.query('SELECT * FROM user WHERE email = ? AND password = ?', [username, password], function(error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) throw error;
            // If the account exists
            if (results.length > 0) {
                service.setToken(results[0].id, requestIp.getClientIp(request), results[0].email);

                response.send('An email has been sent!');
                
                service.checkIp(results[0].id, requestIp.getClientIp(request)).then(function (response){
                    if(response == false){
                        service.sendMail(results[0].email, "Tentative de connexion", "Une Ip inabhituelle à essayer de ce connecter à votre compte")
                    }
                });
            } else {
                response.send('Incorrect Username and/or Password!');
            }			
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

module.exports = router;