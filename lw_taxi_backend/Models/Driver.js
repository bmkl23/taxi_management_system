const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    vehicle_number: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["DRIVER", "ADMIN"],
      default: "DRIVER",
    },
    status: {
      type: String,
      enum: ["AVAILABLE", "BUSY", "OFFLINE"],
      default: "OFFLINE",
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },

    socketId: {
      type: String,
      default: null,
      sparse: true,  
    },
    lastSeen: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);