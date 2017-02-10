// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var request = require('request');
var config = require('../config.json');

passport.use(new BasicStrategy(
    function(username, password, callback) {
        var headers = {
            'Content-Type': 'application/json'
        };

        var options = {
            url: config.apis.usuarios + 'usuarios/check/',
            method: 'POST',
            headers: headers,
            json: {'username': username, 'password': password}
        }

        // inicia a requisição para checar o usuário
        request(options, function(err, res, body) {
             if (err || res.statusCode == 400) {
                callback(null, false);
            } else if (!body.auth) {
                callback(null, false);
            } else {
                callback(null, body.usuario);
            }
        });
    }
));

exports.isAuthenticated = passport.authenticate('basic', { session: false });
