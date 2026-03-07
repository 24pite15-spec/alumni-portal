import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Avatar,
  Button,
  Grid,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Popover,
  Divider,
  Chip,
  Fade,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import WorkIcon from "@mui/icons-material/Work";
import DateRangeIcon from "@mui/icons-material/DateRange";

// default batch list used before backend response arrives
const defaultBatches = [
  { year: 2025, count: 50 },
  { year: 2024, count: 15 },
  { year: 2023, count: 15 },
  { year: 2022, count: 14 },
  { year: 2021, count: 45 },
  { year: 2020, count: 90 },
  { year: 2019, count: 100 },
  { year: 2018, count: 130 },
  { year: 2017, count: 130 },
  { year: 2016, count: 90 },
  { year: 2015, count: 90 },
  { year: 2014, count: 135 },
  { year: 2013, count: 150 },
  { year: 2012, count: 1 },
];

// API base url
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const AlumniProfile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  // batches state will be filled by API; start with defaults
  const [batches, setBatches] = useState(defaultBatches);

  const sortedBatches = useMemo(() => [...batches].sort((a, b) => b.year - a.year), [batches]);
  const [selectedBatch, setSelectedBatch] = useState(
    () => sortedBatches[0]?.year || defaultBatches[0].year
  );
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  // clicked alumni used to show a quick preview/highlight
  const [highlightedAlumni, setHighlightedAlumni] = useState(null);

  const selectedBatchCount = batches.find((b) => b.year === selectedBatch)?.count || 0;
  const allAlumni = alumniData;

  // Extract unique locations and roles from alumni data
  const uniqueLocations = useMemo(() => {
    const locations = allAlumni.map(alumni => alumni.work_location || alumni.company).filter(Boolean);
    return [...new Set(locations)].sort();
  }, [allAlumni]);

  const uniqueRoles = useMemo(() => {
    const roles = allAlumni.map(alumni => alumni.job_role || alumni.role).filter(Boolean);
    return [...new Set(roles)].sort();
  }, [allAlumni]);

  // Filter alumni based on selected filters and search text
  const displayedAlumni = useMemo(() => {
    return allAlumni.filter(alumni => {
      const matchesLocation = selectedLocation === "all" || (alumni.work_location === selectedLocation) || (alumni.company === selectedLocation);
      const matchesRole = selectedRole === "all" || alumni.job_role === selectedRole || alumni.role === selectedRole;
      const matchesSearch = searchText === "" || 
        (alumni.full_name || alumni.name || "").toLowerCase().includes(searchText.toLowerCase()) ||
        (alumni.job_role || alumni.role || "").toLowerCase().includes(searchText.toLowerCase()) ||
        (alumni.work_location || alumni.company || "").toLowerCase().includes(searchText.toLowerCase());
      
      return matchesLocation && matchesRole && matchesSearch;
    });
  }, [allAlumni, selectedLocation, selectedRole, searchText]);

  // fetch alumni from backend whenever filters change
  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedBatch) params.append('year', selectedBatch);
      if (selectedRole && selectedRole !== 'all') params.append('role', selectedRole);
      if (selectedLocation && selectedLocation !== 'all') params.append('location', selectedLocation);
      if (searchText) params.append('name', searchText);
      const url = `${API_BASE_URL}/alumni?${params.toString()}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.success) {
        setAlumniData(data.data);
      } else {
        console.error('Failed to load alumni', data);
        setAlumniData([]);
      }
    } catch (e) {
      console.error('Error fetching alumni:', e);
      setAlumniData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, [selectedBatch, selectedRole, selectedLocation, searchText]);

  // fetch batch counts once on mount
  useEffect(() => {
    const loadCounts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/alumni/batch-counts`);
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setBatches(data.map((b) => ({ year: b.year, count: b.count })));
        }
      } catch (e) {
        console.error("Error loading batch counts:", e);
      }
    };
    loadCounts();
  }, []);

  // if the batches list updates and the currently selected batch disappears,
  // reset to newest one
  useEffect(() => {
    if (sortedBatches.length && !sortedBatches.some((b) => b.year === selectedBatch)) {
      setSelectedBatch(sortedBatches[0].year);
    }
  }, [sortedBatches, selectedBatch]);

  return (
    <Box sx={{ minHeight: "100vh", py: 6, background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%)` }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" fontWeight={800} mb={3} sx={{ color: theme.palette.text.primary }}>
          Alumni Directory
        </Typography>

        <Paper sx={{ p: { xs: 0.75, sm: 1 }, mb: 4, borderRadius: 3, backgroundColor: "#ffffff", border: `1px solid ${theme.palette.divider}`, maxWidth: "100%", mx: "auto" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search alumni by name, batch, or skills..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: theme.palette.primary.main, fontSize: 22 }} /></InputAdornment>) }}
            sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fff', borderRadius: 2, height: 44 }, '& .MuiOutlinedInput-input': { color: '#000', fontWeight: 600, fontSize: 14 }, '& .MuiInputBase-input::placeholder': { color: '#999', opacity: 1 } }}
          />
        </Paper>

        {/* Filter Section */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<TuneIcon />}
            onClick={(e) => setFilterAnchorEl(e.currentTarget)}
            sx={{
              backgroundColor: theme.palette.primary.main,
              borderRadius: 2,
              fontWeight: 600,
              height: 40,
              textTransform: 'capitalize',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            Filters
          </Button>

          {(selectedRole !== "all" || selectedLocation !== "all" || selectedBatch !== sortedBatches[0]?.year) && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              {selectedBatch !== sortedBatches[0]?.year && (
                <Chip
                  label={`Batch: ${selectedBatch}`}
                  onDelete={() => setSelectedBatch(sortedBatches[0]?.year)}
                  sx={{ backgroundColor: `${theme.palette.primary.main}20`, fontWeight: 600 }}
                />
              )}
              {selectedRole !== "all" && (
                <Chip
                  label={`Role: ${selectedRole}`}
                  onDelete={() => setSelectedRole("all")}
                  sx={{ backgroundColor: `${theme.palette.primary.main}20`, fontWeight: 600 }}
                />
              )}
              {selectedLocation !== "all" && (
                <Chip
                  label={`Location: ${selectedLocation}`}
                  onDelete={() => setSelectedLocation("all")}
                  sx={{ backgroundColor: `${theme.palette.primary.main}20`, fontWeight: 600 }}
                />
              )}
            </Box>
          )}
        </Box>

        {/* Batch Year Selector */}
        <Typography fontWeight={700} mb={2} sx={{ color: theme.palette.text.primary, fontSize: 18 }}>
          Select Alumni Batch
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 5, overflowX: 'auto', pb: 2, scrollBehavior: 'smooth', '&::-webkit-scrollbar': { height: '6px' }, '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' }, '&::-webkit-scrollbar-thumb': { backgroundColor: `${theme.palette.primary.main}40`, borderRadius: '3px' } }}>
          {sortedBatches.map((batch) => (
            <Paper
              key={batch.year}
              onClick={() => setSelectedBatch(batch.year)}
              sx={{
                flex: '0 0 auto',
                minWidth: '120px',
                p: 2.25,
                textAlign: 'center',
                cursor: 'pointer',
                borderRadius: 3,
                backgroundColor:
                  selectedBatch === batch.year
                    ? theme.palette.primary.main
                    : '#fff',
                color:
                  selectedBatch === batch.year
                    ? '#fff'
                    : '#000',
                transition: '0.25s',
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                  color: '#fff',
                  transform: 'translateY(-6px)',
                  boxShadow: `0 12px 36px ${theme.palette.primary.light}22`,
                },
              }}
            >
              <Typography fontWeight={800}>
                {batch.year}
              </Typography>
              <Typography
                fontSize={12}
                sx={{
                  color:
                    selectedBatch === batch.year
                      ? '#fff'
                      : '#000',
                }}
              >
                {batch.count} Alumni
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* Filter Popover (Professional) */}
        <Popover
          open={Boolean(filterAnchorEl)}
          anchorEl={filterAnchorEl}
          onClose={() => setFilterAnchorEl(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          TransitionComponent={Fade}
          transitionDuration={200}
          PaperProps={{
            sx: {
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(2, 6, 23, 0.2)',
              backgroundColor: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(8px)',
              overflow: 'hidden',
            },
          }}
        >
          <Paper sx={{ 
            p: 0,
            minWidth: { xs: '90vw', sm: 380 },
            maxWidth: { xs: 'calc(100vw - 32px)', sm: 520 },
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <Box sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              p: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <Typography 
                fontWeight={900} 
                sx={{
                  color: '#fff',
                  fontSize: { xs: '18px', sm: '20px' },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <TuneIcon sx={{ fontSize: 24 }} />
                Advanced Filters
              </Typography>
              <IconButton onClick={() => setFilterAnchorEl(null)} sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Content */}
            <Box sx={{ p: { xs: 2, sm: 3 } }}>

            {/* Batch Filter */}
            <Typography variant="overline" sx={{ fontWeight: 800, color: '#667eea', fontSize: '12px', mb: 1, display: 'flex', alignItems: 'center', gap: 0.8 }}><DateRangeIcon sx={{ fontSize: 16 }} /> Batch Year</Typography>
            <FormControl fullWidth size="small" sx={{ mb: 3 }}>
              <InputLabel sx={{ color: '#555', fontWeight: 600 }}>Select batch</InputLabel>
              <Select
                value={selectedBatch}
                label="Batch Year"
                onChange={(e) => setSelectedBatch(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: '#ffffff',
                      '& .MuiMenuItem-root': {
                        color: '#000',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: `${theme.palette.primary.main}15`,
                        },
                        '&.Mui-selected': {
                          backgroundColor: `${theme.palette.primary.main}25`,
                          color: theme.palette.primary.main,
                          fontWeight: 700,
                        },
                        '&.Mui-selected:hover': {
                          backgroundColor: `${theme.palette.primary.main}35`,
                        },
                      },
                    },
                  },
                }}
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: '1.5px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: '2px',
                    boxShadow: `0 0 0 3px ${theme.palette.primary.light}30`,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: '2px',
                    boxShadow: `0 0 0 3px ${theme.palette.primary.light}40`,
                  },
                  '& .MuiSelect-select': {
                    color: '#000',
                    fontWeight: 600,
                    padding: '12px',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#555',
                  },
                }}
              >
                {sortedBatches.map((batch) => (
                  <MenuItem key={batch.year} value={batch.year} sx={{ color: '#000' }}>
                    <Typography fontWeight={600}>{batch.year}</Typography>
                    <Typography sx={{ fontSize: '12px', color: '#999', ml: 1 }}>
                      ({batch.count} Alumni)
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider sx={{ my: 2.5, borderColor: `${theme.palette.primary.main}15` }} />

            {/* Location Filter */}
            <Typography variant="overline" sx={{ fontWeight: 800, color: '#667eea', fontSize: '12px', mb: 1, display: 'flex', alignItems: 'center', gap: 0.8 }}><LocationOnOutlinedIcon sx={{ fontSize: 16 }} /> Location</Typography>
            <FormControl fullWidth size="small" sx={{ mb: 3 }}>
              <InputLabel sx={{ color: '#555', fontWeight: 600 }}>Select location</InputLabel>
              <Select
                value={selectedLocation}
                label="Location"
                onChange={(e) => setSelectedLocation(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: '#ffffff',
                      '& .MuiMenuItem-root': {
                        color: '#000',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: `${theme.palette.primary.main}15`,
                        },
                        '&.Mui-selected': {
                          backgroundColor: `${theme.palette.primary.main}25`,
                          color: theme.palette.primary.main,
                          fontWeight: 700,
                        },
                        '&.Mui-selected:hover': {
                          backgroundColor: `${theme.palette.primary.main}35`,
                        },
                      },
                    },
                  },
                }}
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: '1.5px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: '2px',
                    boxShadow: `0 0 0 3px ${theme.palette.primary.light}30`,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: '2px',
                    boxShadow: `0 0 0 3px ${theme.palette.primary.light}40`,
                  },
                  '& .MuiSelect-select': {
                    color: '#000',
                    fontWeight: 600,
                    padding: '12px',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#555',
                  },
                }}
              >
                <MenuItem value="all" sx={{ color: '#000' }}>
                  <Typography fontWeight={600}>All Locations</Typography>
                </MenuItem>
                {uniqueLocations.map((location) => (
                  <MenuItem key={location} value={location} sx={{ color: '#000' }}>
                    <Typography fontWeight={600}>{location}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider sx={{ my: 2.5, borderColor: `${theme.palette.primary.main}15` }} />

            {/* Job Role Filter */}
            <Typography variant="overline" sx={{ fontWeight: 800, color: '#667eea', fontSize: '12px', mb: 1, display: 'flex', alignItems: 'center', gap: 0.8 }}><WorkIcon sx={{ fontSize: 16 }} /> Job Role</Typography>
            <FormControl fullWidth size="small" sx={{ mb: 3 }}>
              <InputLabel sx={{ color: '#555', fontWeight: 600 }}>Select role</InputLabel>
              <Select
                value={selectedRole}
                label="Job Role"
                onChange={(e) => setSelectedRole(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: '#ffffff',
                      '& .MuiMenuItem-root': {
                        color: '#000',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: `${theme.palette.primary.main}15`,
                        },
                        '&.Mui-selected': {
                          backgroundColor: `${theme.palette.primary.main}25`,
                          color: theme.palette.primary.main,
                          fontWeight: 700,
                        },
                        '&.Mui-selected:hover': {
                          backgroundColor: `${theme.palette.primary.main}35`,
                        },
                      },
                    },
                  },
                }}
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: '1.5px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: '2px',
                    boxShadow: `0 0 0 3px ${theme.palette.primary.light}30`,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: '2px',
                    boxShadow: `0 0 0 3px ${theme.palette.primary.light}40`,
                  },
                  '& .MuiSelect-select': {
                    color: '#000',
                    fontWeight: 600,
                    padding: '12px',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#555',
                  },
                }}
              >
                <MenuItem value="all" sx={{ color: '#000' }}>
                  <Typography fontWeight={600}>All Roles</Typography>
                </MenuItem>
                {uniqueRoles.map((role) => (
                  <MenuItem key={role} value={role} sx={{ color: '#000' }}>
                    <Typography fontWeight={600}>{role}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider sx={{ my: 3, borderColor: `${theme.palette.primary.main}15` }} />

            {/* Action Buttons */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setSelectedBatch(sortedBatches[0]?.year);
                  setSelectedLocation("all");
                  setSelectedRole("all");
                  setSearchText("");
                }}
                sx={{
                  color: '#667eea',
                  borderColor: '#667eea',
                  borderRadius: 2,
                  fontWeight: 800,
                  height: 42,
                  textTransform: 'none',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.08)',
                    borderColor: '#667eea',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Reset Filters
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => setFilterAnchorEl(null)}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  color: '#fff',
                  borderRadius: 2,
                  fontWeight: 800,
                  height: 42,
                  textTransform: 'none',
                  fontSize: '14px',
                  boxShadow: `0 8px 24px ${theme.palette.primary.light}40`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 32px ${theme.palette.primary.light}50`,
                  },
                }}
              >
                Apply Filters
              </Button>
            </Box>
            </Box>
          </Paper>
        </Popover>

        <Typography fontWeight={700} mb={2} sx={{ color: theme.palette.text.primary, fontSize: 18 }}>
          Alumni Directory
        </Typography>

        <Typography variant="h6" fontWeight={800} mb={3} sx={{ color: '#fff', fontSize: { xs: 18, md: 20 } }}>
          Alumni from the Batch of {selectedBatch} 
          <Typography component="span" sx={{ fontSize: '0.8em', opacity: 0.9, ml: 1 }}>
            ({displayedAlumni.length} results)
          </Typography>
        </Typography>

        {loading && displayedAlumni.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress sx={{ color: "white" }} />
          </Box>
        ) : displayedAlumni.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography sx={{ color: '#fff', fontSize: 18, fontWeight: 600 }}>
              No alumni found matching your filters.
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, mt: 1 }}>
              Try adjusting your filter criteria or resetting filters.
            </Typography>
          </Box>
        ) : (
        <Grid container spacing={2}>
          {displayedAlumni.map((alumni) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={alumni.user_id || alumni.id}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Paper
                sx={{
                  width: 260,
                  height: 280,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  borderRadius: 2,
                  textAlign: "center",
                  backgroundColor: "#fff",
                  border: `1px solid ${theme.palette.divider}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: `0 12px 32px ${theme.palette.primary.light}33`,
                  },
                }}
              >
                {/* Profile picture if provided, otherwise initials */}
                <Avatar
                  src={alumni.profile_photo || alumni.profilePhoto || alumni.image || undefined}
                  sx={{
                    width: 80,
                    height: 80,
                    border: `2px solid ${theme.palette.primary.main}`,
                    backgroundColor: theme.palette.primary.main,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '28px',
                  }}
                >
                  {!(alumni.profile_photo || alumni.profilePhoto || alumni.image) &&
                    (alumni.full_name || alumni.name || "").split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                  }
                </Avatar>

                {/* Name */}
                <Typography
                  fontWeight={700}
                  fontSize="14px"
                  sx={{
                    color: "#000",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    width: "100%",
                  }}
                >
                  {alumni.full_name || alumni.name}
                </Typography>

                {/* Batch */}
                <Typography
                  fontSize="12px"
                  fontWeight={600}
                  sx={{
                    color: theme.palette.primary.main,
                    backgroundColor: `${theme.palette.primary.main}15`,
                    px: 1.5,
                    py: 0.4,
                    borderRadius: 1,
                  }}
                >
                  Batch of {selectedBatch}
                </Typography>

                {/* Role */}
                <Typography
                  fontSize="12px"
                  sx={{
                    color: "#000",
                    opacity: 0.8,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    width: "100%",
                  }}
                >
                  {alumni.job_role || alumni.role || "—"}
                </Typography>

                {/* Company */}
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap={0.4}
                  width="100%"
                >
                  <Typography
                    fontSize="11px"
                    sx={{
                      color: "#000",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {alumni.work_location || alumni.company}
                  </Typography>
                </Box>

                {/* View Profile Button */}
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 600, fontSize: "12px", textTransform: "capitalize" }}
                  onClick={() => setHighlightedAlumni(alumni)}
                >
                  View Profile
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid> 
        )}

      {/* quick preview dialog for clicked profile */}
      <Dialog
        open={Boolean(highlightedAlumni)}
        onClose={() => setHighlightedAlumni(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: '#fff' }}>
          Profile Preview
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{
              color: theme.palette.primary.main,
              mb: 1,
            }}
          >
            {highlightedAlumni?.full_name || highlightedAlumni?.name}
          </Typography>
          <Typography
            fontSize="14px"
            fontWeight={700}
            sx={{
              color: theme.palette.primary.dark,
              backgroundColor: `${theme.palette.primary.main}15`,
              display: 'inline-block',
              px: 2,
              py: 0.5,
              borderRadius: 1,
            }}
          >
            Batch of {selectedBatch}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              if (highlightedAlumni) {
                navigate(`/alumni/${highlightedAlumni.user_id || highlightedAlumni.id}`);
              }
            }}
            variant="contained"
            color="primary"
          >
            Continue
          </Button>
          <Button onClick={() => setHighlightedAlumni(null)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      </Box>
    </Box>
  );
};
export default AlumniProfile;
