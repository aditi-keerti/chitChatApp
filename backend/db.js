const mongoose = require('mongoose');
require("dotenv").config();

const mongoURL = process.env.mongoURL;

// Check if the mongoURL is defined
if (!mongoURL) {   
  console.error("MongoDB connection URL is not defined. Please check your environment variables.");
  process.exit(1); // Exit the process if there's an issue
}

// Establish MongoDB connection
const connection = mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process if there's an issue
  });

module.exports = { connection };
