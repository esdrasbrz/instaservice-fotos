// Get the packages we need
var express = require('express');
var mysql = require('mysql');
var connection = require('express-myconnection');
var bodyParser = require('body-parser');


var config = require('./config.json');

// Create our Express application
var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

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


// Register all our router with /api
app.use('/api', router);

/** SERVER START **/

// Use environment defined port or 3000
var port = config.server.port;

// Start the server
app.listen(port);
console.log('Listening: ' + port);
