var nodemailer = require('nodemailer');
var mysql = require('mysql');
require('../helpers/config');

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
    
    checkIp: function(idUser, ip) {
        return new Promise(function (resolve, reject) {
            return connection.query("SELECT * FROM ipAdresse WHERE idUser = ? AND ipAdresse = ? AND status = 'logged'", [idUser, ip], function(error, results, fields) {
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
    
    checkNavigator: function(idUser, navigator) {
        return new Promise(function (resolve, reject) {
            return connection.query("SELECT * FROM ipAdresse WHERE idUser = ? AND navigator = ? AND status = 'logged'", [idUser, navigator], function(error, results, fields) {
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
    
    check2fa: function(code, idUser, ip) {
        return new Promise(function (resolve, reject) {
            return connection.query('SELECT * FROM 2fa WHERE token = ? AND idUser = ? AND ip = ?', [code, idUser, ip], function(error, results, fields) {
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
    
    generateToken: function() {
        return new Promise(function (resolve, reject) {
            require('crypto').randomBytes(48, function(err, buffer) {
                resolve(buffer.toString('hex'));
            });
        })
    },
    
    setToken: function(idUser, ip, mail) {
        return new Promise(function (resolve, reject) {
            module.exports.generateToken().then(function (token){
                connection.query('INSERT INTO 2fa (token, idUser, ip) VALUES (?, ?, ?)', [token, idUser, ip], function(error, results, fields) {
                    module.exports.sendMail(mail, "2FA Connect", `<a href=\"${global.AUTH.url_front}/2fa/${token}/${idUser}\">Click to connect with 2FA</a>`)
                });
            })
        });
    },

    getUser: function(idUser) {
        return new Promise(function (resolve, reject) {
                connection.query('SELECT * FROM user WHERE id = ?', [idUser], function(error, results, fields) {
                    resolve(results);
                });
        });
    },

    setNewBrowser: function(idUser, ip, navigator, status) {
        return new Promise(function (resolve, reject) {
                connection.query('INSERT INTO ipAdresse (idUser, ipAdresse, navigator, status) VALUES (?, ?, ?, ?)', [idUser, ip, navigator, status], function(error, results, fields) {
                });
        });
    },
};

