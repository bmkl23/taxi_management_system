import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, TextField, Button } from "@mui/material";

export default function RegistrationPopup({ switchToLogin, handleCloseReg }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(
        "https://taxibackend-git-main-bmkl-basnayakes-projects.vercel.app/api/auth/register",
        form
      );
      
      const { token, user: userData } = res.data;
      
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("userName", userData.name);
      localStorage.setItem("role", userData.role);
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setMessage("Registration Successful, Please Login...");
      setForm({ name: "", email: "", mobile: "", password: "" });

      
      setTimeout(() => {
        switchToLogin();
        handleCloseReg(); 
      }, 1500);

    } catch (error) {
      setMessage(
        error.response?.data?.message || " Registration Failed"
      );
    }
  };

  return (
    <Card
      style={{
        width: 420,
        padding: 25,
        borderRadius: 16,
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          style={{
            textAlign: "center",
            marginBottom: 20,
            fontWeight: "600",
            color: "#3b3c54",
          }}
        >
          Create Your Account
        </Typography>

        {message && (
          <p
            style={{
              textAlign: "center",
              color: message.includes("no") ? "red" : "green",
              marginBottom: 15,
              fontWeight: "500",
            }}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}  style={{ display: "flex", flexDirection: "column", gap: 16 }} >

          <TextField label="Full Name" name="name" value={form.name} onChange={handleChange} required />

          <TextField
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Mobile"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              bgcolor: "#3b3c54",
              ":hover": { bgcolor: "#2d2e42" },
              fontWeight: "600",
              paddingY: "10px",
            }}
          >
            Register
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}