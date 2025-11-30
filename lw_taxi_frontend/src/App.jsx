import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/HomePage.jsx";
import BookingRoutes from "./pages/BookingRoutes.jsx";
import TourHistoryPage from "./pages/admin/TourHistoryPage.jsx";
import AdminDashboard from "./pages/admin/AdminHome.jsx";
import UsersGrid from "./pages/admin/UsersGrid.jsx";
import DriverGrid from "./pages/admin/DriverGrid.jsx";
import DriverDashboard from "./pages/driver/DriverDashboard.jsx";
import DriverBooking from "./pages/driver/DriverBooking.jsx"; 

function App() {
  const userRole = localStorage.getItem("userRole");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<BookingRoutes />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="/admin/users" element={<UsersGrid />} />
        <Route path="/admin/tours" element={<TourHistoryPage />} />
        <Route path="/admin/drivers" element={<DriverGrid />} />

        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/booking/:bookingId" element={<DriverBooking />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;