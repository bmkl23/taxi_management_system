const bcrypt = require("bcrypt");
const User = require("./Models/User");
const dbConnection = require("./Config/dbConnection"); 
require("dotenv").config();

dbConnection(); 

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash("AdminPassword123", 10);
    const admin = await User.create({
      name: "Hiruni",
      email: "admin@taxi.com",
      mobile: "0771234567",
      password: hashedPassword,
      role: "ADMIN"
    });
    console.log("Admin created:", admin);
    process.exit(); 
  } catch (err) {
    console.error("Error creating admin:", err.message);
    process.exit(1);
  }
}

createAdmin();
