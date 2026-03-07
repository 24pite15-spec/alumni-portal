import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    department: "",
    year: new Date().getFullYear(),
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => currentYear - i);

  const validateForm = () => {
    if (!form.fullName.trim()) return "Full Name is required";
    if (!form.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Invalid email address";
    if (!form.password) return "Password is required";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    if (!form.year) return "Graduation year is required";
    return null;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (error) setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          password: form.password,
          phone: form.phone.trim(),
          department: form.department.trim(),
          year: form.year,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess("Registration successful! Please await admin approval. You can now login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setError("An error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 700 }}>
          Register for Alumni Portal
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleRegister} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Full Name"
            placeholder="Enter your full name"
            value={form.fullName}
            onChange={handleChange("fullName")}
            disabled={loading}
            fullWidth
            required
          />

          <TextField
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange("email")}
            disabled={loading}
            fullWidth
            required
          />

          <TextField
            type="tel"
            label="Phone Number (Optional)"
            placeholder="Enter your phone number"
            value={form.phone}
            onChange={handleChange("phone")}
            disabled={loading}
            fullWidth
          />

          <TextField
            label="Department (Optional)"
            placeholder="Enter your department"
            value={form.department}
            onChange={handleChange("department")}
            disabled={loading}
            fullWidth
          />

          <TextField
            select
            label="Graduation Year"
            value={form.year}
            onChange={handleChange("year")}
            disabled={loading}
            fullWidth
            required
            SelectProps={{ native: true }}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </TextField>

          <TextField
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange("password")}
            disabled={loading}
            fullWidth
            required
            helperText="At least 6 characters"
          />

          <TextField
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            disabled={loading}
            fullWidth
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ py: 1.5, fontSize: "1rem", mt: 1 }}
          >
            {loading ? <CircularProgress size={24} /> : "Register"}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3, textAlign: "center", color: "#666" }}>
          Already have an account?{" "}
          <Typography
            component="span"
            onClick={() => navigate("/login")}
            sx={{
              color: "#6879e3",
              cursor: "pointer",
              fontWeight: 600,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Login here
          </Typography>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;
