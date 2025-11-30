const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user            : { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pickup          : { type: String, required: true },
  drop            : { type: String, required: true },
  distance_km     : { type: Number, required: true },
  time_minutes    : { type: Number, required: true },
  estimated_fare  : { type: Number, required: true },

status: {
  type: String,
  enum: [
    "DRIVER_PENDING",
    "DRIVER_ASSIGNED",
    "NO_DRIVER_AVAILABLE",  
    "ONGOING",
    "FINISHED",
    "CANCELLED"
  ],
  default: "DRIVER_PENDING"
},


  assigned_driver : { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
  payment_status  : { type: String, enum: ["PENDING", "PAID"], default: "PENDING" }

}, { timestamps: true }); 

module.exports = mongoose.model("Booking", bookingSchema);
