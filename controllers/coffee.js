// Load required packages
var Coffee = require('../models/coffee');

// Create endpoint /api/coffees for POSTS
exports.postCoffees = function(req, res) {
  // Create a new instance of the Coffee model
  var coffee = new Coffee();

  // Set the coffee properties that came from the POST data
  coffee.name = req.body.name;
  coffee.type = req.body.type;
  coffee.quantity = req.body.quantity;
  coffee.userId = req.user._id;

  // Save the coffee and check for errors
  coffee.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Coffee added to the locker!', data: coffee });
  });
};

// Create endpoint /api/coffees for GET
exports.getCoffees = function(req, res) {
  // Use the Coffee model to find all coffee
  Coffee.find({ userId: req.user._id }, function(err, coffees) {
    if (err)
      res.send(err);

    res.json(coffees);
  });
};

// Create endpoint /api/coffees/:coffee_id for GET
exports.getCoffee = function(req, res) {
  // Use the Coffee model to find a specific coffee
  Coffee.find({ userId: req.user._id, _id: req.params.coffee_id }, function(err, coffee) {
    if (err)
      res.send(err);

    res.json(coffee);
  });
};

// Create endpoint /api/coffees/:coffee_id for PUT
exports.putCoffee = function(req, res) {
  // Use the Coffee model to find a specific coffee
  Coffee.update({ userId: req.user._id, _id: req.params.coffee_id }, { quantity: req.body.quantity }, function(err, coffee) {
    if (err)
      res.send(err);

    res.json({ message: ' updated' });
  });
};

// Create endpoint /api/coffees/:coffee_id for DELETE
exports.deleteCoffee = function(req, res) {
  // Use the Coffee model to find a specific coffee and remove it
  Coffee.remove({ userId: req.user._id, _id: req.params.coffee_id }, function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Coffee removed from the locker!' });
  });
};
