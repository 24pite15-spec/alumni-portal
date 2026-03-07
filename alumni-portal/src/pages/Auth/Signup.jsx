



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  CircularProgress,
  Select,
  MenuItem,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ApartmentIcon from "@mui/icons-material/Apartment";
import SchoolIcon from "@mui/icons-material/School";
import PhoneIcon from "@mui/icons-material/Phone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";




const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    department: "",
    year: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // disable browser autofill on mount
  useEffect(() => {
    setTimeout(() => {
      const inputs = document.querySelectorAll('input');
      inputs.forEach((el) => {
        el.value = "";
        el.setAttribute("autocomplete", "new-password");
      });
    }, 50);
  }, []);




  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };




  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };




  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };




  const validate = () => {
    let temp = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z\s]+$/;
    const phoneRegex = /^[0-9]{10}$/;




    if (!form.fullName) {
      temp.fullName = "Full name is required";
    } else if (!nameRegex.test(form.fullName)) {
      temp.fullName = "Name must contain only alphabets";
    }
   
    if (!form.department) temp.department = "Department is required";
   
    if (!form.year) temp.year = "Year of passout is required";
   
    if (!form.phone) {
      temp.phone = "Phone number is required";
    } else if (!phoneRegex.test(form.phone)) {
      temp.phone = "Phone number must be exactly 10 digits";
    }
   
    if (!form.email) {
      temp.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      temp.email = "Enter a valid email";
    }




    // Password validation
    if (!form.password) {
      temp.password = "Password is required";
    } else if (form.password.length < 8) {
      temp.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(form.password)) {
      temp.password = "Password must have at least one uppercase letter";
    } else if (!/[a-z]/.test(form.password)) {
      temp.password = "Password must have at least one lowercase letter";
    } else if (!/[0-9]/.test(form.password)) {
      temp.password = "Password must have at least one number";
    } else if (!/[!@#$%^&*]/.test(form.password)) {
      temp.password = "Password must have a special character (!@#$%^&*)";
    }




    // Confirm password validation
    if (!form.confirmPassword) {
      temp.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      temp.confirmPassword = "Passwords do not match";
    }




    setErrors(temp);
    return Object.keys(temp).length === 0;
  };




