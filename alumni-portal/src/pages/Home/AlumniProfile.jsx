
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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { default as API_BASE_URL } from "../../api/config"; // for batch counts endpoint
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import WorkIcon from "@mui/icons-material/Work";
import DateRangeIcon from "@mui/icons-material/DateRange";


// batch list initially empty; populated from backend
const defaultBatches = [];


const AlumniProfile = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [batches, setBatches] = useState(defaultBatches);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchLoading, setBatchLoading] = useState(true);

  useEffect(() => {
    // fetch real counts from backend
    fetch(`${API_BASE_URL}/alumni/batch-counts?approved=true`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const list = data.map((b) => ({ year: b.year, count: b.count }));
          setBatches(list);
          if (list.length) setSelectedBatch(list.sort((a,b)=>b.year-a.year)[0].year);
        }
      })
      .catch((err) => console.error("Error fetching batch counts", err))
      .finally(() => setBatchLoading(false));
  }, []);

  const sortedBatches = useMemo(() => [...batches].sort((a, b) => b.year - a.year), [batches]);

  // whenever sortedBatches changes (after data load), ensure the selected batch still exists
  useEffect(() => {
    if (sortedBatches.length && !sortedBatches.some(b => b.year === selectedBatch)) {
      setSelectedBatch(sortedBatches[0].year);
    }
  }, [sortedBatches, selectedBatch]);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);


  const [alumniList, setAlumniList] = useState([]);
  const [loadingAlumni, setLoadingAlumni] = useState(false);
  const [alumniError, setAlumniError] = useState(null);

  // compute unique filter values from fetched alumni
  const uniqueDepartments = useMemo(() => {
    const depts = alumniList.map(a => a.department || '').filter(Boolean);
    return [...new Set(depts)].sort();
  }, [alumniList]);

  const uniqueRoles = useMemo(() => {
    const roles = alumniList.map(a => a.job_role || '').filter(Boolean);
    return [...new Set(roles)].sort();
  }, [alumniList]);

  // derive current user once so we can exclude self when needed
  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch {
      return {};
    }
  }, []);

  const fetchAlumni = () => {
    setLoadingAlumni(true);
    setAlumniError(null);
    let url = new URL(`${API_BASE_URL}/alumni`);
    // only show approved alumni in the directory
    url.searchParams.append('approved', 'true');
    url.searchParams.append('year', selectedBatch);
    if (selectedRole && selectedRole !== 'all') {
      url.searchParams.append('role', selectedRole);
    }
    if (selectedDepartment && selectedDepartment !== 'all') {
      url.searchParams.append('department', selectedDepartment);
    }
    if (searchText) {
      url.searchParams.append('name', searchText);
    }

    fetch(url.toString())
      .then(r => r.json())
      .then(data => {
        // backend wraps results in { success, data } for list
        const arr = Array.isArray(data)
          ? data
          : data.data || [];
        let transformed = arr.map(a => ({
          ...a,
          image: a.profile_photo ? `${API_BASE_URL}/${a.profile_photo}` : a.profile_photo || '',
          // we no longer need displayCompany; keep department explicitly
          department: a.department || '',
        }));
        // if not admin, remove the current user's own entry (matched by user_id)
        if (currentUser.role !== 'admin' && currentUser.userId) {
          transformed = transformed.filter(a => String(a.user_id) !== String(currentUser.userId));
        }
        setAlumniList(transformed);
      })
      .catch(err => {
        console.error('Error fetching alumni list', err);
        setAlumniError(err.message || 'Failed to fetch');
      })
      .finally(() => setLoadingAlumni(false));
  };

  // refetch whenever any filter/search/batch changes
  useEffect(() => {
    if (!selectedBatch) return;
    fetchAlumni();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBatch, selectedRole, selectedDepartment, searchText]);

  const displayedAlumni = alumniList; // already filtered by backend


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


          {!batchLoading && (selectedRole !== "all" || selectedDepartment !== "all" || (selectedBatch && selectedBatch !== sortedBatches[0]?.year)) && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              {selectedBatch && selectedBatch !== sortedBatches[0]?.year && (
                <Chip
                  label={`Batch: ${selectedBatch}`}
                  onDelete={() => setSelectedBatch(sortedBatches[0]?.year || batches[0].year)}
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
              {selectedDepartment !== "all" && (
                <Chip
                  label={`Department: ${selectedDepartment}`}
                  onDelete={() => setSelectedDepartment("all")}
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
          {batchLoading ? (
            <Typography sx={{ color: '#fff', fontWeight: 600 }}>Loading batches...</Typography>
          ) : sortedBatches.length === 0 ? (
            <Typography sx={{ color: '#fff', fontWeight: 600 }}>No batches found.</Typography>
          ) : (
            sortedBatches.map((batch) => (
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
            ))
          )}
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
                value={selectedBatch || ''}
                label="Batch Year"
                onChange={(e) => setSelectedBatch(e.target.value)}
                disabled={batchLoading}
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
                {batchLoading ? (
                  <MenuItem disabled>
                    <Typography fontWeight={600}>Loading...</Typography>
                  </MenuItem>
                ) : sortedBatches.map((batch) => (
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
            <Typography variant="overline" sx={{ fontWeight: 800, color: '#667eea', fontSize: '12px', mb: 1, display: 'flex', alignItems: 'center', gap: 0.8 }}><WorkIcon sx={{ fontSize: 16 }} /> Department</Typography>
            <FormControl fullWidth size="small" sx={{ mb: 3 }}>
              <InputLabel sx={{ color: '#555', fontWeight: 600 }}>Select department</InputLabel>
              <Select
                value={selectedDepartment}
                label="Department"
                onChange={(e) => setSelectedDepartment(e.target.value)}
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
                  <Typography fontWeight={600}>All Departments</Typography>
                </MenuItem>
                {uniqueDepartments.map((dept) => (
                  <MenuItem key={dept} value={dept} sx={{ color: '#000' }}>
                    <Typography fontWeight={600}>{dept}</Typography>
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
                  setSelectedBatch(sortedBatches[0]?.year || batches[0].year);
                  setSelectedDepartment("all");
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
          Alumni from the Batch of {batchLoading ? '...' : selectedBatch || 'N/A'}
          <Typography component="span" sx={{ fontSize: '0.8em', opacity: 0.9, ml: 1 }}>
            ({displayedAlumni.length} results)
          </Typography>
        </Typography>


        {loadingAlumni ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography sx={{ color: '#fff', fontSize: 18, fontWeight: 600 }}>
              Loading alumni...
            </Typography>
          </Box>
        ) : alumniError ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography sx={{ color: '#fff', fontSize: 18, fontWeight: 600 }}>
              Error: {alumniError}
            </Typography>
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
                {/* Profile Picture */}
                <Avatar
                  src={alumni.image}
                  sx={{
                    width: 80,
                    height: 80,
                    border: `2px solid ${theme.palette.primary.main}`,
                  }}
                />


                {/* Name (highlighted) */}
                <Typography
                  fontWeight={800}
                  fontSize="14px"
                  sx={{
                    color: theme.palette.primary.main,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    width: "100%",
                    borderBottom: `1px solid ${theme.palette.primary.main}`,
                    pb: 0.5,
                  }}
                >
                  {alumni.full_name || alumni.name}
                </Typography>


                {/* Batch (highlighted) */}
                <Typography
                  fontSize="12px"
                  fontWeight={700}
                  sx={{
                    color: theme.palette.primary.dark,
                    backgroundColor: `${theme.palette.primary.main}15`,
                    px: 1.5,
                    py: 0.4,
                    borderRadius: 1,
                    letterSpacing: '0.5px',
                  }}
                >
                  Batch of {selectedBatch}
                </Typography>


                {/* Job Role */}
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
                  {alumni.job_role || alumni.role}
                </Typography>


                {/* Location */}
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap={0.4}
                  width="100%"
                >
                  <WorkIcon
                    sx={{
                      fontSize: 16,
                      color: theme.palette.primary.main,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    fontSize="11px"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {alumni.department || ''}
                  </Typography>
                </Box>


                {/* View Profile Button */}
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 600, fontSize: "12px", textTransform: "capitalize" }}
                  onClick={() => navigate(`/alumni/${alumni.user_id || alumni.id}`)}
                >
                  View Profile
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
        )}


      </Box>
    </Box>
  );
};


export default AlumniProfile;





