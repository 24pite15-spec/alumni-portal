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
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { authAPI } from "../../api/config";




const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // clear fields on mount to avoid stale values
  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  // wipe autofill and disable autocomplete on mount
  useEffect(() => {
    setTimeout(() => {
      const inputs = document.querySelectorAll('input');
      inputs.forEach((el) => {
        el.value = '';
        el.setAttribute('autocomplete', 'new-password');
      });
    }, 50);
  }, []);




  const validate = () => {
    let temp = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;




    if (!email) {
      temp.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      temp.email = "Enter a valid email";
    }




    if (!password) {
      temp.password = "Password is required";
    } else if (password.length < 6) {
      temp.password = "Password must be at least 6 characters";
    }




    setErrors(temp);
    return Object.keys(temp).length === 0;
  };




  const handleLogin = async () => {
    if (!validate()) return;

    let redirectPath = null;
    try {
      setLoading(true);
      setServerError("");

      // clear any stale session
      localStorage.removeItem("user");

      // call the central API helper
      const data = await authAPI.login(email, password);
      console.log('login response', data);

      // success – store complete user info (including name/photo)
      const userData = {
        email: data.email,
        year: data.year,
        role: data.role || "user",
        userId: data.userId,
        isApproved: data.isApproved,
        status: data.status,
        fullName: data.fullName || "",
        profilePhoto: data.profilePhoto || "",
      };
      localStorage.setItem("user", JSON.stringify(userData));

      // decide where to go after login but delay navigation
      // send everyone to the home feed; admins can navigate to dashboard if needed
      redirectPath = "/home";
    } catch (error) {
      console.error("Error:", error);
      setServerError(error.message || "Server error. Try again.");
    } finally {
      // keep spinner visible at least a fraction of a second so it’s noticeable
      if (redirectPath) {
        await new Promise((r) => setTimeout(r, 400));
      }
      setLoading(false);
      if (redirectPath) {
        navigate(redirectPath);
      }
    }
  };








  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
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
          maxWidth: { xs: "100%", sm: "900px" },
          height: "auto",
          minHeight: { xs: "auto", sm: "600px" },
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
            Connect with your Alma Mater community. Share experiences, build networks, and grow together.
          </Typography>
        </Box>




          {/* RIGHT PANEL - FORM */}
          <Box
            sx={{
              width: { xs: "100%", sm: "60%" },
              padding: { xs: "40px 30px", sm: "50px 45px" },
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
              Welcome Back
            </Typography>




            <Typography
              variant="body2"
              sx={{
                mb: 4,
                color: "#718096",
                fontSize: "14px",
              }}
            >
              Sign in to your account to continue
            </Typography>




            {/* EMAIL FIELD */}
            <TextField
              label="Email Address"
              type="email"
              autoComplete="off"
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
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




            {/* PASSWORD FIELD */}
            <TextField
              label="Password"
              type="password"
              autoComplete="new-password"
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: "#cbd5e0", fontSize: "20px" }} />
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




            {/* LOGIN BUTTON */}
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
                position: "relative",
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
              onClick={handleLogin}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Sign In"
              )}
            </Button>


            {serverError && (
              <Typography sx={{ mt: 2, color: '#d32f2f', fontWeight: 700 }}>
                {serverError}
              </Typography>
            )}




            {/* DIVIDER */}
            <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
              <Box sx={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
              <Typography sx={{ px: 2, color: "#a0aec0", fontSize: "12px" }}>
                New user?
              </Typography>
              <Box sx={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            </Box>




            {/* SIGNUP LINK */}
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
              onClick={() => navigate("/signup")}
            >
              Create an Account
            </Button>
          </Box>
        </Paper>
      </Box>
    );
};




export default Login;

















