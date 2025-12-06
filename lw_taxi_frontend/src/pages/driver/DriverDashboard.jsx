import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://taxibackend-two.vercel.app/api/drivers';
const BOOKINGS_API = 'https://taxibackend-two.vercel.app/api/bookings';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [driverInfo, setDriverInfo] = useState(null);
  const [status, setStatus] = useState('OFFLINE');
  const [isAvailable, setIsAvailable] = useState(false);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [pollingActive, setPollingActive] = useState(false);

  const token = localStorage.getItem('token');
  const driverId = localStorage.getItem('userId');
  const driverName = localStorage.getItem('userName');

  // Fetch driver profile
  const fetchDriverProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/${driverId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDriverInfo(response.data);
      setStatus(response.data.status || 'OFFLINE');
      setIsAvailable(response.data.isAvailable || false);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching driver profile:', error);
      localStorage.clear();
      navigate('/');
    }
  };

  // Fetch available rides (polling)
  const fetchAvailableRides = async () => {
    try {
      if (!isAvailable) return;

      const response = await axios.get(`${BOOKINGS_API}/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.length > 0) {
        setRides(response.data);
      }
    } catch (error) {
      console.error('Error fetching rides:', error);
    }
  };

  // Toggle availability
  const toggleAvailability = async () => {
    setUpdating(true);
    try {
      const response = await axios.patch(
        `${API_URL}/${driverId}/availability`,
        { isAvailable: !isAvailable },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsAvailable(response.data.driver.isAvailable);
      setStatus(response.data.driver.status);
      
      if (!response.data.driver.isAvailable) {
        setRides([]);
      }
    } catch (error) {
      console.error('Availability update failed:', error);
    } finally {
      setUpdating(false);
    }
  };

  // Accept ride
  const handleAccept = async (rideId) => {
    try {
      await axios.patch(
        `${BOOKINGS_API}/${rideId}/accept`,
        { driverId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRides((prev) => prev.filter((r) => r._id !== rideId));
      navigate(`/booking/${rideId}`);
    } catch (error) {
      console.error('Error accepting ride:', error);
      alert('Failed to accept ride');
    }
  };

  // Decline ride
  const handleDecline = async (rideId) => {
    try {
      await axios.patch(
        `${BOOKINGS_API}/${rideId}/decline`,
        { driverId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRides((prev) => prev.filter((r) => r._id !== rideId));
    } catch (error) {
      console.error('Error declining ride:', error);
    }
  };

  // Setup polling
  useEffect(() => {
    fetchDriverProfile();
  }, [driverId]);

  useEffect(() => {
    if (!isAvailable) {
      setPollingActive(false);
      return;
    }

    setPollingActive(true);
    fetchAvailableRides();

    const pollInterval = setInterval(() => {
      fetchAvailableRides();
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [isAvailable, token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) return <div className="flex items-center justify-center h-screen text-lg text-gray-700">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-indigo-600 text-white p-4 rounded shadow-md gap-3">
        <h1 className="text-lg sm:text-xl font-semibold">Driver Dashboard</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${pollingActive ? 'bg-green-500' : 'bg-gray-500'}`}>
            {pollingActive ? 'Polling Active' : 'Offline'}
          </span>
          <button onClick={handleLogout} className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-xs sm:text-sm font-medium transition flex-1 sm:flex-none">Logout</button>
        </div>
      </header>

      <div className="bg-white rounded shadow p-4 sm:p-5 space-y-3">
        <h2 className="text-base sm:text-lg font-semibold">Welcome, {driverName}!</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-xs sm:text-sm">
          <p><strong>Email:</strong> {driverInfo?.email}</p>
          <p><strong>Mobile:</strong> {driverInfo?.mobile}</p>
          <p><strong>Vehicle:</strong> {driverInfo?.vehicle_number || 'N/A'}</p>
          <p>
            <strong>Status:</strong>
            <span className={`ml-2 px-2 py-1 rounded-full text-white text-xs ${status === 'AVAILABLE' ? 'bg-green-500' : 'bg-red-500'}`}>
              {status}
            </span>
          </p>
        </div>
        <button
          onClick={toggleAvailability}
          disabled={updating}
          className={`mt-3 w-full px-4 py-2 rounded text-sm font-medium text-white transition ${updating ? 'bg-gray-400 cursor-not-allowed' : isAvailable ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {updating ? 'Updating...' : isAvailable ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

      <div className="bg-white rounded shadow p-4 sm:p-5">
        <h2 className="text-sm sm:text-md font-semibold mb-3">Ride Requests ({rides.length})</h2>
        {rides.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-xs sm:text-sm">  
            <p>No active ride requests</p>
            <p className="mt-1">{isAvailable ? 'Checking for rides every 3 seconds...' : 'Go online to receive requests'}</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {rides.map((ride) => (
              <div key={ride._id} className="border border-gray-200 rounded p-3 hover:shadow transition">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                  <div className="space-y-1 text-gray-700 text-xs sm:text-sm flex-1">
                    <p>From: {ride.startLocation || ride.pickup}</p>
                    <p>To: {ride.endLocation || ride.drop}</p>
                    <p>Distance: {ride.distance || ride.distance_km} km</p>
                    <p>Time: {ride.estimatedTime || ride.time_minutes} mins</p>
                    <p className="font-medium text-green-600">Fare: Rs {ride.estimatedFare || ride.estimated_fare}</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => handleAccept(ride._id)} 
                      className="flex-1 sm:flex-none px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs font-medium transition"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleDecline(ride._id)} 
                      className="flex-1 sm:flex-none px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-medium transition"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;