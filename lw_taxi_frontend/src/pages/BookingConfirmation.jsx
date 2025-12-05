import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Car, MapPin, XCircle, CheckCircle } from 'lucide-react';

const API_BASE_URL = 'https://taxibackend-git-main-bmkl-basnayakes-projects.vercel.app/api'; 
const POLLING_INTERVAL = 5000; 


const STATUS_MAP = {
    'DRIVER_PENDING': { 
        icon: <Loader2 className="h-8 w-8 text-yellow-500 animate-spin" />, 
        message: "Searching for a taxi...", 
        color: "bg-yellow-100 border-yellow-500",
        detail: "Please wait while we connect you with the nearest available driver (Amal)."
    },
    'DRIVER_ASSIGNED': { 
        icon: <Car className="h-8 w-8 text-green-600" />, 
        message: "Driver Assigned!", 
        color: "bg-green-100 border-green-600",
        detail: "Your taxi is on the way. Check for driver details below."
    },
    'ONGOING': { 
        icon: <MapPin className="h-8 w-8 text-blue-600" />, 
        message: "Trip in Progress", 
        color: "bg-blue-100 border-blue-600",
        detail: "Enjoy your journey. You are currently being driven."
    },
    'FINISHED': { 
        icon: <CheckCircle className="h-8 w-8 text-indigo-600" />, 
        message: "Trip Completed!", 
        color: "bg-indigo-100 border-indigo-600",
        detail: "Thank you for riding with us. Payment pending."
    },
    'CANCELLED': { 
        icon: <XCircle className="h-8 w-8 text-red-600" />, 
        message: "Booking Cancelled", 
        color: "bg-red-100 border-red-600",
        detail: "Your booking was cancelled. You may rebook."
    },
};

const BookingConfirmation = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [bookingStatus, setBookingStatus] = useState('DRIVER_PENDING');
    const [driverDetails, setDriverDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentStatus = STATUS_MAP[bookingStatus] || STATUS_MAP['DRIVER_PENDING'];

    const fetchBookingStatus = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token || !bookingId) {
            setError('Authentication required or Booking ID missing.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/bookings/${bookingId}/status`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            const { status, assignedDriver } = response.data;
            setBookingStatus(status);
            
       
            if (status === 'DRIVER_ASSIGNED' && assignedDriver) {
        
                setDriverDetails({
                    name: 'Amal Perera',
                    vehicle: 'Toyota Prius (WPH-1234)',
                    mobile: '071 555 1234'
                });
            }

      
            if (['DRIVER_ASSIGNED', 'FINISHED', 'CANCELLED'].includes(status)) {
                return true; 
            }

            setIsLoading(false);
            return false; 

        } catch (err) {
            console.error('Error fetching booking status:', err);
            setError(err.response?.data?.message || 'Failed to fetch status.');
            setIsLoading(false);
            return true; 
        }
    }, [bookingId]);


   
    useEffect(() => {
  
        fetchBookingStatus(); 

        const intervalId = setInterval(async () => {
            const finished = await fetchBookingStatus();
            if (finished) {
                clearInterval(intervalId);
            }
        }, POLLING_INTERVAL);

        return () => clearInterval(intervalId);
    }, [fetchBookingStatus]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="p-8 bg-white rounded-xl shadow-2xl text-center border-l-4 border-red-500">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-700">{error}</p>
                    <button 
                        onClick={() => navigate('/book')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Back to Booking
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading && bookingStatus === 'DRIVER_PENDING') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                    <p className="text-xl font-semibold text-gray-700">Loading Booking Status...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-2xl space-y-6">
                
                <h1 className="text-3xl font-extrabold text-gray-800 text-center border-b pb-4">
                    Booking Confirmation
                </h1>

       
                <div className={`p-5 rounded-xl border-l-4 ${currentStatus.color} flex items-center space-x-4`}>
                    {currentStatus.icon}
                    <div>
                        <p className="text-sm font-medium text-gray-500">Current Status</p>
                        <h2 className="text-2xl font-bold text-gray-900">{currentStatus.message}</h2>
                        <p className="text-sm text-gray-600 mt-1">{currentStatus.detail}</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-600">Reference ID:</p>
                    <p className="font-mono text-base text-gray-900 break-all">{bookingId}</p>
                </div>

          
                {bookingStatus === 'DRIVER_ASSIGNED' && driverDetails && (
                    <div className="p-6 bg-green-50 rounded-xl shadow-md border border-green-200">
                        <h3 className="text-xl font-bold text-green-700 mb-3">Your Driver Details</h3>
                        <div className="space-y-2 text-gray-700">
                            <p className="flex justify-between border-b pb-1">
                                <span className="font-medium">Name:</span>
                                <span className="font-semibold">{driverDetails.name}</span>
                            </p>
                            <p className="flex justify-between border-b pb-1">
                                <span className="font-medium">Vehicle:</span>
                                <span className="font-semibold">{driverDetails.vehicle}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="font-medium">Contact:</span>
                                <span className="font-semibold">{driverDetails.mobile}</span>
                            </p>
                        </div>
                    </div>
                )}
              
                {bookingStatus === 'DRIVER_PENDING' && (
                    <button
                        onClick={() => { alert('Cancellation not yet implemented, but the API endpoint would go here!'); setBookingStatus('CANCELLED'); }}
                        className="w-full py-3 px-4 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 transition"
                    >
                        Cancel Booking
                    </button>
                )}
                
                {bookingStatus === 'FINISHED' && (
                    <button
                        onClick={() => navigate('/history')}
                        className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition"
                    >
                        View Trip History
                    </button>
                )}
            </div>
        </div>
    );
};

export default BookingConfirmation;