const handleSignup = async () => {
  if (!validate()) return;




  try {
    setLoading(true);




    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });




    const data = await response.json();




    if (response.ok) {
      alert("Registration Successful...Wait For Admin's approval✅");
      console.log("Server Response:", data);
      navigate("/"); // redirect to login
    } else {
      alert(data.message || "Registration failed");
    }




  } catch (error) {
    console.error("Error:", error);
    alert("Server error. Please try again.");
  } finally {
    setLoading(false);
  }
};




  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSignup();
    }
  };




  return (
    <Box
      component="form"
      autoComplete="off"
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #6879e3 0%, #5a6fd6 50%, #4a60cc 100%)",
        padding: { xs: "10px", sm: "20px" },
        fontFamily: "Roboto, sans-serif",
        boxSizing: "border-box",
        overflowY: "auto",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.03) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: "1200px" },
          height: "auto",
          minHeight: { xs: "auto", sm: "700px" },
          borderRadius: { xs: "0px", sm: "16px" },
          overflow: "hidden",
          background: "white",
          boxShadow: { xs: "none", sm: "0 20px 60px rgba(0, 0, 0, 0.3)" },
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* LEFT PANEL - BRANDING */}
        <Box
          sx={{
            width: { xs: "100%", sm: "40%" },
            background: "linear-gradient(135deg, #6879e3 0%, #5a6fd6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
            padding: { xs: "40px 30px", sm: "40px 30px" },
            minHeight: { xs: "250px", sm: "auto" },
            position: "relative",
            overflow: "hidden",
            "&::after": {
              content: '""',
              position: "absolute",
              top: "-50%",
              right: "-50%",
              width: "500px",
              height: "500px",
              background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
              pointerEvents: "none",
            },
          }}
        >
          <Box
            sx={{
              width: "80px",
              height: "80px",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
              backdropFilter: "blur(10px)",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: "40px",
                fontWeight: "700",
                color: "white",
              }}
            >
              🎓
            </Typography>
          </Box>




          <Typography
            variant="h4"
            fontWeight="700"
            color="white"
            sx={{ mb: 2, fontSize: { xs: "28px", sm: "32px" }, position: "relative", zIndex: 1 }}
          >
            ALUMNI
          </Typography>




          <Typography
            variant="body1"
            color="rgba(255, 255, 255, 0.9)"
            sx={{
              fontSize: "14px",
              lineHeight: "1.6",
              fontWeight: "300",
              position: "relative",
              zIndex: 1,
            }}
          >
            Join our community and connect with fellow alumni. Build lasting relationships and expand your professional network.
          </Typography>
        </Box>




        {/* RIGHT PANEL - FORM */}
        <Box
          sx={{
            width: { xs: "100%", sm: "60%" },
            padding: { xs: "30px 20px", sm: "40px 45px" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "white",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{
              mb: 1,
              color: "#1a202c",
              fontSize: { xs: "24px", sm: "28px" },
            }}
          >
            Create Account
          </Typography>




          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: "#718096",
              fontSize: "14px",
            }}
          >
            Join our alumni network and stay connected
          </Typography>




          {/* FORM FIELDS GRID */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: { xs: "16px", sm: "20px" },
            }}
          >
            {/* FULL NAME */}
            <TextField
              label="Full Name"
              name="fullName"
              fullWidth
              margin="0"
              value={form.fullName}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              error={!!errors.fullName}
              helperText={errors.fullName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ color: "#cbd5e0", fontSize: "20px" }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                style: { color: "#1a202c", fontSize: "14px", fontWeight: "600" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f7fafc",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  "& fieldset": {
                    borderColor: "#e2e8f0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cbd5e0",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#6879e3",
                    boxShadow: "0 0 0 3px rgba(104, 121, 227, 0.1)",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  color: "#1a202c",
                  fontSize: "14px",
                },
              }}
            />




            {/* PHONE NUMBER */}
            <TextField
              label="Phone Number"
              name="phone"
              fullWidth
              margin="0"
              value={form.phone}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              error={!!errors.phone}
              helperText={errors.phone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: "#cbd5e0", fontSize: "20px" }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                style: { color: "#1a202c", fontSize: "14px", fontWeight: "600" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f7fafc",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  "& fieldset": {
                    borderColor: "#e2e8f0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cbd5e0",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#6879e3",
                    boxShadow: "0 0 0 3px rgba(104, 121, 227, 0.1)",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  color: "#1a202c",
                  fontSize: "14px",
                },
              }}
            />




            {/* DEPARTMENT - DROPDOWN */}
            <Select
              name="department"
              value={form.department}
              onChange={handleChange}
              error={!!errors.department}
              displayEmpty
              fullWidth
              sx={{
                backgroundColor: "#f7fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
                color: "#1a202c",
                height: "56px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e2e8f0",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#cbd5e0",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#6879e3",
                  boxShadow: "0 0 0 3px rgba(104, 121, 227, 0.1)",
                },
              }}
            >
              <MenuItem value="" disabled>
                <Typography sx={{ color: "#a0aec0", fontSize: "14px", fontWeight: "600" }}>
                  Department
                </Typography>
              </MenuItem>
              <MenuItem value="Computer Science">Computer Science</MenuItem>
              <MenuItem value="Mechanical Engineering">Mechanical Engineering</MenuItem>
              <MenuItem value="Electronics & Communication">Electronics & Communication</MenuItem>
              <MenuItem value="Civil Engineering">Civil Engineering</MenuItem>
              <MenuItem value="Electrical Engineering">Electrical Engineering</MenuItem>
              <MenuItem value="Information Technology">Information Technology</MenuItem>
            </Select>
            {errors.department && (
              <Typography sx={{ color: "#e53e3e", fontSize: "12px", mt: 0.5 }}>
                {errors.department}
              </Typography>
            )}




            {/* YEAR - DROPDOWN */}
            <Select
              name="year"
              value={form.year}
              onChange={handleChange}
              error={!!errors.year}
              displayEmpty
              fullWidth
              sx={{
                backgroundColor: "#f7fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
                color: "#1a202c",
                height: "56px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e2e8f0",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#cbd5e0",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#6879e3",
                  boxShadow: "0 0 0 3px rgba(104, 121, 227, 0.1)",
                },
              }}
            >
              <MenuItem value="" disabled>
                <Typography sx={{ color: "#a0aec0", fontSize: "14px", fontWeight: "600" }}>
                  Year of Passout
                </Typography>
              </MenuItem>
              <MenuItem value="2024">2024</MenuItem>
              <MenuItem value="2023">2023</MenuItem>
              <MenuItem value="2022">2022</MenuItem>
              <MenuItem value="2021">2021</MenuItem>
              <MenuItem value="2020">2020</MenuItem>
              <MenuItem value="2019">2019</MenuItem>
              <MenuItem value="2018">2018</MenuItem>
              <MenuItem value="2017">2017</MenuItem>
              <MenuItem value="2016">2016</MenuItem>
              <MenuItem value="2015">2015</MenuItem>
              <MenuItem value="2014">2014</MenuItem>
              <MenuItem value="2013">2013</MenuItem>
              <MenuItem value="2012">2012</MenuItem>
              <MenuItem value="2011">2011</MenuItem>
              <MenuItem value="2010">2010</MenuItem>
              <MenuItem value="2009">2009</MenuItem>
              <MenuItem value="2008">2008</MenuItem>
              <MenuItem value="2007">2007</MenuItem>
              <MenuItem value="2006">2006</MenuItem>
              <MenuItem value="2005">2005</MenuItem>
              <MenuItem value="2004">2004</MenuItem>
            </Select>
            {errors.year && (
              <Typography sx={{ color: "#e53e3e", fontSize: "12px", mt: 0.5 }}>
                {errors.year}
              </Typography>
            )}




            {/* EMAIL - FULL WIDTH */}
            <TextField
              label="Email Address"
              name="email"
              type="email"
              autoComplete="off"
              fullWidth
              margin="0"
              value={form.email}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon sx={{ color: "#cbd5e0", fontSize: "20px" }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                style: { color: "#1a202c", fontSize: "14px", fontWeight: "600" },
              }}
              sx={{
                gridColumn: { xs: "1 / -1", sm: "1 / -1" },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f7fafc",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  "& fieldset": {
                    borderColor: "#e2e8f0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cbd5e0",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#6879e3",
                    boxShadow: "0 0 0 3px rgba(104, 121, 227, 0.1)",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  color: "#1a202c",
                  fontSize: "14px",
                },
              }}
            />




            {/* CREATE PASSWORD - FULL WIDTH */}
            <TextField
              label="Create Password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              fullWidth
              margin="0"
              value={form.password}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              error={!!errors.password}
              helperText={errors.password || "Min 8 chars, 1 uppercase, 1 number, 1 special char (!@#$%^&*)"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: "#cbd5e0", fontSize: "20px" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={togglePasswordVisibility}
                      sx={{
                        minWidth: 0,
                        padding: "4px",
                        color: "#cbd5e0",
                        "&:hover": { backgroundColor: "transparent", color: "#6879e3" },
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </Button>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                style: { color: "#1a202c", fontSize: "14px", fontWeight: "600" },
              }}
              sx={{
                gridColumn: { xs: "1 / -1", sm: "1 / -1" },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f7fafc",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  "& fieldset": {
                    borderColor: "#e2e8f0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cbd5e0",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#6879e3",
                    boxShadow: "0 0 0 3px rgba(104, 121, 227, 0.1)",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  color: "#1a202c",
                  fontSize: "14px",
                },
              }}
            />




            {/* CONFIRM PASSWORD - FULL WIDTH */}
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              fullWidth
              margin="0"
              value={form.confirmPassword}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: "#cbd5e0", fontSize: "20px" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={toggleConfirmPasswordVisibility}
                      sx={{
                        minWidth: 0,
                        padding: "4px",
                        color: "#cbd5e0",
                        "&:hover": { backgroundColor: "transparent", color: "#6879e3" },
                      }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </Button>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                style: { color: "#1a202c", fontSize: "14px", fontWeight: "600" },
              }}
              sx={{
                gridColumn: { xs: "1 / -1", sm: "1 / -1" },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f7fafc",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  "& fieldset": {
                    borderColor: "#e2e8f0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cbd5e0",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#6879e3",
                    boxShadow: "0 0 0 3px rgba(104, 121, 227, 0.1)",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  color: "#1a202c",
                  fontSize: "14px",
                },
              }}
            />
          </Box>




          {/* SIGNUP BUTTON */}
          <Button
            fullWidth
            disabled={loading}
            sx={{
              mt: 4,
              mb: 2,
              background: "linear-gradient(135deg, #6879e3 0%, #5a6fd6 100%)",
              color: "white",
              fontWeight: "600",
              py: 1.5,
              borderRadius: "8px",
              fontSize: "16px",
              textTransform: "none",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 24px rgba(104, 121, 227, 0.35)",
              "&:hover": {
                boxShadow: "0 12px 32px rgba(104, 121, 227, 0.45)",
                transform: "translateY(-2px)",
                background: "linear-gradient(135deg, #5a6fd6 0%, #4a60cc 100%)",
              },
              "&:disabled": {
                background: "linear-gradient(135deg, #6879e3 0%, #5a6fd6 100%)",
                opacity: 0.7,
              },
            }}
            onClick={handleSignup}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Create Account"
            )}
          </Button>




          {/* DIVIDER */}
          <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
            <Box sx={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            <Typography sx={{ px: 2, color: "#a0aec0", fontSize: "12px" }}>
              Already registered?
            </Typography>
            <Box sx={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
          </Box>




          {/* LOGIN LINK */}
          <Button
            fullWidth
            sx={{
              color: "#6879e3",
              fontWeight: "600",
              py: 1.5,
              borderRadius: "8px",
              fontSize: "16px",
              textTransform: "none",
              background: "#f7fafc",
              border: "2px solid #e2e8f0",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "#edf2f7",
                borderColor: "#6879e3",
              },
            }}
            onClick={() => navigate("/")}
          >
            Sign In
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};




export default Signup;










