const Booking = require("../Models/Booking"); 


exports.createBooking = async (bookingData) => {
    try {
      const newBooking = new Booking({
    user: bookingData.user,           
    pickup: bookingData.pickup,      
    drop: bookingData.drop,          
    distance_km: bookingData.distance_km,
    time_minutes: bookingData.time_minutes, 
    estimated_fare: bookingData.estimated_fare,
    status: 'DRIVER_PENDING'
});


        const booking = await newBooking.save();
        return booking;
    } catch (err) {
        console.error("Error creating booking:", err.message);
        throw new Error("Failed to save booking to database.");
    }
};


exports.getBookingById = async (bookingId) => {
    const booking = await Booking.findById(bookingId).lean();
    if (!booking) {
        throw new Error("Booking not found.");
    }
    return booking;
};