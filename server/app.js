// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');    // call express
var app        = module.exports = express();         // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8500;    // set our port

// Connect to DB

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/infomarket'); // connect to our database

require('./keyword');


// add a simple web-server for the sample client
app.use( "/", express.static( "client" ) );
app.use( "/lib", express.static( "bower_components" ) );


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('REST Server started on port ' + port);
console.log('REST: http://localhost:' + port + "/api" );
console.log('WEB : http://localhost:' + port + "/" );


