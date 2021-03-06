// Get the packages we need
var express = require('express');
var cors = require('cors');
var mysql = require('mysql');
var connection = require('express-myconnection');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');

var fotoController = require('./controllers/foto');

var passport = require('passport')
var authController = require('./controllers/auth');

var config = require('./config.json');

// Create our Express application
var app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/api/fotos', fileUpload());

/** MYSQL **/

app.use(
    connection(mysql, {
        host: config.bd.host,
        port: config.bd.port,
        user: config.bd.user,
        password: config.bd.password,
        database: config.bd.database
    }, 'request')
);

// Passport para autenticação
app.use(passport.initialize());

/** ROUTES **/

// Create our express router
var router = express.Router();

router.route('/fotos')
    .get(authController.isAuthenticated, fotoController.getFotos)
    .post(authController.isAuthenticated, fotoController.postFotos);

router.route('/fotos/:id')
    .get(authController.isAuthenticated, fotoController.getFoto)
    .put(authController.isAuthenticated, fotoController.putFoto)
    .delete(authController.isAuthenticated, fotoController.deleteFoto);

// Register all our router with /api
app.use('/api', router);

/** SERVER START **/

// Use environment defined port or 3000
var port = config.server.port;
var ip = config.server.ip;

// Start the server
app.listen(port, ip);
console.log('Listening: ' + ip + ":" + port);
