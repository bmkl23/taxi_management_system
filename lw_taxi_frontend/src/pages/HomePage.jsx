import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import RegistrationPopup from "../components/RegistrationPopup";
import LoginPopup from "../components/LoginPopup";
import { Facebook, WhatsApp, LinkedIn } from "@mui/icons-material";
import homeImage from "../assets/home.jpg"; 

export default function HomePage() {
  const [openReg, setOpenReg] = useState(false);
  const [openLogin, setOpenLogin] = useState(false); 

  const handleOpenReg = () => setOpenReg(true);
  const handleCloseReg = () => setOpenReg(false);

  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);

  const switchToRegister = () => {
    setOpenLogin(false);
    setOpenReg(true);
  };
  const switchToLogin = () => {
    setOpenReg(false);
    setOpenLogin(true); 
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">

      <nav className="bg-[#3b3c54] flex justify-between items-center px-8 py-4 shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-white text-xl font-semibold tracking-wide">Hotel Safaya</span>
        </div>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#e57373",
            ":hover": { bgcolor: "#d66767" },
            fontWeight: "bold"
          }}
          onClick={handleOpenReg} 
        >
          Sign Up
        </Button>
      </nav>

      <main
        className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden bg-cover bg-center"
        style={{
          minHeight: '60vh',
          backgroundImage: `url(${homeImage})`
        }}
      >
        <div className="relative z-10 text-white">
          <h1 className="text-4xl md:text-5xl font-bold leading-snug">
            “Your Ride, Your Way.”
          </h1>

          <p className="mt-4 text-lg md:text-xl max-w-xl leading-relaxed">
            “Book in seconds. Track in real-time. Ride with comfort and safety.”
          </p>

          <Button
            variant="contained"
            sx={{
              bgcolor: "#ffffff",
              color: "#3b3c54",
              mt: 6,
              px: 6,
              py: 1.8,
              fontWeight: "bold",
              borderRadius: "10px",
              ":hover": { bgcolor: "#e8c4c0" }
            }}
            onClick={handleOpenLogin} 
          >
            Start Your Journey Here 
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#2a2b33] w-full py-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-white px-10">
        <div>
          <h4 className="font-bold mb-3">Taxi & Transport Services</h4>
          <ul className="space-y-1 text-gray-300">
            <li>Taxi Booking</li>
            <li>Airport Pickup & Drop</li>
            <li>City Tours</li>
            <li>Long-Distance Rides</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">Modules</h4>
          <ul className="space-y-1 text-gray-300">
            <li>E-Commerce</li>
            <li>Cash on Delivery</li>
            <li>Manufacturing</li>
            <li>Repair & Services</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">Contact Details</h4>
          <ul className="space-y-1 text-gray-300">
            <li>Hotel Safaya</li>
            <li>Hotline: +94 XX XXX XXXX</li>
            <li>Email: reservations@hotel.lk</li>
            <li>No. XX, Street, Colombo, Sri Lanka</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <Facebook className="text-white hover:text-[#3b5998]" />
            </a>
            <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer">
              <WhatsApp className="text-white hover:text-[#25D366]" />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <LinkedIn className="text-white hover:text-[#0077B5]" />
            </a>
          </div>
        </div>
      </footer>

      <Dialog open={openReg} onClose={handleCloseReg}>
        <RegistrationPopup switchToLogin={switchToLogin} />
      </Dialog>

      <Dialog open={openLogin} onClose={handleCloseLogin}>
        <LoginPopup switchToRegister={switchToRegister} handleCloseLogin={handleCloseLogin} />
      </Dialog>
    </div>
  );
}
