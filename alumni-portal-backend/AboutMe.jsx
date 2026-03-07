import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Snackbar,
  Alert,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import LockIcon from '@mui/icons-material/Lock';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useNavigate } from "react-router-dom";

const AboutMe = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    linkedinProfile: "",
    batchYear: "",
    profilePhoto: null,
    currentAddress: "",
    status: "studying",
    companyName: "",
    jobRole: "",
    workLocation: "",
    studyLevel: "",
    studyLevelOther: "",
    courseName: "",
    institution: "",
    institutionLocation: "",
    otherText: "",
    preferNotToSay: false,
    achievements: "",
  });

  // on mount we verify login/approval and prefill required fields
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    // if there's no user or not a normal approved alumni, redirect
    if (!storedUser) {
      navigate("/");
      return;
    }
    if (storedUser.role && storedUser.role !== "user") {
      // admins should be sent to admin area
      if (storedUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
      return;
    }
    if (storedUser.status && storedUser.status.toUpperCase() !== "APPROVED") {
      // only approved alumni may access profile page
      navigate("/");
      return;
    }

    // fill in immutable fields from login data
    setForm(prev => ({
      ...prev,
      email: storedUser.email || "",
      batchYear: storedUser.year || prev.batchYear,
    }));

    // fetch any saved profile details from server so that user can edit them
    if (storedUser.email) {
      fetch(`http://localhost:5000/profile/${storedUser.email}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            setForm(prev => ({
              ...prev,
              ...data,
              profilePhoto: data.profilePhoto || prev.profilePhoto,
            }));
            // if the backend returned any meaningful fields (eg. fullName)
            // we assume the profile has been completed once and switch out
            // of edit mode so the user sees the read-only view on future logins
            if (data.fullName || data.phone || data.linkedinProfile) {
              setIsEditMode(false);
            }
          }
        })
        .catch(err => console.error("Error fetching profile:", err));
    }
  }, [navigate]);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [snack, setSnack] = useState({ open: false, severity: "success", message: "" });
  const [isEditMode, setIsEditMode] = useState(true);

  const currentYear = new Date().getFullYear();
  const yearsArray = Array.from({ length: 60 }, (_, i) => currentYear - i);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /^[0-9]{0,10}$/;
    return regex.test(phone);
  };

  const validateFullName = (name) => {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(name);
  };

  const validateDOB = (dob) => {
    if (!dob) return false;
    
    const dobDate = new Date(dob);
    const today = new Date();
    
    // Check if valid date
    if (isNaN(dobDate.getTime())) return false;
    
    // Check if DOB is in the future
    if (dobDate > today) return false;
    
    // Check if year is before 1900
    if (dobDate.getFullYear() < 1900) return false;
    
    // Calculate age
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDifference = today.getMonth() - dobDate.getMonth();
    const dateDifference = today.getDate() - dobDate.getDate();
    
    if (monthDifference < 0 || (monthDifference === 0 && dateDifference < 0)) {
      age--;
    }
    
    // Check if at least 16 years old
    if (age < 16) return false;
    
    return true;
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#fff',
      color: '#000',
      borderRadius: 1.5,
      '& fieldset': { borderColor: '#ddd' },
      '&:hover fieldset': { borderColor: theme.palette.primary.main },
      '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main, borderWidth: 2 },
    },
    '& .MuiOutlinedInput-input': { color: '#000', fontWeight: 500 },
    '& .MuiInputLabel-root': { color: '#666' },
    '& .MuiSelect-select': { color: '#000' },
  };

  const sectionTitleSx = {
    fontSize: { xs: '16px', md: '18px' },
    fontWeight: 800,
    color: "black",
    mb: 3,
    pb: 1.5,
    borderBottom: `3px solid ${theme.palette.primary.main}`,
    display: 'inline-block',
  };

  const handleField = (key) => (e) => {
    const value = e?.target ? e.target.value : e;
    
    if (key === 'phone') {
      if (value && !validatePhone(value)) return;
    }
    
    setForm((s) => ({ ...s, [key]: value }));
    if (errors[key]) {
      setErrors((err) => ({ ...err, [key]: '' }));
    }
  };
const handleFile = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const preview = URL.createObjectURL(file);
  setForm((s) => ({ ...s, profilePhoto: { file, preview } }));
};
  const validatePersonalInfo = () => {
    const err = {};
    if (!form.fullName.trim()) err.fullName = "Full Name is required";
    else if (!validateFullName(form.fullName.trim())) err.fullName = "Full Name cannot contain digits";
    if (!form.email.trim()) err.email = "Email is required";
    else if (!validateEmail(form.email)) err.email = "Enter a valid email address";
    if (!form.phone.trim()) err.phone = "Phone Number is required";
    else if (form.phone.length !== 10) err.phone = "Phone must be exactly 10 digits";
    // dob is optional; only validate if provided
    if (form.dob && !validateDOB(form.dob)) {
      err.dob = "Invalid DOB. Must be a valid date, before today, at least 16 years old, and after 1900";
    }
    if (!form.batchYear) err.batchYear = "Batch Year is required";
    return err;
  };

  const validate = () => {
    const err = { ...validatePersonalInfo() };

    if (form.status === "working") {
      if (!form.companyName.trim()) err.companyName = "Company Name is required";
      if (!form.jobRole.trim()) err.jobRole = "Job Role is required";
      if (!form.workLocation.trim()) err.workLocation = "Work Location is required";
    }

    if (form.status === "studying") {
      if (!form.studyLevel) err.studyLevel = "Study Level is required";
      else if (form.studyLevel === "Other" && !form.studyLevelOther.trim()) {
        err.studyLevelOther = "Please specify your level of study";
      }
      if (!form.courseName.trim()) err.courseName = "Course Name is required";
      if (!form.institution.trim()) err.institution = "Institution is required";
      if (!form.institutionLocation.trim()) err.institutionLocation = "Institution Location is required";
    }

    if (form.status === "other") {
      if (!form.preferNotToSay && !form.otherText.trim()) {
        err.otherText = "Please specify or check 'Prefer not to say'";
      }
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };
const handleSave = async () => {
  if (!validate()) {
    setSnack({ open: true, severity: "error", message: "Please fix all validation errors" });
    return;
  }

  // ✅ Get logged in user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const loggedInEmail = storedUser?.email;

  if (!loggedInEmail) {
    setSnack({ open: true, severity: "error", message: "User not logged in" });
    return;
  }

  try {
    // 1️⃣ Upload photo (if selected)
    let newPhotoPath = null;
    if (form.profilePhoto?.file) {
      const photoFormData = new FormData();
      photoFormData.append("photo", form.profilePhoto.file);
      photoFormData.append("email", loggedInEmail); // send email to backend

      const photoResponse = await fetch("http://localhost:5000/profile/upload-photo", {
        method: "POST",
        body: photoFormData,
      });

      if (!photoResponse.ok) {
        const errorData = await photoResponse.json();
        setSnack({
          open: true,
          severity: "error",
          message: errorData.message || "Photo upload failed",
        });
        return;
      }

      const photoData = await photoResponse.json();
      newPhotoPath = photoData.photoPath; // store for later
    }

    // 2️⃣ Save profile data
    // Exclude `email` and `batchYear` from the form payload so backend uses the logged-in email/year
    const { profilePhoto, email: _email, batchYear: _batchYear, ...formDataToSend } = form;

    const response = await fetch("http://localhost:5000/profile/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formDataToSend,
        email: loggedInEmail, // ✅ always use logged in email
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setSnack({ open: true, severity: "success", message: data.message });

      // 🔄 Refresh profile from backend
      const updatedProfile = await fetch(
        `http://localhost:5000/profile/${loggedInEmail}`
      );

      const updatedData = await updatedProfile.json();
      setForm(prev => ({
        ...prev,
        ...updatedData,
        profilePhoto: updatedData.profilePhoto || prev.profilePhoto
      }));

      // update localStorage so NavBar can show the new photo/name
      const stored = JSON.parse(localStorage.getItem('user')) || {};
      const newStored = {
        ...stored,
        fullName: updatedData.fullName || stored.fullName,
        profilePhoto: newPhotoPath || updatedData.profilePhoto || stored.profilePhoto,
      };
      localStorage.setItem('user', JSON.stringify(newStored));
      // also invoke helper if exposed
      if (window.updateLocalUser) {
        window.updateLocalUser({
          fullName: newStored.fullName,
          profilePhoto: newStored.profilePhoto,
        });
      }

      setIsEditMode(false);
    } else {
      setSnack({ open: true, severity: "error", message: data.message });
    }

  } catch (error) {
    console.error("Error saving profile:", error);
    setSnack({ open: true, severity: "error", message: "Server error: " + error.message });
  }
};  const handlePasswordChange = () => {
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      setSnack({ open: true, severity: "error", message: "All password fields are required" });
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setSnack({ open: true, severity: "error", message: "New passwords do not match" });
      return;
    }
    if (passwords.next.length < 6) {
      setSnack({ open: true, severity: "error", message: "New password must be at least 6 characters" });
      return;
    }

    setPasswords({ current: "", next: "", confirm: "" });
    setOpenPasswordDialog(false);
    setSnack({ open: true, severity: "success", message: "✓ Password updated successfully!" });
  };

  const resetForm = () => {
    setForm({
      fullName: "",
      email: "",
      phone: "",
      dob: "",
      linkedinProfile: "",
      batchYear: "",
      profilePhoto: null,
      currentAddress: "",
      status: "studying",
      companyName: "",
      jobRole: "",
      workLocation: "",
      studyLevel: "",
      studyLevelOther: "",
      courseName: "",
      institution: "",
      institutionLocation: "",
      otherText: "",
      preferNotToSay: false,
      achievements: "",
    });
    setErrors({});
  };

  return (
    <Box sx={{ minHeight: "100vh", py: { xs: 3, md: 6 }, backgroundColor: '#7389ec' }}>
      <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 2, md: 3 } }}>
        {/* PAGE HEADER */}
        <Box mb={5}>
          <Typography variant="h4" fontWeight={800} mb={1} sx={{ color: theme.palette.text.primary, fontSize: { xs: '24px', md: '32px' } }}>
            {isEditMode ? "Complete Your Profile" : "Your Profile"}
          </Typography>
          <Typography variant="body1" sx={{ color: '#faf7f7', fontSize: '15px', fontWeight: 500, maxWidth: 600 }}>
            {isEditMode ? "Help us know you better by completing all sections below. This information helps build a stronger alumni community." : "Your profile has been saved successfully. Review your information or click Edit to make changes."}
          </Typography>
        </Box>

        {/* VIEW MODE - Profile Display */}
        {!isEditMode && (
          <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, backgroundColor: "#fff", border: '1px solid #e8eaf6', mb: 4 }}>
            {/* Profile Header with Photo */}
            <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start', mb: 5, pb: 4, borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
              <Box>
                {form.profilePhoto ? (
  <Avatar
    src={
      typeof form.profilePhoto === "object"
        ? form.profilePhoto.preview
        : `http://localhost:5000/${form.profilePhoto}`
    }
    sx={{ width: 130, height: 130 }}
  />
) : (
  <Avatar
    sx={{
      width: 120,
      height: 120,
      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.6)} 100%)`,
      fontSize: "48px",
    }}
  >
    {form.fullName?.charAt(0)?.toUpperCase()}
  </Avatar>
)}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={800} sx={{ fontSize: '28px', color: '#0f172a', mb: 1 }}>
                  {form.fullName || 'Your Name'}
                </Typography>
                <Typography sx={{ color: '#666', fontSize: '15px', mb: 2 }}>Batch: {form.batchYear || 'Not specified'}</Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsEditMode(true)}
                    sx={{
                      fontWeight: 700,
                      px: 3,
                      py: 1.2,
                      textTransform: 'none',
                      borderRadius: 1.5,
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: `0 6px 18px ${alpha(theme.palette.primary.main, 0.4)}`,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    ✏️ Edit Profile
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/home")}
                    sx={{
                      fontWeight: 700,
                      px: 3,
                      py: 1.2,
                      textTransform: 'none',
                      borderRadius: 1.5,
                      color: theme.palette.primary.main,
                      borderColor: theme.palette.primary.main,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                  >
                    ← Back to Home
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Profile Details Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
              {/* Personal Info */}
              <Box>
                <Typography fontWeight={800} sx={{ fontSize: '16px', color: '#0f172a', mb: 2.5, pb: 1.5, borderBottom: `2px solid ${theme.palette.primary.main}` }}>👤 Personal Information</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Box>
                    <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>Full Name</Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{form.fullName || '—'}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>Email</Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{form.email || '—'}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>Phone</Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{form.phone || '—'}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>Date of Birth</Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{form.dob ? new Date(form.dob).toLocaleDateString() : '—'}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>LinkedIn Profile</Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: theme.palette.primary.main }}>
                      {form.linkedinProfile ? <a href={form.linkedinProfile} target="_blank" rel="noopener noreferrer" style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>View Profile</a> : '—'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Additional Info */}
              <Box>
                <Typography fontWeight={800} sx={{ fontSize: '16px', color: '#0f172a', mb: 2.5, pb: 1.5, borderBottom: `2px solid ${theme.palette.primary.main}` }}>📋 Additional Information</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Box>
                    <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>Batch Year</Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{form.batchYear || '—'}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>Current Address</Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', whiteSpace: 'pre-wrap' }}>{form.currentAddress || '—'}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>Status</Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', textTransform: 'capitalize' }}>{form.status || '—'}</Typography>
                  </Box>
                  {form.achievements && (
                    <Box>
                      <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>🏆 Achievements</Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', whiteSpace: 'pre-wrap' }}>{form.achievements}</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Paper>
        )}

        {/* EDIT MODE - Form */}
        {isEditMode && (
          <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, backgroundColor: "#fff", border: '1px solid #e8eaf6' }}>
          
          {/* ===== PERSONAL INFORMATION SECTION ===== */}
<Box mb={5}>
  <Typography sx={sectionTitleSx}>
    👤 Personal Information
  </Typography>

  <Box sx={{ display: "flex", gap: 5, alignItems: "flex-start" }}>
    {/* Left Side: 2-Column Form Fields (3 Rows) */}
    <Box sx={{ flex: 1 }}>
      <Grid container spacing={3} columnSpacing={3.5}>
          {/* Row 1: Full Name & DOB */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={handleField("fullName")}
              error={!!errors.fullName}
              helperText={errors.fullName}
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              value={form.dob}
              onChange={handleField("dob")}
              error={!!errors.dob}
              helperText={errors.dob}
              sx={fieldSx}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Row 2: Email & Phone Number */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email Address"
              placeholder="your.email@example.com"
              value={form.email}
              disabled
              onChange={handleField("email")}
              error={!!errors.email}
              helperText={errors.email}
              sx={{
                ...fieldSx,
                '& .MuiOutlinedInput-root.Mui-disabled': {
                  backgroundColor: '#f9f9f9',
                },
                '& .MuiOutlinedInput-input.Mui-disabled': {
                  color: '#1a1a1a !important',
                  WebkitTextFillColor: '#1a1a1a !important',
                  opacity: 1,
                },
                '& .MuiInputLabel-root.Mui-disabled': {
                  color: '#666 !important',
                  opacity: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              placeholder="10-digit number"
              value={form.phone}
              onChange={handleField("phone")}
              error={!!errors.phone}
              helperText={errors.phone}
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Row 3: LinkedIn Profile (Full Width) */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="LinkedIn Profile URL"
              placeholder="https://www.linkedin.com/in/yourprofile"
              value={form.linkedinProfile}
              onChange={handleField("linkedinProfile")}
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Row 4: Batch Year & Current Address */}
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              select
              fullWidth
              label="Batch Year"
              value={form.batchYear || ""}
              disabled
              displayEmpty
              onChange={handleField("batchYear")}
              error={!!errors.batchYear}
              helperText={errors.batchYear}
              sx={{
                ...fieldSx,
                '& .MuiOutlinedInput-root.Mui-disabled': {
                  backgroundColor: '#f9f9f9',
                },
                '& .MuiOutlinedInput-input.Mui-disabled': {
                  color: '#1a1a1a !important',
                  WebkitTextFillColor: '#1a1a1a !important',
                  opacity: 1,
                },
                '& .MuiSelect-select.Mui-disabled': {
                  color: '#1a1a1a !important',
                  backgroundColor: '#f9f9f9 !important',
                },
                '& .MuiInputLabel-root.Mui-disabled': {
                  color: '#666 !important',
                  opacity: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SchoolIcon sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">Select Year</MenuItem>
              {yearsArray.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={6} sx={{ height: '80%', width: '100%' }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Current Address"
              placeholder="Enter your current address"
              value={form.currentAddress}
              onChange={handleField("currentAddress")}
              sx={{
                ...fieldSx,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fff',
                  color: '#000',
                  borderRadius: 1.5,
                  alignItems: 'flex-start',
                  '& fieldset': { borderColor: '#ddd', borderWidth: 1 },
                  '&:hover fieldset': { borderColor: theme.palette.primary.main },
                  '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main, borderWidth: 2 },
                },
                '& .MuiInputAdornment-root': { alignSelf: 'flex-start', mt: 1.25 },
                '& .MuiOutlinedInput-input': { paddingTop: '10px', paddingBottom: '10px', color: '#000' },
                '& .MuiInputBase-input::placeholder': { color: '#000', opacity: 0.7 },
                '& .MuiInputLabel-root': { color: '#000' },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                    <HomeIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Right Side: Profile Photo (3rd Column, Fixed Width) */}
      <Box
        sx={{
          width: 180,
          flexShrink: 0,
          border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          borderRadius: 2.5,
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: alpha(theme.palette.primary.main, 0.02),
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.12)}`,
            borderColor: alpha(theme.palette.primary.main, 0.3),
          },
          minHeight: 280,
        }}
      >
        {form.profilePhoto ? (
  <Avatar
    src={
      typeof form.profilePhoto === "object"
        ? form.profilePhoto.preview
        : `http://localhost:5000/${form.profilePhoto}`
    }
    sx={{ 
      width: 130, 
      height: 130, 
      mb: 2,
      border: `3px solid ${theme.palette.primary.main}`,
    }}
  />
) : (
  <PhotoCameraIcon sx={{ fontSize: 56, color: alpha(theme.palette.primary.main, 0.3), mb: 2 }} />
)}
        {!form.profilePhoto ? (
          <Button 
            variant="contained" 
            component="label" 
            size="small" 
            fullWidth
            sx={{
              fontWeight: 600,
              fontSize: '13px',
              textTransform: 'none',
              py: 1.2,
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.9),
              },
            }}
          >
            Upload Photo
            <input hidden accept="image/*" type="file" onChange={handleFile} />
          </Button>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, width: '100%' }}>
            <Button
              variant="contained"
              component="label"
              size="small"
              fullWidth
              sx={{
                fontWeight: 600,
                fontSize: '13px',
                textTransform: 'none',
                py: 1.2,
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.9),
                },
              }}
            >
              Change Photo
              <input hidden accept="image/*" type="file" onChange={handleFile} />
            </Button>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              sx={{
                fontWeight: 600,
                fontSize: '13px',
                textTransform: 'none',
                py: 1.2,
                color: '#dc3545',
                borderColor: '#dc3545',
                '&:hover': {
                  borderColor: '#dc3545',
                  backgroundColor: 'rgba(220, 53, 69, 0.04)',
                },
              }}
              onClick={() => setForm((s) => ({ ...s, profilePhoto: null }))}
            >
              Remove
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  </Box>

        <Box>
          <Typography sx={sectionTitleSx}>
            🎓 Professional / Academic Status
          </Typography>

          {/* Status Selection Card */}
          <Paper
            elevation={0}
            sx={{
              mb: 5,
              p: { xs: 3.5, sm: 4.5 },
              backgroundColor: '#fff',
              border: `1.5px solid ${alpha(theme.palette.primary.main, 0.12)}`,
              borderRadius: 3,
              boxShadow: `0 1px 3px ${alpha('#000', 0.05)}`,
              transition: 'all 0.3s ease',
            }}
          >
            <Typography
              fontWeight={700}
              mb={3.5}
              sx={{
                color: '#0f172a',
                fontSize: { xs: '12px', sm: '13px' },
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontFamily: '"Segoe UI", "Roboto", sans-serif',
              }}
            >
              Select Your Current Status
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                gap: { xs: 2.5, sm: 3 },
              }}
            >
              {[
                { value: 'studying', label: 'Studying', icon: '📚', desc: 'Currently pursuing education' },
                { value: 'working', label: 'Working', icon: '🏢', desc: 'Employed professionally' },
                { value: 'other', label: 'Others', icon: 'ℹ️', desc: 'Other situation' },
              ].map((option) => (
                <Box
                  key={option.value}
                  onClick={() => setForm((s) => ({ ...s, status: option.value }))}
                  sx={{
                    p: 2.5,
                    borderRadius: 2.5,
                    border: `2px solid ${form.status === option.value ? theme.palette.primary.main : alpha('#ddd', 0.7)}`,
                    backgroundColor:
                      form.status === option.value
                        ? alpha(theme.palette.primary.main, 0.05)
                        : '#fff',
                    transition: 'all 0.25s ease',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: alpha(theme.palette.primary.main, 0.03),
                    },
                  }}
                >
                  <Box sx={{ fontSize: '20px', mt: 0.3 }}>{option.icon}</Box>
                  <Box>
                    <Typography
                      fontWeight={700}
                      sx={{
                        color: '#1a1a1a',
                        fontSize: '14px',
                        mb: 0.3,
                      }}
                    >
                      {option.label}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#999',
                        fontSize: '11px',
                        fontWeight: 500,
                      }}
                    >
                      {option.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* STUDYING Status Section */}
          {form.status === "studying" && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3.5, sm: 5 },
                mb: 5,
                backgroundColor: '#fff',
                border: `1.5px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                borderRadius: 3,
                boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.08)}`,
                animation: 'fadeInUp 0.35s ease',
                '@keyframes fadeInUp': {
                  from: { opacity: 0, transform: 'translateY(12px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 4.5 }}>
                <Box sx={{ fontSize: '26px' }}>📚</Box>
                <Box>
                  <Typography
                    fontWeight={800}
                    sx={{
                      color: '#0f172a',
                      fontSize: '16px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.7px',
                      mb: 0.2,
                    }}
                  >
                    Educational Details
                  </Typography>
                  <Typography
                    sx={{
                      color: '#666',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                  >
                    Complete your academic information
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3.5, columnGap: 4 }}>
                <TextField
                  select
                  fullWidth
                  label="Level of Study"
                  value={form.studyLevel}
                  onChange={handleField("studyLevel")}
                  error={!!errors.studyLevel}
                  helperText={errors.studyLevel}
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SchoolIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="">Select Level</MenuItem>
                  <MenuItem value="UG">Undergraduate (UG)</MenuItem>
                  <MenuItem value="PG">Postgraduate (PG)</MenuItem>
                  <MenuItem value="MPhil">M.Phil</MenuItem>
                  <MenuItem value="PhD">Ph.D</MenuItem>
                  <MenuItem value="Diploma">Diploma</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>

                {form.studyLevel === "Other" && (
                  <TextField
                    fullWidth
                    label="Specify Your Level"
                    placeholder="e.g., Associate, Certificate"
                    value={form.studyLevelOther}
                    onChange={(e) => setForm((s) => ({ ...s, studyLevelOther: e.target.value }))}
                    error={!!errors.studyLevelOther}
                    helperText={errors.studyLevelOther}
                    sx={fieldSx}
                  />
                )}

                <TextField
                  fullWidth
                  label="Course or Major"
                  placeholder="Computer Science, Commerce, Engineering..."
                  value={form.courseName}
                  onChange={handleField("courseName")}
                  error={!!errors.courseName}
                  helperText={errors.courseName}
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MenuBookIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Institution Name"
                  placeholder="University or College name"
                  value={form.institution}
                  onChange={handleField("institution")}
                  error={!!errors.institution}
                  helperText={errors.institution}
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Institution Location"
                  placeholder="City, State, Country"
                  value={form.institutionLocation}
                  onChange={handleField("institutionLocation")}
                  error={!!errors.institutionLocation}
                  helperText={errors.institutionLocation}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ ...fieldSx, gridColumn: { xs: 'auto', sm: '1 / -1' } }}
                />
              </Box>
            </Paper>
          )}

          {/* WORKING Status Section */}
          {form.status === "working" && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3.5, sm: 5 },
                mb: 5,
                backgroundColor: '#fff',
                border: `1.5px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                borderRadius: 3,
                boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.08)}`,
                animation: 'fadeInUp 0.35s ease',
                '@keyframes fadeInUp': {
                  from: { opacity: 0, transform: 'translateY(12px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 4.5 }}>
                <Box sx={{ fontSize: '26px' }}>🏢</Box>
                <Box>
                  <Typography
                    fontWeight={800}
                    sx={{
                      color: '#0f172a',
                      fontSize: '16px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.7px',
                      mb: 0.2,
                    }}
                  >
                    Professional Information
                  </Typography>
                  <Typography
                    sx={{
                      color: '#666',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                  >
                    Share your work experience details
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 3.5, columnGap: 4 }}>
                <TextField
                  fullWidth
                  label="Company Name"
                  placeholder="e.g., Acme Corporation"
                  value={form.companyName}
                  onChange={handleField("companyName")}
                  error={!!errors.companyName}
                  helperText={errors.companyName}
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Job Title"
                  placeholder="Senior Developer, Manager..."
                  value={form.jobRole}
                  onChange={handleField("jobRole")}
                  error={!!errors.jobRole}
                  helperText={errors.jobRole}
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WorkIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Work Location"
                  placeholder="City, State, Country"
                  value={form.workLocation}
                  onChange={handleField("workLocation")}
                  error={!!errors.workLocation}
                  helperText={errors.workLocation}
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Paper>
          )}

          {/* OTHERS Status Section */}
          {form.status === "other" && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3.5, sm: 5 },
                mb: 5,
                backgroundColor: '#fffbf0',
                border: `1.5px solid ${alpha('#FF9800', 0.18)}`,
                borderRadius: 3,
                boxShadow: `0 4px 16px ${alpha('#FF9800', 0.08)}`,
                animation: 'fadeInUp 0.35s ease',
                '@keyframes fadeInUp': {
                  from: { opacity: 0, transform: 'translateY(12px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 4.5 }}>
                <Box sx={{ fontSize: '26px' }}>ℹ️</Box>
                <Box>
                  <Typography
                    fontWeight={800}
                    sx={{
                      color: '#D97706',
                      fontSize: '16px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.7px',
                      mb: 0.2,
                    }}
                  >
                    Current Situation
                  </Typography>
                  <Typography
                    sx={{
                      color: '#666',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                  >
                    Tell us about your current state
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 200px' }, gap: 3.5, columnGap: 4, alignItems: 'start' }}>
                <TextField
                  fullWidth
                  label="Describe Your Situation"
                  placeholder="What are you currently doing?"
                  multiline
                  minRows={4}
                  value={form.otherText}
                  onChange={handleField("otherText")}
                  error={!!errors.otherText && !form.preferNotToSay}
                  helperText={errors.otherText && !form.preferNotToSay ? errors.otherText : ""}
                  disabled={form.preferNotToSay}
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                        <InfoIcon sx={{ color: '#FF9800', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <Box
                  sx={{
                    p: 3,
                    backgroundColor: '#fff',
                    borderRadius: 2.5,
                    border: `1.5px solid ${alpha('#FF9800', 0.15)}`,
                    boxShadow: `0 2px 8px ${alpha('#FF9800', 0.06)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 130,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={form.preferNotToSay}
                        onChange={(e) => setForm((s) => ({ ...s, preferNotToSay: e.target.checked }))}
                        sx={{
                          color: '#FF9800',
                          '&.Mui-checked': { color: '#FF9800' },
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography
                          fontWeight={700}
                          sx={{
                            color: '#1a1a1a',
                            fontSize: '13px',
                            mb: 0.3,
                          }}
                        >
                          Skip
                        </Typography>
                        <Typography
                          sx={{
                            color: '#999',
                            fontSize: '11px',
                            fontWeight: 500,
                          }}
                        >
                          Don't fill this
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              </Box>
            </Paper>
          )}
        </Box>

          {/* ===== ACHIEVEMENTS SECTION ===== */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3.5, sm: 5 },
              mb: 5,
              backgroundColor: '#f0f4ff',
              border: `1.5px solid ${alpha(theme.palette.primary.main, 0.15)}`,
              borderRadius: 3,
              boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.08)}`,
              animation: 'fadeInUp 0.35s ease',
              '@keyframes fadeInUp': {
                from: { opacity: 0, transform: 'translateY(12px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 4.5 }}>
              <Box sx={{ fontSize: '26px' }}>🏆</Box>
              <Box>
                <Typography
                  fontWeight={800}
                  sx={{
                    color: '#0f172a',
                    fontSize: '16px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.7px',
                    mb: 0.2,
                  }}
                >
                  Achievements
                </Typography>
                <Typography
                  sx={{
                    color: '#666',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  Share your accomplishments and professional achievements
                </Typography>
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Achievements"
              placeholder="Share your accomplishments, awards, certifications..."
              multiline
              rows={4}
              value={form.achievements}
              onChange={handleField("achievements")}
              sx={{
                ...fieldSx,
                '& .MuiOutlinedInput-root': { alignItems: 'flex-start' },
                '& .MuiInputAdornment-root': { alignSelf: 'flex-start', mt: 1.25 },
                '& .MuiOutlinedInput-input': { paddingTop: '10px', paddingBottom: '10px', color: '#000' },
                '& .MuiInputBase-input::placeholder': { color: '#000', opacity: 0.7 },
                '& .MuiInputLabel-root': { color: '#000' },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                    <EmojiEventsIcon sx={{ color: theme.palette.primary.main, fontSize: 22 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Paper>

          <Divider sx={{ my: 5, borderColor: alpha(theme.palette.primary.main, 0.1) }} />

          {/* ===== ACTION BUTTONS ===== */}
          <Box display="flex" gap={3} flexWrap="wrap" justifyContent="space-between" alignItems="center">
            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{
                  fontWeight: 700,
                  px: 4,
                  py: 1.3,
                  fontSize: '15px',
                  textTransform: 'none',
                  borderRadius: 1.5,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: `0 6px 18px ${alpha(theme.palette.primary.main, 0.4)}`,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                💾 Save Profile
              </Button>
              <Button
                variant="outlined"
                onClick={resetForm}
                sx={{
                  fontWeight: 600,
                  px: 4,
                  py: 1.3,
                  fontSize: '15px',
                  textTransform: 'none',
                  borderRadius: 1.5,
                  borderColor: '#ddd',
                  color: '#1a1a1a',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                🔄 Clear Form
              </Button>
            </Box>
            <Button
              variant="text"
              onClick={() => setOpenPasswordDialog(true)}
              sx={{
                fontWeight: 600,
                fontSize: '15px',
                textTransform: 'none',
                color: theme.palette.primary.main,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  textDecoration: 'underline',
                },
              }}
            >
              🔐 Change Password
            </Button>
          </Box>
        </Paper>
        )}
      </Box>

      {/* ===== CHANGE PASSWORD MODAL DIALOG ===== */}
      <Dialog
        open={openPasswordDialog}
        onClose={() => {
          setOpenPasswordDialog(false);
          setPasswords({ current: "", next: "", confirm: "" });
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            backgroundImage: 'none',
            backgroundColor: '#fff',
            border: `1.5px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            boxShadow: `0 12px 48px ${alpha(theme.palette.primary.main, 0.12)}`,
            overflow: 'visible',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            fontSize: { xs: '18px', sm: '20px' },
            color: '#0f172a',
            pb: 1,
            pt: 4,
            px: 4,
            textTransform: 'uppercase',
            letterSpacing: '0.7px',
            borderBottom: `2px solid ${theme.palette.primary.main}`,
          }}
        >
          🔐 Update Your Password
        </DialogTitle>

        <DialogContent sx={{ pt: 4, px: 4, pb: 0 }}>
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              mb: 4,
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: 1.6,
            }}
          >
            Keep your account secure by using a strong password. Enter your current password and choose a new one below.
          </Typography>

          <Box display="flex" flexDirection="column" gap={3.5}>
            <Box>
              <Typography
                sx={{
                  color: '#0f172a',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  mb: 1.5,
                }}
              >
                Current Password
              </Typography>
              <TextField
                fullWidth
                type="password"
                placeholder="Enter your current password"
                value={passwords.current}
                onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  color: '#0f172a',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  mb: 1.5,
                }}
              >
                New Password
              </Typography>
              <TextField
                fullWidth
                type="password"
                placeholder="Create a new password (min. 6 characters)"
                value={passwords.next}
                onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  color: '#0f172a',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  mb: 1.5,
                }}
              >
                Confirm New Password
              </Typography>
              <TextField
                fullWidth
                type="password"
                placeholder="Re-enter your new password"
                value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 4,
            gap: 2,
            justifyContent: 'flex-end',
            borderTop: `1.5px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            mt: 2,
          }}
        >
          <Button
            onClick={() => {
              setOpenPasswordDialog(false);
              setPasswords({ current: "", next: "", confirm: "" });
            }}
            variant="outlined"
            sx={{
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '14px',
              borderColor: alpha('#000', 0.15),
              color: '#1a1a1a',
              py: 1.2,
              px: 3.5,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              border: `1.5px solid ${alpha('#000', 0.12)}`,
              '&:hover': {
                borderColor: alpha('#000', 0.25),
                backgroundColor: alpha('#000', 0.02),
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePasswordChange}
            variant="contained"
            color="primary"
            sx={{
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '14px',
              px: 4,
              py: 1.2,
              borderRadius: 2,
              boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.35)}`,
              transition: 'all 0.3s ease',
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.45)}`,
                transform: 'translateY(-1px)',
              },
            }}
          >
            Update Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== SNACKBAR NOTIFICATIONS ===== */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          icon={snack.severity === 'success' ? <CheckCircleIcon /> : undefined}
          sx={{
            fontWeight: 600,
            fontSize: '14px',
            backgroundColor: snack.severity === 'success' ? '#4CAF50' : '#f44336',
            color: '#fff',
            borderRadius: 1.5,
            boxShadow: `0 6px 16px ${alpha(snack.severity === 'success' ? '#4CAF50' : '#f44336', 0.3)}`,
          }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AboutMe;
