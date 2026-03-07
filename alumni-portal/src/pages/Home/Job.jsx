import React, { useState } from "react";
import {
  Box,
  Paper,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Button,
  InputAdornment,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CodeIcon from '@mui/icons-material/Code';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';


  const Job = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const inputSx = {
    backgroundColor: '#fff',
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      '& fieldset': { borderColor: '#e6e6e6' },
      '&:hover fieldset': { borderColor: theme.palette.primary.main },
      '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main, borderWidth: 2 },
    },
    '& .MuiOutlinedInput-input': { color: '#000' },
    '& .MuiInputLabel-root': { color: '#000' },
  };
    const [job, setJob] = useState({
    name: "",
    email: "",
    category: "",
    skills: "",
    location: "",
    contact: "",
    description: "",
  });


  const [errors, setErrors] = useState({});


  const validatePhone = (phone) => /^[\d\s\-\+]{10,}$/.test(phone);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateName = (name) => /^[a-zA-Z\s]{2,}$/.test(name.trim());


  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Full name is required';
        if (!validateName(value)) return 'Enter a valid name (letters and spaces only)';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!validateEmail(value)) return 'Enter a valid email address';
        return '';
      case 'category':
        return value.trim() ? '' : 'Job Category is required';
      case 'skills':
        return value.trim() ? '' : 'Skills are required';
      case 'location':
        return value.trim() ? '' : 'Preferred Location is required';
      case 'contact':
        if (!value.trim()) return 'Contact Number is required';
        if (!validatePhone(value)) return 'Enter a valid contact number (min 10 digits)';
        return '';
      case 'description':
        if (!value.trim()) return 'Job Description is required';
        if (value.trim().length < 20) return 'Description must be at least 20 characters';
        return '';
      default:
        return '';
    }
  };


  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setJob({ ...job, [field]: value });
    if (errors[field]) {
      const newError = validateField(field, value);
      setErrors((prev) => ({
        ...prev,
        [field]: newError,
      }));
    }
  };

const handlePost = async () => {
  console.log("POST button clicked");
  const newErrors = {};
  ['name', 'email', 'category', 'skills', 'location', 'contact', 'description'].forEach((f) => {
    const err = validateField(f, job[f]);
    if (err) newErrors[f] = err;
  });

  if (Object.keys(newErrors).length) {
    setErrors(newErrors);
    return;
  }

  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const response = await fetch("http://localhost:5000/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: storedUser?.userId,   // important
        fullName: job.name,
        email: job.email,
        jobCategory: job.category,
        skills: job.skills,
        preferredLocation: job.location,
        contactNumber: job.contact,
        jobDescription: job.description,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    alert("Job posted successfully!");
    navigate("/home");

  } catch (err) {
    console.error("Job post error:", err);
    alert(err.message);
  }
};
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.primary.main,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 750,
          p: 4,
          borderRadius: 3,
          backgroundColor: '#fff',
          color: '#000',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: `0 6px 24px ${theme.palette.mode === 'light' ? 'rgba(15,23,42,0.06)' : 'rgba(0,0,0,0.2)'}`,
        }}
        elevation={6}
      >
        <Typography variant="h5" fontWeight={800} mb={1} sx={{ color: '#0f172a', textTransform: 'uppercase', width: '100%' }}>
        Job Seeker Form
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
          If you're an alumnus looking for a job, fill this form so we can share your requirement with the community.
        </Typography>
        <Grid container direction="column" spacing={2}>
          {/* Name */}
          <Grid item>
            <TextField
              fullWidth
              label="Full Name"
              placeholder="Your full name"
              value={job.name}
              onChange={(e) => {
                setJob((s) => ({ ...s, name: e.target.value }));
                if (errors.name) setErrors((p) => ({ ...p, name: validateField('name', e.target.value) }));
              }}
              sx={inputSx}
              InputProps={{ startAdornment: (<InputAdornment position="start"><PersonOutlineIcon sx={{ color: theme.palette.primary.main }} /></InputAdornment>) }}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>


          {/* Email */}
          <Grid item>
            <TextField
              fullWidth
              label="Email"
              placeholder="you@example.com"
              value={job.email}
              onChange={(e) => {
                setJob((s) => ({ ...s, email: e.target.value }));
                if (errors.email) setErrors((p) => ({ ...p, email: validateField('email', e.target.value) }));
              }}
              sx={inputSx}
              InputProps={{ startAdornment: (<InputAdornment position="start"><EmailOutlinedIcon sx={{ color: theme.palette.primary.main }} /></InputAdornment>) }}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          {/* Job Category */}
          <Grid item>
            <TextField
              select
              fullWidth
              label="Job Category"
              value={job.category}
              onChange={handleChange("category")}
              sx={inputSx}
              error={!!errors.category}
              helperText={errors.category}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <WorkOutlineIcon sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
              SelectProps={{
                MenuProps: { PaperProps: { sx: { backgroundColor: '#fff', color: '#000' } } },
              }}
            >
              <MenuItem value="">Select Category</MenuItem>
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Marketing">Marketing</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>


          {/* Skills */}
          <Grid item>
            <TextField
              fullWidth
              label="Skills"
              placeholder="React, Node, SQL"
              value={job.skills}
              onChange={handleChange("skills")}
              sx={inputSx}
              error={!!errors.skills}
              helperText={errors.skills}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CodeIcon sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>


          {/* Preferred Location */}
          <Grid item>
            <TextField
              fullWidth
              label="Preferred Location"
              placeholder="City, State, Country"
              value={job.location}
              onChange={handleChange("location")}
              error={!!errors.location}
              helperText={errors.location}
              sx={inputSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>


          {/* Contact No */}
          <Grid item>
            <TextField
              fullWidth
              label="Contact No."
              placeholder="9876543210"
              type="tel"
              value={job.contact}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, ""); // remove non-digits
                if (onlyNumbers.length <= 10) {
                  setJob({ ...job, contact: onlyNumbers });


                  const error = validateField("contact", onlyNumbers);
                  setErrors((prev) => ({
                    ...prev,
                    contact: error,
                  }));
                }
              }}
              error={!!errors.contact}
              helperText={errors.contact}
              sx={inputSx}
              inputProps={{ maxLength: 10 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>


          {/* Job Description */}
          <Grid item>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Job Description"
              placeholder="Brief summary of your experience, responsibilities sought, and how to contact you"
              value={job.description}
              onChange={handleChange("description")}
              error={!!errors.description}
              helperText={errors.description}
              sx={{
                ...inputSx,
                '& .MuiOutlinedInput-root': { alignItems: 'flex-start' },
                '& .MuiInputAdornment-root': { alignSelf: 'flex-start', mt: 1 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                    <DescriptionIcon sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
                {/* DEBUG: show validation errors */}


          {/* POST BUTTON */}
          <Grid item textAlign="center">
            <Button
              variant="contained"
              size="large"
              disabled={
  !(
    job.name &&
    job.email &&
    job.category &&
    job.skills &&
    job.location &&job.contact &&
    job.description
  ) || Object.values(errors).some(Boolean)
}
sx={{
                px: 6,
                py: 1.4,
                fontWeight: 800,
                fontSize: 16,
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
                '&:hover': { backgroundColor: theme.palette.primary.dark },
                '&:disabled': { backgroundColor: '#ccc', cursor: 'not-allowed', color: '#999' },
              }}
              onClick={handlePost}
            >
              POST
            </Button>
          </Grid>
        </Grid>


      </Paper>
    </Box>
  );
};


export default Job;



