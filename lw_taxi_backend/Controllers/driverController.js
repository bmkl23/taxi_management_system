const driverService = require("../Services/driverService");
const Driver = require("../Models/Driver");


exports.registerDriver = async (req, res) => {
  try {
    const result = await driverService.registerDriver(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};


exports.loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await driverService.loginDriver(email, password);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};


exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().select('-password');
    res.json({ drivers });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.getDriverById = async (req, res) => {
  try {
    const { driverId } = req.params;

    if (req.user.role === "DRIVER" && req.user.id !== driverId) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const driver = await Driver.findById(driverId).select('-password');

    if (!driver) {
      return res.status(404).json({ msg: "Driver not found" });
    }

    res.json(driver);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.updateDriverStatus = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { status, isAvailable } = req.body;

    if (req.user.id !== driverId) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const driver = await Driver.findByIdAndUpdate(
      driverId,
      {
        status,
        isAvailable,
        lastSeen: new Date()
      },
      { new: true }
    ).select('-password');

    if (!driver) {
      return res.status(404).json({ msg: "Driver not found" });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('driver_status_update', {
        driverId: driver._id,
        status: driver.status,
        isAvailable: driver.isAvailable
      });
    }

    res.json({ msg: "Status updated successfully", driver });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};


exports.updateDriverAvailability = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { isAvailable } = req.body;

    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({ msg: "isAvailable must be boolean" });
    }

    if (req.user.id !== driverId) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const status = isAvailable ? 'AVAILABLE' : 'OFFLINE';

    const driver = await Driver.findByIdAndUpdate(
      driverId,
      {
        isAvailable,
        status,
        lastSeen: new Date()
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!driver) {
      return res.status(404).json({ msg: "Driver not found" });
    }

    console.log(` Driver ${driverId} availability updated:`, { isAvailable, status });

    const io = req.app.get('io');
    if (io) {
      io.emit('driver_status_update', {
        driverId: driver._id,
        status: driver.status,
        isAvailable: driver.isAvailable
      });
    }

    res.json({
      msg: "Availability updated successfully",
      driver
    });

  } catch (err) {
    console.error("Error updating availability:", err);
    res.status(400).json({ msg: err.message });
  }
};


exports.updateDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const updateData = req.body;

    if (updateData.password) {
      const bcrypt = require("bcryptjs");
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedDriver = await Driver.findByIdAndUpdate(driverId, updateData, { new: true });
    res.status(200).json({ msg: "Driver updated", driver: updatedDriver });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};


exports.deleteDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    await Driver.findByIdAndDelete(driverId);
    res.status(200).json({ msg: "Driver deleted successfully" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};