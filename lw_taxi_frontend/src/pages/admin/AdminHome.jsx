import { useNavigate } from "react-router-dom";
import { FaUsers, FaMapMarkedAlt, FaCar, FaFacebookF, FaWhatsapp, FaLinkedinIn } from "react-icons/fa";

export default function AdminHome() {
  const navigate = useNavigate();

  return (

  <div className="min-h-screen flex flex-col p-10 bg-linear-to-r from-blue-300 to-green-400 relative">
      <div className="absolute inset-0 bg-black/10"></div>

  <div className="relative z-10 mb-12 flex flex-col items-center w-full">
      <div
        className="text-white px-12 py-8 rounded-3xl shadow-2xl backdrop-blur-md w-full max-w-5xl flex flex-col items-center"
        style={{
          background: "linear-gradient(135deg, #0f4c75 0%, #3282b8 100%)", // dark blue → teal
        }}
      >
    <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
    <h2 className="text-2xl font-semibold">Hotel Safaya</h2>
    <p className="text-lg mt-1 opacity-90">Colombo Seven</p>
    <p className="text-sm mt-2 italic opacity-80">
      Where Luxury Meets Excellence
    </p>
  </div>
</div>


      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
   
        <div
          className="p-6 bg-blue-50/90 backdrop-blur-xl rounded-xl shadow-lg cursor-pointer hover:shadow-2xl transition hover:scale-[1.02] border border-blue-200 flex flex-col items-start gap-4"
          onClick={() => navigate("/admin/users")}>
          <FaUsers className="text-blue-600 text-3xl" />
          <h2 className="text-xl font-bold text-blue-800">Users Grid</h2>
          <p className="text-blue-700">View and manage all registered users.</p>
        </div>

  
        <div
          className="p-6 bg-green-50/90 backdrop-blur-xl rounded-xl shadow-lg cursor-pointer hover:shadow-2xl transition hover:scale-[1.02] border border-green-200 flex flex-col items-start gap-4"
          onClick={() => navigate("/admin/tours")}>
          <FaMapMarkedAlt className="text-green-600 text-3xl" />
          <h2 className="text-xl font-bold text-green-800">Tours Grid</h2>
          <p className="text-green-700">View all tour bookings and details.</p>
        </div>

      
        <div
          className="p-6 bg-yellow-50/90 backdrop-blur-xl rounded-xl shadow-lg cursor-pointer hover:shadow-2xl transition hover:scale-[1.02] border border-yellow-200 flex flex-col items-start gap-4"
          onClick={() => navigate("/admin/drivers")}>
          <FaCar className="text-yellow-600 text-3xl" />
          <h2 className="text-xl font-bold text-yellow-800">Driver Grid</h2>
          <p className="text-yellow-700">View drivers and add new drivers.</p>
        </div>
      </div>

 
      <footer className="bg-[#181842] w-full py-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-white px-10 mt-auto">
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
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer">
              <FaFacebookF className="text-white hover:text-[#3b5998]" />
            </a>
            <a
              href="https://www.whatsapp.com"
              target="_blank"
              rel="noopener noreferrer">
              <FaWhatsapp className="text-white hover:text-[#25D366]" />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer">
              <FaLinkedinIn className="text-white hover:text-[#0077B5]" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
