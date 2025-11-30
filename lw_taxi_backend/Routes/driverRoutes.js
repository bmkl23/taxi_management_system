// Routes/driverRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/authMiddleware");
const driverController = require("../Controllers/driverController");

router.post("/register", driverController.registerDriver);
router.post("/login", driverController.loginDriver);

router.get("/", authMiddleware, driverController.getAllDrivers);
router.get("/:driverId", authMiddleware, driverController.getDriverById);

router.patch("/:driverId/status", authMiddleware, driverController.updateDriverStatus);
router.patch("/:driverId/availability", authMiddleware, driverController.updateDriverAvailability);
router.patch("/:driverId", authMiddleware, driverController.updateDriver);

router.delete("/:driverId", authMiddleware, driverController.deleteDriver);


module.exports = router;