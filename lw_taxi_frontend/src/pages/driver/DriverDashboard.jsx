import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://taxibackend-git-main-bmkl-basnayakes-projects.vercel.app/api/drivers';
const SOCKET_URL = 'https://taxibackend-git-main-bmkl-basnayakes-projects.vercel.app';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [driverInfo, setDriverInfo] = useState(null);
  const [status, setStatus] = useState('OFFLINE');
  const [isAvailable, setIsAvailable] = useState(false);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const [updating, setUpdating] = useState(false);
  const socketRef = useRef();

  const token = localStorage.getItem('token');
  const driverId = localStorage.getItem('userId');
  const driverName = localStorage.getItem('userName');


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
    } catch (error) {
      console.error('Availability update failed:', error);
    } finally {
      setUpdating(false);
    }
  };

 
  const handleAccept = (rideId) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit('accept_booking', { bookingId: rideId, driverId });
    setRides((prev) => prev.filter((r) => r._id !== rideId));
    navigate(`/booking/${rideId}`);
  };

 
  const handleDecline = (rideId) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit('reject_booking', { bookingId: rideId, driverId });
    setRides((prev) => prev.filter((r) => r._id !== rideId));
  };

 
  useEffect(() => {
    fetchDriverProfile();

    socketRef.current = io(SOCKET_URL, { auth: { userId: driverId }, reconnection: true });
    const socket = socketRef.current;

    socket.on('connect', () => {
      setSocketConnected(true);
      socket.emit('driver_online', driverId);
    });

    socket.on('connect_error', () => setSocketConnected(false));

    socket.on('new_ride_request', (rideData) => {
      setRides((prev) => [...prev.filter(r => r._id !== rideData._id), rideData]);
    });

    socket.on('ride_cancelled', (data) => {
      setRides((prev) => prev.filter((r) => r._id !== data.rideId));
    });

    return () => socket.disconnect();
  }, [driverId]);

  const handleLogout = () => {
    if (socketRef.current?.connected) socketRef.current.emit('driver_offline', driverId);
    localStorage.clear();
    navigate('/');
  };

  if (loading) return <div className="flex items-center justify-center h-screen text-lg text-gray-700">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">


      <header className="flex justify-between items-center bg-indigo-600 text-white p-4 rounded shadow-md">
        <h1 className="text-xl font-semibold">Driver Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded-full text-sm font-medium ${socketConnected ? 'bg-green-500' : 'bg-red-500'}`}>
            {socketConnected ? 'Connected' : 'Disconnected'}
          </span>
          <button onClick={handleLogout} className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-sm font-medium transition">Logout</button>
        </div>
      </header>

      <div className="bg-white rounded shadow p-5 space-y-3">
        <h2 className="text-lg font-semibold">Welcome, {driverName}!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 text-sm">
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
          className={`mt-3 w-full md:w-auto px-4 py-2 rounded text-sm font-medium text-white transition ${updating ? 'bg-gray-400 cursor-not-allowed' : isAvailable ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {updating ? 'Updating...' : isAvailable ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

 
      <div className="bg-white rounded shadow p-5">
        <h2 className="text-md font-semibold mb-3">Ride Requests ({rides.length})</h2>
        {rides.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-sm">  
            <p>No active ride requests</p>
            <p className="mt-1">{isAvailable && socketConnected ? 'Waiting for new requests...' : !socketConnected ? 'Reconnecting...' : 'Go online to receive requests'}</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {rides.map((ride, index) => (
              <div key={ride._id} className="border border-gray-200 rounded p-3 hover:shadow transition">
                <div className="flex justify-between items-start">
                  <div className="space-y-1 text-gray-700 text-sm">
                    <p>From: {ride.pickup}</p>
                    <p>To: {ride.drop}</p>
                    <p>Distance: {ride.distance_km} km</p>
                    <p>Time: {ride.time_minutes} mins</p>
                    <p className="font-medium text-green-600">Fare: Rs {ride.estimated_fare}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleAccept(ride._id)} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs font-medium transition">Accept</button>
                    <button onClick={() => handleDecline(ride._id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-medium transition">Decline</button>
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
