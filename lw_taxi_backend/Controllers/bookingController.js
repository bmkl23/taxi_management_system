const bookingService = require("../Services/bookingService");
const Booking = require("../Models/Booking");
const Driver = require("../Models/Driver");
const mongoose = require("mongoose");

exports.createBooking = async (req, res) => {
    const userId = req.user.id;
    const { startLocation, endLocation, distance, estimatedTime, estimatedFare } = req.body;

    try {
        console.log("Creating booking for user:", userId);

        const bookingData = {
            user: userId,
            pickup: startLocation,
            drop: endLocation,
            distance_km: distance,
            time_minutes: estimatedTime,
            estimated_fare: estimatedFare,
            status: "DRIVER_PENDING"
        };

        const newBooking = await bookingService.createBooking(bookingData);
        console.log(" Booking created:", newBooking._id);

        const io = req.app.get('io');
        console.log(" Searching for available driver with socketId...");
        
        const availableDriver = await Driver.findOne({
            isAvailable: true,
            socketId: { $exists: true, $ne: null },
            status: 'AVAILABLE'
        }).sort({ lastSeen: -1 });

        if (availableDriver) {
            console.log("Found available driver:", {
                id: availableDriver._id,
                name: availableDriver.name,
                socketId: availableDriver.socketId,
                email: availableDriver.email
            });

            newBooking.assigned_driver = availableDriver._id;
            newBooking.status = 'DRIVER_PENDING';
            await newBooking.save();

            availableDriver.isAvailable = false;
            await availableDriver.save();

            if (io && availableDriver.socketId) {
                console.log("Emitting new_ride_request to socket:", availableDriver.socketId);
                
                io.to(availableDriver.socketId).emit('new_ride_request', {
                    _id: newBooking._id,
                    pickup: newBooking.pickup,
                    drop: newBooking.drop,
                    distance_km: newBooking.distance_km,
                    time_minutes: newBooking.time_minutes,
                    estimated_fare: newBooking.estimated_fare,
                    user: newBooking.user,
                    status: newBooking.status
                });
                
                console.log(` Ride request sent to driver ${availableDriver.name}`);
            } else {
                console.error(" IO not available or no socketId");
            }

        } else {
            console.log(' No available drivers found');
            newBooking.status = 'NO_DRIVER_AVAILABLE';
            await newBooking.save();
        }

        res.status(201).json({
            message: "Booking submitted successfully.",
            bookingId: newBooking._id,
            status: newBooking.status,
            assignedDriver: availableDriver ? {
                id: availableDriver._id,
                name: availableDriver.name
            } : null
        });

    } catch (err) {
        console.error(" Booking submission error:", err.message);
        res.status(400).json({ message: err.message });
    }
};


exports.getBookingStatus = async (req, res) => {
    const { bookingId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        console.log(' Fetching booking:', bookingId, 'for user:', userId);

        const booking = await Booking.findById(bookingId)
            .populate('user', 'name mobile email')
            .populate('assigned_driver', 'name mobile vehicle_number');

        if (!booking) {
            console.error(' Booking not found:', bookingId);
            return res.status(404).json({ message: "Booking not found" });
        }

        const isPassenger = booking.user && booking.user._id.toString() === userId;
        const isAssignedDriver = booking.assigned_driver && booking.assigned_driver._id.toString() === userId;
        const isAdmin = userRole === 'ADMIN';

        console.log(' Access check:', { isPassenger, isAssignedDriver, isAdmin });

        if (!isPassenger && !isAssignedDriver && !isAdmin) {
            console.error(' Access denied for user:', userId);
            return res.status(403).json({ message: "Access denied to this booking." });
        }

        res.json({
            status: booking.status,
            assignedDriver: booking.assigned_driver || null,
            pickup: booking.pickup,
            drop: booking.drop,
            distance_km: booking.distance_km,
            time_minutes: booking.time_minutes,
            estimated_fare: booking.estimated_fare,
            user: booking.user,
            booking: booking
        });

    } catch (err) {
        console.error(" Error fetching booking status:", err);
        res.status(500).json({ message: err.message });
    }
};


