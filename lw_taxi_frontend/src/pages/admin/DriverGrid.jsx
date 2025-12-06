import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://taxibackend-two.vercel.app/api/drivers';

const getAdminToken = () => {
    return (
        localStorage.getItem("token") || 
        localStorage.getItem("adminToken") ||
        localStorage.getItem("authToken")
    );
};

const AdminDriverDashboard = () => {
    const [drivers, setDrivers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);
    const [pollingActive, setPollingActive] = useState(false);
    const [driverForm, setDriverForm] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        vehicle_number: ''
    });

    const fetchDrivers = async () => {
        const token = getAdminToken();
        if (!token) return console.error("No admin token found.");

        try {
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const mappedDrivers = (response.data.drivers || []).map(d => ({
                ...d,
                vehicleNumber: d.vehicle_number,
                status: d.isAvailable ? 'AVAILABLE' : 'OFFLINE'
            }));

            setDrivers(mappedDrivers);
        } catch (error) {
            console.error("Error fetching drivers:", error.response?.data);
            setDrivers([]);
        }
    };

    useEffect(() => {
        fetchDrivers();
        setPollingActive(true);

        // Poll every 5 seconds
        const pollInterval = setInterval(() => {
            fetchDrivers();
        }, 5000);

        return () => clearInterval(pollInterval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = getAdminToken();
        if (!token) return;

        try {
            if (editingDriver) {
                await axios.put(`${API_URL}/${editingDriver._id}`, driverForm, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Driver updated successfully!");
            } else {
                await axios.post(`${API_URL}/register`, driverForm, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Driver added successfully!");
            }

            setIsModalOpen(false);
            setEditingDriver(null);
            setDriverForm({ name:'', email:'', mobile:'', password:'', vehicle_number:'' });
            fetchDrivers();
        } catch (error) {
            alert("Error: " + (error.response?.data?.msg || "Unknown"));
            console.error(error.response?.data);
        }
    };

    const handleDeleteDriver = async (driverId) => {
        if (!window.confirm("Are you sure you want to delete this driver?")) return;

        try {
            await axios.delete(`${API_URL}/${driverId}`, {
                headers: { Authorization: `Bearer ${getAdminToken()}` }
            });
            setDrivers(prev => prev.filter(d => d._id !== driverId));
            alert("Driver deleted successfully!");
        } catch (err) {
            alert("Error deleting driver: " + (err.response?.data?.msg || "Unknown"));
        }
    };

    const handleEditDriver = (driver) => {
        setEditingDriver(driver);
        setDriverForm({
            name: driver.name || '',
            email: driver.email || '',
            mobile: driver.mobile || '',
            password: '',
            vehicle_number: driver.vehicle_number || ''
        });
        setIsModalOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'AVAILABLE': return 'bg-green-500';
            case 'BUSY': return 'bg-yellow-500';
            case 'OFFLINE': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="p-4 sm:p-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                <h1 className="text-xl sm:text-2xl font-bold">DRIVER MANAGEMENT DASHBOARD</h1>
                <div className="flex gap-2 w-full sm:w-auto">
                    <span className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${pollingActive ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                        {pollingActive ? 'Polling Active' : 'Offline'}
                    </span>
                    <button
                        onClick={() => { setEditingDriver(null); setDriverForm({ name:'', email:'', mobile:'', password:'', vehicle_number:'' }); setIsModalOpen(true); }}
                        className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm sm:text-base"
                    >
                        + Add New Driver
                    </button>
                </div>
            </header>

            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle No.</th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {drivers.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500">
                                    {getAdminToken() ? "Loading drivers... (or none found)" : "Please log in as Admin"}
                                </td>
                            </tr>
                        ) : (
                            drivers.map(driver => (
                                <tr key={driver._id}>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">{driver.name}</td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.vehicleNumber}</td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${getStatusColor(driver.status)}`}>
                                            {driver.status}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button onClick={() => handleEditDriver(driver)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                        <button onClick={() => handleDeleteDriver(driver._id)} className="text-red-600 hover:text-red-900">Remove</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">{editingDriver ? "Edit Driver" : "Add New Driver"}</h2>

                        <form onSubmit={handleSubmit}>
                            <input placeholder="Name" value={driverForm.name}
                                onChange={(e) => setDriverForm({...driverForm, name: e.target.value})}
                                className="w-full p-2 border rounded mb-3" required />

                            <input placeholder="Email" type="email" value={driverForm.email}
                                onChange={(e) => setDriverForm({...driverForm, email: e.target.value})}
                                className="w-full p-2 border rounded mb-3" required />

                            <input placeholder="Mobile" type="tel" value={driverForm.mobile}
                                onChange={(e) => setDriverForm({...driverForm, mobile: e.target.value})}
                                className="w-full p-2 border rounded mb-3" required />

                            <input placeholder="Password" type="password" value={driverForm.password}
                                onChange={(e) => setDriverForm({...driverForm, password: e.target.value})}
                                className="w-full p-2 border rounded mb-3" 
                                required={!editingDriver} />

                            <input placeholder="Vehicle Number" value={driverForm.vehicle_number}
                                onChange={(e) => setDriverForm({...driverForm, vehicle_number: e.target.value})}
                                className="w-full p-2 border rounded mb-3" required />

                            <div className="flex justify-end mt-4 gap-2">
                                <button type="button" onClick={() => { setIsModalOpen(false); setEditingDriver(null); }} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">{editingDriver ? "Update Driver" : "Add Driver"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDriverDashboard;