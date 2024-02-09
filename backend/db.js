const mongoose = require('mongoose');
require("dotenv").config();

const mongoURL = process.env.mongoURL;

// Check if the mongoURL is defined


// Establish MongoDB connection
const connection = mongoose.connect(mongoURL)
  
module.exports = { connection };
