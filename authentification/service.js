var nodemailer = require('nodemailer');
var mysql = require('mysql');
require('../helpers/config');

var ActiveDirectory = require('activedirectory');
var config = { url: 'ldap://192.168.5.20:389',
               baseDN: 'DC=mspr,DC=com',
               username: 'administrateur@mspr.com',
               password: 'Azerty123' }
var ad = new ActiveDirectory(config);

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tomwallyn.mspr@gmail.com',
        pass: 'TomWallynMSPR'
    }
});

var connection = mysql.createConnection({
    host: global.AUTH.bdd_ip,
    port: global.AUTH.bdd_port,
    user: "root",
    password: "my_secret_password",
    database: "app_db"
});

module.exports = {
    sendMail: function (to, subject, text) {
        var mailOptions = {
            from: 'mspr@epsi.fr',
            to: to,
            subject: subject,
            html: text
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    },
    
    checkIp: function(username, ip) {
        return new Promise(function (resolve, reject) {
            return connection.query("SELECT * FROM ip_adresse WHERE username = ? AND ip = ?", [username, ip], function(error, results, fields) {
                // If there is an issue with the query, output the error
                if (error) throw error;
                // If the account exists
                if (results.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    },
    
    checkNavigator: function(username, navigator) {
        return new Promise(function (resolve, reject) {
            return connection.query("SELECT * FROM navigator WHERE username = ? AND navigator = ?", [username, navigator], function(error, results, fields) {
                // If there is an issue with the query, output the error
                if (error) throw error;
                // If the account exists
                if (results.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    },
    
    check2fa: function(code, username, ip) {
        return new Promise(function (resolve, reject) {
            return connection.query('SELECT * FROM 2fa WHERE token = ? AND username = ? AND ip = ?', [code, username, ip], function(error, results, fields) {
                // If there is an issue with the query, output the error
                if (error) throw error;
                // If the account exists
                if (results.length > 0) {
                    module.exports.delete2fa(code, username, ip);
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    },

    delete2fa: function(code, username, ip) {
        return new Promise(function (resolve, reject) {
                connection.query('DELETE FROM 2fa WHERE token = ? AND username = ? AND ip = ?', [code, username, ip], function(error, results, fields) {
                });
        });
    }, 
    
    generateToken: function() {
        return new Promise(function (resolve, reject) {
            require('crypto').randomBytes(48, function(err, buffer) {
                resolve(buffer.toString('hex'));
            });
        })
    },
    
    setToken: function(username, mail, ip) {
        return new Promise(function (resolve, reject) {
            module.exports.generateToken().then(function (token){
                connection.query('INSERT INTO 2fa (token, username, ip) VALUES (?, ?, ?)', [token, username, ip], function(error, results, fields) {
                    module.exports.sendMail(mail, "2FA Connect", `<a href=\"${global.AUTH.url_front}/2fa/${token}/${username}\">Click to connect with 2FA</a>`)
                });
            })
        });
    },

    getUser: function(username) {
        return new Promise(function (resolve, reject) {
            ad.findUser(username, function(err, user) {
                resolve(user);
            });
        });
    },

    setNewBrowser: function(username, navigator) {
        return new Promise(function (resolve, reject) {
                connection.query('INSERT INTO navigator (username, navigator) VALUES (?, ?)', [username, navigator], function(error, results, fields) {
                });
        });
    },

    saveIpAdresse: function(username, ip) {
        return new Promise(function (resolve, reject) {
                connection.query('INSERT INTO ip_adresse (username, ip) VALUES (?, ?)', [username, ip], function(error, results, fields) {
                });
        });
    },

    checkAuthActiveDirectory: function(username, password) {
        return new Promise(function (resolve, reject) {
            ad.authenticate(username, password, function(err, auth) {
            if (auth) {
                ad.findUser(username, function(err, user) {
                    resolve(user.mail);
                });
            }
            else {
                resolve(false);
            }
        });
    })
    }
};

