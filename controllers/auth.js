// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var request = require('request');
var config = require('../config.json');

passport.use(new BasicStrategy(
    function(username, password, callback) {
        var headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        var options = {
            url: config.apis.usuarios + 'usuarios/check/',
            method: 'POST',
            headers: headers,
            form: {'username': username, 'password': password}
        }

        // inicia a requisição para checar o usuário
        request(options, function(err, res, body) {
            body = JSON.parse(body);

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
