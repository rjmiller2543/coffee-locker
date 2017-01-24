// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var CoffeeSchema   = new mongoose.Schema({
  name: String,
  roast: String,
  quantity: Number,
  userId: String
});

// Export the Mongoose model
module.exports = mongoose.model('Coffee', CoffeeSchema);
