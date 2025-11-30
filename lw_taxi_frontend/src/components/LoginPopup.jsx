import React, { useState } from "react";
import { Card, CardContent, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPopup({ switchToRegister, handleCloseLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
     
      let response;
      let loginEndpoint;

      try {
        
        response = await axios.post("http://localhost:5000/api/drivers/login", form);
        loginEndpoint = "driver";
      } catch (driverError) {
       
        try {
          response = await axios.post("http://localhost:5000/api/auth/login", form);
          loginEndpoint = "auth";
        } catch (authError) {
          throw new Error("Invalid credentials");
        }
      }

      const { token, user, driver } = response.data;
      const userData = user || driver;


      localStorage.setItem("token", token);
      localStorage.setItem("userId", userData._id || userData.id);
      localStorage.setItem("userName", userData.name);
      localStorage.setItem("role", userData.role);
      localStorage.setItem("userRole", userData.role);

    
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setMessage("Login Successful");
      handleCloseLogin();

      if (userData.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (userData.role === "DRIVER") {
        navigate("/driver-dashboard");
      } else {
        navigate("/map");
      }

    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.response?.data?.msg || error.message || "❌ Invalid credentials");
    }
  };


  return (
    <Card className="w-96 p-6 rounded-2xl shadow-lg max-w-[420px]">
      <CardContent>
        <Typography variant="h5" className="text-center font-semibold mb-4 text-[#3b3c54]">
          Login to Your Account
        </Typography>

        {message && (
          <p className={`text-center mb-4 font-medium ${message.includes("no") ? "text-red-500" : "text-green-600"}`}>
            {message}
          </p>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <TextField 
            label="Email" 
            name="email" 
            type="email" 
            value={form.email} 
            onChange={handleChange} 
            required 
          />
          <TextField 
            label="Password" 
            name="password" 
            type="password" 
            value={form.password} 
            onChange={handleChange} 
            required 
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ bgcolor: "#3b3c54", ":hover": { bgcolor: "#2d2e42" }, fontWeight: "600", py: 1.5 }}
          >
            Login
          </Button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <span className="text-[#e57373] font-semibold cursor-pointer hover:underline" onClick={switchToRegister}>
            Sign Up
          </span>
        </p>
      </CardContent>
    </Card>
  );
}