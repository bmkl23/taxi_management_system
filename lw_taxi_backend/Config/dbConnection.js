const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB is Successfully Connected");
  } catch (err) {
    console.error("Error:", err.message);
  }
};

module.exports = dbConnection;

