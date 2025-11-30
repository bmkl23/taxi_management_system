const Driver = require("../Models/Driver.js");
const Booking = require("../Models/Booking.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class DriverService {
  async registerDriver(data) {
    const { name, email, mobile, password, vehicle_number } = data;
    const existing = await Driver.findOne({ email });
    if (existing) throw new Error("Driver already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const driver = await Driver.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      vehicle_number
    });

    return { msg: "Driver registered successfully", driver };
  }

  async loginDriver(email, password) {
    const driver = await Driver.findOne({ email });
    if (!driver) throw new Error("Driver not found");

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { id: driver._id, role: "DRIVER" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return { token, driver };
  }

  async getPendingBookings(driverId) {
    return await Booking.find({
      assigned_driver: driverId,
      status: "DRIVER_PENDING"
    });
  }

  async handleBookingAction(driverId, bookingId, action) {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error("Booking not found");

    if (!booking.assigned_driver || booking.assigned_driver.toString() !== driverId) {
      throw new Error("This booking does not belong to this driver");
    }

    if (action === "ACCEPT") {
      booking.status = "ONGOING";
      await booking.save();

      const driver = await Driver.findById(driverId);
      driver.isAvailable = false;
      await driver.save();

      return { msg: "Booking Accepted", booking };
    }

    if (action === "REJECT") {
      booking.status = "DRIVER_PENDING";
      booking.assigned_driver = null; 
      await booking.save();

      
      const nextDriver = await Driver.findOne({ isAvailable: true });
      if (nextDriver) {
        booking.assigned_driver = nextDriver._id;
        await booking.save();

        nextDriver.isAvailable = false;
        await nextDriver.save();
      }

      return { msg: "Booking Rejected & Next Driver Assigned", booking };
    }

    throw new Error("Invalid action");
  }
}

module.exports = new DriverService();
