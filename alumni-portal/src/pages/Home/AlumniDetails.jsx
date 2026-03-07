import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Button,
  Divider,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import BusinessIcon from "@mui/icons-material/Business";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PhoneIcon from "@mui/icons-material/Phone";
import { default as API_BASE_URL } from "../../api/config";




const AlumniDetails = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();


  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    achievements: '',
    professionalStatus: '',
    academicStatus: '',
  });

  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // fetch alumni details when id changes
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setFetchError(null);
    fetch(`${API_BASE_URL}/alumni/${id}`)
      .then((r) => r.json())
      .then((data) => {
        const row = data && data.data ? data.data : data;
        // normalize field names for the UI
        const norm = {
          ...row,
          name: row.full_name || '',
          batch_year: row.year_of_passout || row.year || row.batchYear || row.batch_year,
          role: row.job_role || row.role,
          location: row.work_location || row.location,
          company: row.company_name || row.company,
          profile_status: row.profile_status || row.status || '',
          other_text: row.other_text || '',
          study_level: row.study_level || '',
          study_level_other: row.study_level_other || '',
          course_name: row.course_name || '',
          institution: row.institution || '',
          institution_location: row.institution_location || '',
          profile_photo: row.profile_photo ? `${API_BASE_URL}/${row.profile_photo}` : row.profile_photo || '',
          phone: row.phone_number || row.phone,
          email: row.email || '',
          linkedin: row.linkedin_profile || row.linkedin,
        };
        setAlumni(norm);
        // initialise formData if you want to allow editing later
        setFormData({
          achievements: norm.achievements || '',
          professionalStatus: norm.profile_status || norm.status || '',
          academicStatus: '',
        });
      })
      .catch((e) => {
        console.error('Failed to fetch alumni details', e);
        setFetchError(e.message || 'Unable to load');
      })
      .finally(() => setLoading(false));
  }, [id]);


  // Scroll to top on component mount and when ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);


  const handleSave = () => {
    setEditMode(false);
    setSnackbar({
      open: true,
      message: 'Profile updated successfully!',
      severity: 'success',
    });
  };


  const handleCancel = () => {
    setFormData({
      achievements: "Received Best Engineer Award 2022, Led AI Research Team",
      professionalStatus: "employed",
      academicStatus: "completed",
    });
    setEditMode(false);
  };


  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', py: 6, textAlign: 'center' }}>
        <Typography sx={{ color: '#fff', fontSize: 18 }}>Loading profile...</Typography>
      </Box>
    );
  }
  if (fetchError) {
    return (
      <Box sx={{ minHeight: '100vh', py: 6, textAlign: 'center' }}>
        <Typography sx={{ color: '#fff', fontSize: 18 }}>Error: {fetchError}</Typography>
      </Box>
    );
  }
  if (!alumni) {
    return null; // nothing to display yet
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 4,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
      }}
    >
      <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, sm: 3 }, textAlign: "left" }}>
        <Paper
          elevation={6}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            backgroundColor: "#fff",
          }}
        >
          {/* HEADER SECTION */}
          <Box
            sx={{
              p: { xs: 3, sm: 4 },
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              display: "flex",
              alignItems: "center",  // vertically center avatar and info
              gap: { xs: 2, sm: 3 },
            }}
          >
            {/* Profile Photo - Left */}
            <Avatar
              src={alumni.profile_photo}
              sx={{
                width: { xs: 120, sm: 160 },
                height: { xs: 120, sm: 160 },
                border: "4px solid #fff",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                flexShrink: 0,
              }}
            />


            {/* Info Section - Right */}
            <Box sx={{ flex: 1, color: "#fff", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: { xs: 2, sm: 3 } }}>
              {/* Left Column - Name & Batch (highlighted) */}
              <Box sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.secondary.main || '#ffeb3b', 0.2),
              }}>
                <Typography
                  variant="h3"
                  fontWeight={800}
                  sx={{ mb: 1, fontSize: { xs: 24, sm: 32 }, lineHeight: 1.2, color: theme.palette.secondary.dark || '#f57f17' }}
                >
                  {alumni.name}
                </Typography>


                <Chip
                  label={`Class of ${alumni.batch_year}`}
                  sx={{
                    backgroundColor: alpha(theme.palette.secondary.dark || '#f57f17', 0.3),
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "12px",
                    border: "1px solid rgba(255,255,255,0.5)",
                    height: 28,
                  }}
                />
              </Box>


              {/* Right Column - Role, Location, Contact Info, Company */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.6, textAlign: "right", flexShrink: 0 }}>
                <Typography
                  fontSize={{ xs: "14px", sm: "15px" }}
                  fontWeight={700}
                  sx={{ letterSpacing: 0.3, lineHeight: 1.3 }}
                >
                  {alumni.role}
                </Typography>

                {/* phone, email and linkedin if present */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.6, alignItems: "flex-end" }}>
                  {alumni.phone && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                      <PhoneIcon sx={{ fontSize: 18, color: '#f8f5f5' }} />
                      <Typography fontSize="14px" sx={{ color: '#f8f5f5', fontWeight: 500, lineHeight: 1.3 }}>
                        {alumni.phone}
                      </Typography>
                    </Box>
                  )}
                  {alumni.email && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                      <EmailIcon sx={{ fontSize: 18, color: '#f8f5f5' }} />
                      <Typography fontSize="14px" sx={{ color: '#f6f0f0', fontWeight: 500, lineHeight: 1.3 }}>
                        {alumni.email}
                      </Typography>
                    </Box>
                  )}
                  {alumni.linkedin && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                      <LinkedInIcon sx={{ fontSize: 18, color: '#f8f5f5' }} />
                      <Typography
                        component="a"
                        href={alumni.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        fontSize="14px"
                        sx={{ color: '#f6f0f0', fontWeight: 500, lineHeight: 1.3, textDecoration: 'underline' }}
                      >
                        LinkedIn
                      </Typography>
                    </Box>
                  )}
                </Box>

               
              </Box>
            </Box>
          </Box>


          {/* CONTENT SECTION */}
          <Box sx={{ p: { xs: 3, sm: 4 } }}>
 <Box
              sx={{
                mb: 3.5,
                pb: 3.5,
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                variant="h5"
                fontWeight={800}
                mb={2.5}
                sx={{
                  color: "#000",
                  fontSize: "17px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 22,
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: "2px",
                  }}
                />
                Status / Details
              </Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <Typography sx={{ color: "#666", fontSize: "14px", lineHeight: 1.5 }}>
                  {alumni.profile_status || '—'}
                  {alumni.other_text ? ` – ${alumni.other_text}` : ''}
                </Typography>
              </Box>
            </Box>


            {/* Academic Background */}
            {alumni.profile_status && alumni.profile_status.toLowerCase().includes('study') && (
            <Box
              sx={{
                mb: 3.5,
                pb: 3.5,
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                variant="h5"
                fontWeight={800}
                mb={2.5}
                sx={{
                  color: "#000",
                  fontSize: "17px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 22,
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: "2px",
                  }}
                />
                Academic Background
              </Typography>



              <Box sx={{ display: "flex", gap: 2, mb: 1.8, alignItems: "flex-start" }}>
                <LocationOnIcon sx={{ color: theme.palette.primary.main, fontSize: 20, mt: 0.2, flexShrink: 0 }} />
                <Box>
                  <Typography sx={{ color: "#000", fontWeight: 600, fontSize: "13px" }}>
                    Department
                  </Typography>
                  <Typography sx={{ color: "#666", fontSize: "14px", mt: 0.2 }}>
                    {alumni.department}
                  </Typography>
                </Box>
              </Box>


              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <SchoolIcon sx={{ color: theme.palette.primary.main, fontSize: 20, mt: 0.2, flexShrink: 0 }} />
                <Box>
                  <Typography sx={{ color: "#000", fontWeight: 600, fontSize: "13px" }}>
                    Graduation
                  </Typography>
                  <Typography sx={{ color: "#666", fontSize: "14px", mt: 0.2 }}>
                    Class of {alumni.batch_year}
                  </Typography>
                </Box>
              </Box>
            </Box>
            )}

            {/* Professional Background (working status) */}
            {alumni.profile_status && alumni.profile_status.toLowerCase().includes('work') && (
              <Box
                sx={{
                  mb: 3.5,
                  pb: 3.5,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight={800}
                  mb={2.5}
                  sx={{
                    color: "#000",
                    fontSize: "17px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 4,
                      height: 22,
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: "2px",
                    }}
                  />
                  Professional Background
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mb: 1.8, alignItems: "flex-start" }}>
                  <BusinessIcon sx={{ color: theme.palette.primary.main, fontSize: 20, mt: 0.2, flexShrink: 0 }} />
                  <Box>
                    <Typography sx={{ color: "#000", fontWeight: 600, fontSize: "13px" }}>
                      Company
                    </Typography>
                    <Typography sx={{ color: "#666", fontSize: "14px", mt: 0.2 }}>
                      {alumni.company}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2, mb: 1.8, alignItems: "flex-start" }}>
                  <PersonIcon sx={{ color: theme.palette.primary.main, fontSize: 20, mt: 0.2, flexShrink: 0 }} />
                  <Box>
                    <Typography sx={{ color: "#000", fontWeight: 600, fontSize: "13px" }}>
                      Role
                    </Typography>
                    <Typography sx={{ color: "#666", fontSize: "14px", mt: 0.2 }}>
                      {alumni.role}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <LocationOnIcon sx={{ color: theme.palette.primary.main, fontSize: 20, mt: 0.2, flexShrink: 0 }} />
                  <Box>
                    <Typography sx={{ color: "#000", fontWeight: 600, fontSize: "13px" }}>
                      Work Location
                    </Typography>
                    <Typography sx={{ color: "#666", fontSize: "14px", mt: 0.2 }}>
                      {alumni.location}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Current Status Section – this is the user’s educational/professional status
                (e.g. “studying”, “employed”, plus any free‑text details).
                It is **not** the account approval flag. */}
           
            {/* Additional info based on status */}
            {alumni.profile_status && alumni.profile_status.toLowerCase().includes('study') && (
              <Box
                sx={{
                  mb: 3.5,
                  pb: 3.5,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight={800}
                  mb={2.5}
                  sx={{
                    color: "#000",
                    fontSize: "17px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 4,
                      height: 22,
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: "2px",
                    }}
                  />
                  Education Details
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                  {alumni.study_level && (
                    <Typography sx={{ color: "#666", fontSize: "14px" }}>
                      <strong>Level:</strong> {alumni.study_level_other || alumni.study_level}
                    </Typography>
                  )}
                  {alumni.course_name && (
                    <Typography sx={{ color: "#666", fontSize: "14px" }}>
                      <strong>Course/Major:</strong> {alumni.course_name}
                    </Typography>
                  )}
                  {alumni.institution && (
                    <Typography sx={{ color: "#666", fontSize: "14px" }}>
                      <strong>Institution:</strong> {alumni.institution}
                    </Typography>
                  )}
                  {alumni.institution_location && (
                    <Typography sx={{ color: "#666", fontSize: "14px" }}>
                      <strong>Location:</strong> {alumni.institution_location}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}

            {/* Achievements Section */}
            <Box
              sx={{
                mb: 3.5,
                pb: 3.5,
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                variant="h5"
                fontWeight={800}
                mb={2.5}
                sx={{
                  color: "#000",
                  fontSize: "17px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 22,
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: "2px",
                  }}
                />
                Achievements
              </Typography>


              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <EmojiEventsIcon sx={{ color: theme.palette.primary.main, fontSize: 20, mt: 0.2, flexShrink: 0 }} />
                <Typography sx={{ color: "#666", fontSize: "14px", lineHeight: 1.5 }}>
                  {alumni.achievements}
                </Typography>
              </Box>
            </Box>

            {alumni.profile_status && alumni.profile_status.toLowerCase().includes('work') && (
              <Box
                sx={{
                  mb: 3.5,
                  pb: 3.5,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight={800}
                  mb={2.5}
                  sx={{
                    color: "#000",
                    fontSize: "17px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 4,
                      height: 22,
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: "2px",
                    }}
                  />
                  Work Details
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                  {alumni.company && (
                    <Typography sx={{ color: "#666", fontSize: "14px" }}>
                      <strong>Company:</strong> {alumni.company}
                    </Typography>
                  )}
                  {alumni.role && (
                    <Typography sx={{ color: "#666", fontSize: "14px" }}>
                      <strong>Role:</strong> {alumni.role}
                    </Typography>
                  )}
                  {alumni.location && (
                    <Typography sx={{ color: "#666", fontSize: "14px" }}>
                      <strong>Work Location:</strong> {alumni.location}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}


          </Box>
        </Paper>


        <Button
          variant="contained"
          sx={{
            mt: 3,
            fontWeight: 600,
            backgroundColor: "#fff",
            color: theme.palette.primary.main,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            "&:hover": {
              boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
              backgroundColor: "#f5f5f5",
            },
          }}
          onClick={() => navigate(-1)}
        >
          ← Back to Alumni Directory
        </Button>
      </Box>
    </Box>
  );
};


export default AlumniDetails;
