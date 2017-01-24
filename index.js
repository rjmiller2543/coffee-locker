// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Coffee = require('./models/coffee');
var coffeeController = require('./controllers/coffee');
var userController = require('./controllers/user');
var passport = require('passport');
var authController = require('./controllers/auth');
var clientController = require('./controllers/client');
var session = require('express-session');
var oauth2Controller = require('./controllers/oauth2');

var path = __dirname + '/views/';

var uristring =
    process.env.MONGODB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/HelloMongoose';

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
      if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
      } else {
        console.log ('Succeeded connected to: ' + uristring);
      }
});

// Create our Express application
var app = express();

app.use(bodyParser.json);
app.use(bodyParser.urlencoded({
  extended: true
}));
// Set view engine to ejs
app.set('view engine', 'ejs');
// Use express session support since OAuth2orize requires it
app.use(session({
  secret: 'Super Secret Session Key',
  saveUninitialized: true,
  resave: true
}));

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Create our Express router
var router = express.Router();

// Create endpoint handlers for /users
router.route('/users')
  .post(userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers);

  // Create endpoint handlers for /clients
router.route('/clients')
  .post(authController.isAuthenticated, clientController.postClients)
  .get(authController.isAuthenticated, clientController.getClients);

  // Create endpoint handlers for oauth2 authorize
router.route('/oauth2/authorize')
  .get(authController.isAuthenticated, oauth2Controller.authorization)
  .post(authController.isAuthenticated, oauth2Controller.decision);

// Create endpoint handlers for oauth2 token
router.route('/oauth2/token')
  .post(authController.isClientAuthenticated, oauth2Controller.token);

// Create endpoint handlers for /coffees
router.route('/coffees')
  .post(authController.isAuthenticated, coffeeController.postCoffees)
  .get(authController.isAuthenticated, coffeeController.getCoffees);

// Create endpoint handlers for /coffees/:coffee_id
router.route('/coffees/:coffee_id')
  .get(authController.isAuthenticated, coffeeController.getCoffee)
  .put(authController.isAuthenticated, coffeeController.putCoffee)
  .delete(authController.isAuthenticated, coffeeController.deleteCoffee);


// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(port);
console.log('Insert coffee on port ' + port);
