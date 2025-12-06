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
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">

      {/* Navigation Bar */}
      <nav className="bg-[#3b3c54] flex justify-between items-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-white text-base sm:text-lg md:text-xl font-semibold tracking-wide">
            Hotel Safaya
          </span>
        </div>
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: "#e57373",
            ":hover": { bgcolor: "#d66767" },
            fontWeight: "bold",
            fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
            padding: { xs: "6px 12px", sm: "8px 16px", md: "10px 20px" }
          }}
          onClick={handleOpenReg} 
        >
          Sign Up
        </Button>
      </nav>

      {/* Hero Section */}
      <main
        className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          minHeight: '50vh',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${homeImage})`,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="relative z-10 text-white max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight sm:leading-snug">
            "Your Ride, Your Way."
          </h1>

          <p className="mt-3 sm:mt-4 md:mt-5 text-sm sm:text-base md:text-lg lg:text-xl max-w-xl leading-relaxed mx-auto">
            "Book in seconds. Track in real-time. Ride with comfort and safety."
          </p>

          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: "#ffffff",
              color: "#3b3c54",
              mt: 4,
              sm: { mt: 5 },
              md: { mt: 6 },
              px: { xs: 4, sm: 5, md: 6 },
              py: { xs: 1, sm: 1.3, md: 1.8 },
              fontWeight: "bold",
              borderRadius: "10px",
              fontSize: { xs: "0.875rem", sm: "1rem", md: "1.1rem" },
              ":hover": { bgcolor: "#e8c4c0" }
            }}
            onClick={handleOpenLogin} 
          >
            Start Your Journey Here 
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#2a2b33] w-full py-8 sm:py-10 md:py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 text-white px-4 sm:px-6 md:px-10">
        
        {/* Section 1 */}
        <div>
          <h4 className="font-bold mb-2 sm:mb-3 text-sm sm:text-base">Taxi & Transport Services</h4>
          <ul className="space-y-1 text-gray-300 text-xs sm:text-sm">
            <li className="hover:text-white cursor-pointer transition">Taxi Booking</li>
            <li className="hover:text-white cursor-pointer transition">Airport Pickup & Drop</li>
            <li className="hover:text-white cursor-pointer transition">City Tours</li>
            <li className="hover:text-white cursor-pointer transition">Long-Distance Rides</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div>
          <h4 className="font-bold mb-2 sm:mb-3 text-sm sm:text-base">Modules</h4>
          <ul className="space-y-1 text-gray-300 text-xs sm:text-sm">
            <li className="hover:text-white cursor-pointer transition">E-Commerce</li>
            <li className="hover:text-white cursor-pointer transition">Cash on Delivery</li>
            <li className="hover:text-white cursor-pointer transition">Manufacturing</li>
            <li className="hover:text-white cursor-pointer transition">Repair & Services</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div>
          <h4 className="font-bold mb-2 sm:mb-3 text-sm sm:text-base">Contact Details</h4>
          <ul className="space-y-1 text-gray-300 text-xs sm:text-sm">
            <li>Hotel Safaya</li>
            <li>Hotline: +94 XX XXX XXXX</li>
            <li>Email: reservations@hotel.lk</li>
            <li>No. XX, Street, Colombo, Sri Lanka</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div>
          <h4 className="font-bold mb-2 sm:mb-3 text-sm sm:text-base">Follow Us</h4>
          <div className="flex space-x-3 sm:space-x-4">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
              className="text-white hover:text-[#3b5998] transition duration-300">
              <Facebook fontSize="small" className="sm:fontSize-medium" />
            </a>
            <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer"
              className="text-white hover:text-[#25D366] transition duration-300">
              <WhatsApp fontSize="small" className="sm:fontSize-medium" />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"
              className="text-white hover:text-[#0077B5] transition duration-300">
              <LinkedIn fontSize="small" className="sm:fontSize-medium" />
            </a>
          </div>
        </div>
      </footer>

      {/* Dialogs */}
      <Dialog 
        open={openReg} 
        onClose={handleCloseReg}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            margin: '16px'
          }
        }}
      >
        <RegistrationPopup switchToLogin={switchToLogin} handleCloseReg={handleCloseReg} />
      </Dialog>

      <Dialog 
        open={openLogin} 
        onClose={handleCloseLogin}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            margin: '16px'
          }
        }}
      >
        <LoginPopup switchToRegister={switchToRegister} handleCloseLogin={handleCloseLogin} />
      </Dialog>
    </div>
  );
}