exports.getAllBookings = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ msg: "Forbidden: Admins only" });
    }

    console.log(' Fetching all bookings for admin...');

    const bookings = await Booking.find()
      .populate('user', 'name email mobile')
      .populate('assigned_driver', 'name mobile vehicle_number')
      .sort({ createdAt: -1 });

    console.log(` Found ${bookings.length} bookings`);

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ msg: "Server error fetching bookings" });
  }
};


exports.getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id;

        const bookings = await Booking.find({ user: userId })
            .populate('assigned_driver', 'name mobile vehicle_number')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (err) {
        console.error("Error fetching user bookings:", err);
        res.status(500).json({ msg: "Server error" });
    }
};

exports.cancelBooking = async (req, res) => {
    const { bookingId } = req.params;

    try {
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (req.user.role !== 'ADMIN' && booking.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        booking.status = 'CANCELLED';
        await booking.save();

        if (booking.assigned_driver) {
            const driver = await Driver.findByIdAndUpdate(booking.assigned_driver, {
                isAvailable: true,
                status: 'AVAILABLE'
            }, { new: true });

            const io = req.app.get('io');
            if (io && driver?.socketId) {
                io.to(driver.socketId).emit('ride_cancelled', {
                    rideId: booking._id,
                    message: 'Ride has been cancelled by user'
                });
            }
        }

        res.json({ message: "Booking cancelled successfully", booking });

    } catch (err) {
        console.error("Error cancelling booking:", err);
        res.status(500).json({ message: "Server error" });
    }
};


exports.updateBookingStatus = async (req, res) => {
    const { bookingId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        console.log(' Updating booking status:', { bookingId, status, userId });

        const booking = await Booking.findById(bookingId)
            .populate('user', 'name mobile email')
            .populate('assigned_driver', 'name mobile vehicle_number');

        if (!booking) {
            console.error(' Booking not found:', bookingId);
            return res.status(404).json({ message: "Booking not found" });
        }

        const isAssignedDriver = booking.assigned_driver && booking.assigned_driver._id.toString() === userId;
        const isAdmin = userRole === 'ADMIN';

        console.log(' Authorization check:', { isAssignedDriver, isAdmin });

        if (!isAssignedDriver && !isAdmin) {
            console.error(' Not authorized to update booking');
            return res.status(403).json({ message: "Only the assigned driver can update booking status" });
        }

        const validStatuses = ['DRIVER_PENDING', 'DRIVER_ASSIGNED', 'NO_DRIVER_AVAILABLE', 'ONGOING', 'FINISHED', 'CANCELLED'];
        
        if (!validStatuses.includes(status)) {
            console.error(' Invalid status:', status);
            return res.status(400).json({ 
                message: `Invalid status: ${status}. Valid values are: ${validStatuses.join(', ')}` 
            });
        }

        booking.status = status;
        const updatedBooking = await booking.save();
        console.log(' Booking status updated:', updatedBooking.status);

        const io = req.app.get('io');
        if (io) {
            io.emit('booking_status_update', {
                bookingId: booking._id,
                status: booking.status
            });
        }

        res.json({ 
            message: "Booking status updated", 
            booking: updatedBooking
        });

    } catch (err) {
        console.error(" Error updating booking status:", err);
        res.status(500).json({ message: "Server error: " + err.message });
    }
};


exports.updatePaymentStatus = async (req, res) => {
    const { bookingId } = req.params;
    const { payment_status } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        console.log(' Updating payment status:', { bookingId, payment_status });

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const isDriver = booking.assigned_driver?.toString() === userId;
        const isAdmin = userRole === 'ADMIN';

        if (!isDriver && !isAdmin) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (!['PENDING', 'PAID'].includes(payment_status)) {
            return res.status(400).json({ message: "Invalid payment_status. Must be PENDING or PAID" });
        }

        booking.payment_status = payment_status;
        const updated = await booking.save();

        console.log(' Payment status updated to:', payment_status);

        const io = req.app.get('io');
        if (io) {
            io.emit('payment_status_update', { bookingId, payment_status });
        }

        res.json({ message: "Payment status updated", booking: updated });

    } catch (err) {
        console.error(" Error updating payment:", err);
        res.status(500).json({ message: err.message });
    }
};