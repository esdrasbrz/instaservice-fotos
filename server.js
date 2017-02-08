// Get the packages we need
var express = require('express');
var mysql = require('mysql');
var connection = require('express-myconnection');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');

var fotoController = require('./controllers/foto');

var config = require('./config.json');

// Create our Express application
var app = express();

//app.use(fileUpload());

app.use(bodyParser.urlencoded({
    extended: true
}));

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

/** ROUTES **/

// Create our express router
var router = express.Router();

router.route('/fotos')
    .get(fotoController.getFotos)
    .post(fotoController.postFotos);

router.route('/fotos/:id')
    .get(fotoController.getFoto)
    .put(fotoController.putFoto)
    .delete(fotoController.deleteFoto);

// Register all our router with /api
app.use('/api', router);

/** SERVER START **/

// Use environment defined port or 3000
var port = config.server.port;

// Start the server
app.listen(port);
console.log('Listening: ' + port);
