const mongoose = require("mongoose");

async function db() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/EventManager`);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

module.exports = db;
