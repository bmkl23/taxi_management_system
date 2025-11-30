const userService = require("../Services/userService");


exports.registerUser = async (req, res) => {
  try {
    const result = await userService.registerUser(req.body);
    res.status(201).json(result); 
  } catch (err) {
    const status = err.message.includes("exists") ? 409 : 400;
    res.status(status).json({ message: err.message }); 
  }
};



exports.loginUser = async (req, res) => {
  try {
    console.log(req.body);
    const result = await userService.loginUser(req.body);
    res.status(200).json(result); 
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ message: "Invalid credentials" });
  }
};


exports.getMyProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id); 
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};


const Booking = require("../Models/Booking"); 
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
