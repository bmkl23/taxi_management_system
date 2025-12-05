import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Clock, CreditCard } from "lucide-react";

const API_BASE_URL = "https://taxibackend-two.vercel.app/api";

export default function DriverBooking() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tripStarted, setTripStarted] = useState(false);
  const [tripCompleted, setTripCompleted] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const fetchBooking = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/bookings/${bookingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBooking(response.data);
    } catch (err) {
      alert("Failed to load booking details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, []);

  const handleStartTrip = async () => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/bookings/${bookingId}/status`,
        { status: "ONGOING" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBooking(response.data.booking);
      setTripStarted(true);
    } catch {
      alert("Failed to start trip.");
    }
  };

  const handleCompleteTrip = async () => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/bookings/${bookingId}/status`,
        { status: "FINISHED" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBooking(response.data.booking);
      setTripCompleted(true);
      setTripStarted(false);
    } catch {
      alert("Failed to complete trip.");
    }
  };

  const handleProcessPayment = async () => {
    try {
      setProcessingPayment(true);
      await axios.patch(
        `${API_BASE_URL}/bookings/${bookingId}/payment`,
        { payment_status: "PAID" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/driver-dashboard");
    } catch {
      alert("Payment update failed.");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-lg font-semibold">Loading...</div>
    );

  if (!booking)
    return (
      <div className="p-6 text-center text-lg text-red-600">
        Booking not found.
      </div>
    );

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-6 border border-green-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-5">TOUR SUMMARY</h2>

        <div className="space-y-5">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border">
            <MapPin className="text-green-600" size={22} />
            <div>
              <p className="text-gray-600 text-sm">Pickup</p>
              <p className="font-semibold text-lg">{booking.pickup || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border">
            <MapPin className="text-red-600" size={22} />
            <div>
              <p className="text-gray-600 text-sm">Drop-off</p>
              <p className="font-semibold text-lg">{booking.drop || "N/A"}</p>
            </div>
          </div>

          <div className="bg-blue-50 shadow-md rounded-xl p-4 border border-blue-100 mt-4">
            <h3 className="font-bold text-lg mb-2">Passenger Details</h3>
            {booking.user ? (
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {booking.user.name || "Not Available"}
                </p>
                <p>
                  <strong>Mobile:</strong>{" "}
                  {booking.user.mobile || "Not Available"}
                </p>
                <p>
                  <strong>Email:</strong> {booking.user.email || "Not Available"}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">Passenger info not available yet</p>
            )}
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-50 border">
            <Clock className="text-blue-600" size={22} />
            <div>
              <p className="text-gray-600 text-sm">Estimated Time</p>
              <p className="font-semibold text-lg">
                {booking.time_minutes} mins
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-green-50 border border-green-200 p-4 rounded-xl">
            <span className="font-semibold text-gray-700">Fare</span>
            <span className="text-2xl font-bold text-green-700">
              Rs {booking.estimated_fare}
            </span>
          </div>
        </div>

        <div className="mt-5 px-4 py-3 rounded-xl text-center bg-gray-100 text-gray-700 font-semibold">
          Status: {booking.status}
        </div>
      </div>

      {!tripStarted && !tripCompleted && (
        <button
          onClick={handleStartTrip}
          className="w-full mt-5 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-transform hover:scale-[1.02]"
        >
          Start Trip
        </button>
      )}

      {tripStarted && !tripCompleted && (
        <button
          onClick={handleCompleteTrip}
          className="w-full mt-5 py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-transform hover:scale-[1.02]"
        >
          Complete Trip
        </button>
      )}

      {tripCompleted && (
        <div className="bg-white/90 shadow-xl rounded-2xl p-6 mt-6 border-2 border-green-500">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard size={22} className="text-green-600" />
            PAYMENT COLLECTION
          </h3>

          <div className="p-4 bg-green-50 border border-green-200 rounded-xl mb-4">
            <p className="flex justify-between text-lg mb-2">
              <span className="font-semibold text-gray-700">Trip Fare:</span>
              <span className="font-bold text-green-700">
                Rs {booking.estimated_fare}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Distance: {booking.distance_km} km • Duration:{" "}
              {booking.time_minutes} mins
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleProcessPayment}
              disabled={processingPayment}
              className={`w-full py-3 rounded-lg font-semibold text-base text-white shadow transition-transform ${
                processingPayment
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 hover:scale-[1.02]"
              }`}
            >
              {processingPayment ? "Processing..." : "Confirm the Tour Payment"}
            </button>

            <button
              onClick={() => navigate("/driver-dashboard")}
              className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold text-base hover:bg-red-700 transition-transform hover:scale-[1.02]"
            >
              Cancel and Return
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
