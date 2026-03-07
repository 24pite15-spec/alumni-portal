import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Stack,
  Card,
  CardContent,
  InputAdornment,
  Chip,
} from "@mui/material";
import { eventsAPI, API_BASE_URL } from "../../api/config";
import { useTheme } from "@mui/material/styles";
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/PersonOutline';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import LinkIcon from '@mui/icons-material/LinkOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttendanceIcon from '@mui/icons-material/Group';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';




const Events = () => {
  const theme = useTheme();
  const [tab, setTab] = useState(() => {
    const saved = localStorage.getItem('activeEventTab');
    console.log('🔑 localStorage.activeEventTab:', saved);
    const initialTab = saved !== null ? parseInt(saved) : 1;
    console.log('📍 Initializing tab to:', initialTab);
    return initialTab;
  });
  const fileInputRef = useRef(null);


  const [form, setForm] = useState({ title: '', location: '', date: '', time: '', timeFormat: 'AM', organizer: '', email: '', eventType: 'offline', meetingLink: '', fee: '', image: '', description: '' });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // load from backend when component mounts
  useEffect(() => {
    setLoading(true);
    console.log('🔄 Fetching events from backend...');
    eventsAPI
      .list()
      .then((data) => {
        console.log('📥 Raw events from API:', data);
        const raw = Array.isArray(data) ? data : data.data || [];
        console.log('📋 Parsed raw events:', raw);
        const norm = raw.map(normalizeEvent);
        console.log('✅ Normalized events:', norm);
        setEvents(norm);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching events", err);
        setEvents([]);
        setLoading(false);
      });
  }, []);

  // Persist tab selection to localStorage
  useEffect(() => {
    console.log('💾 Saving tab to localStorage:', tab);
    localStorage.setItem('activeEventTab', String(tab));
    console.log('✅ Tab saved! Current localStorage:', localStorage.getItem('activeEventTab'));
  }, [tab]);


  const handleChange = (field) => (e) => setForm((s) => ({ ...s, [field]: e.target.value }));


  const validateForm = () => {
    if (!form.title.trim() || !form.description.trim()) return false;
    if (!form.date || !form.time) return false;
    if (form.eventType === 'offline' && !form.location.trim()) return false;
    if (form.eventType === 'online' && !form.meetingLink.trim()) return false;
    return true;
  };


  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      // if user attached an image as a data URL, upload it first to avoid huge JSON payload
      let imgPath = null;
      if (form.image && form.image.startsWith('data:')) {
        try {
          // convert data URL to blob
          const res = await fetch(form.image);
          const blob = await res.blob();
          const fd = new FormData();
          fd.append('image', blob, 'event-image');

          const uploadRes = await fetch(`${API_BASE_URL}/events/upload-image`, {
            method: 'POST',
            body: fd,
          });
          
          if (!uploadRes.ok) {
            const errorData = await uploadRes.json();
            throw new Error(errorData.message || 'Image upload failed');
          }
          
          const uploadData = await uploadRes.json();
          imgPath = uploadData.imagePath;
          console.log('Image uploaded successfully:', imgPath);
        } catch (uploadErr) {
          console.error('Image upload error:', uploadErr);
          alert(`Failed to upload image: ${uploadErr.message}`);
          return;
        }
      }

      const payload = {
        event_name: form.title.trim(),
        event_description: form.description.trim(),
        event_date: form.date,
        event_time: form.time,
        event_time_format: form.timeFormat,
        event_format: form.eventType,
        venue: form.eventType === 'offline' ? form.location.trim() : form.meetingLink.trim(),
        organizer_name: form.organizer.trim() || null,
        organizer_email: form.email.trim() || null,
        invitation_image: imgPath || null,
        fee: form.fee ? Number(form.fee) : null,
      };

      console.log('📤 Sending event payload:', JSON.stringify(payload, null, 2));

      const created = await eventsAPI.create(payload);
      console.log('✅ Event created:', created);
      const norm = normalizeEvent(created);
      console.log('✅ Normalized created event:', norm);
      setEvents((e) => {
        const updated = [norm, ...(Array.isArray(e) ? e : [])];
        console.log('✅ Updated events list:', updated);
        return updated;
      });
      setForm({ title: '', location: '', date: '', time: '', timeFormat: 'AM', organizer: '', email: '', eventType: 'offline', meetingLink: '', fee: '', image: '', description: '' });
      setTab(1);
    } catch (err) {
      console.error('Failed to create event', err);
      alert('Failed to create event. Please try again.');
    }
  };


  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setForm((s) => ({ ...s, image: ev.target?.result }));
      reader.readAsDataURL(file);
    }
  };




  // normalise events received from backend into client model
  const normalizeEvent = (ev) => {
    // Extract just the date part from ISO format (YYYY-MM-DD from YYYY-MM-DDTHH:MM:SS.SSSZ)
    const dateStr = ev.event_date || ev.date;
    const date = dateStr ? dateStr.split('T')[0] : dateStr;
    const time = ev.event_time || ev.time;
    const timeFormat = ev.event_time_format || 'AM';
    // compute src for image, adding base URL when necessary
    let imagePath = ev.invitation_image || ev.image;
    if (imagePath && !imagePath.startsWith('http')) {
      imagePath = `${API_BASE_URL}/${imagePath}`;
    }
    const normalized = {
      id: ev.id,
      title: ev.event_name || ev.title,
      description: ev.event_description || ev.description,
      date,
      time,
      timeFormat,
      eventType: ev.event_format || ev.eventType,
      location: ev.venue || ev.location,
      organizer: ev.organizer_name || ev.organizer,
      email: ev.organizer_email || ev.email,
      fee: ev.fee || ev.fee,
      image: imagePath,
      when: `${date}${time ? ' ' + time + ' ' + timeFormat : ''}`,
    };
    console.log('🔄 Normalized event:', normalized);
    return normalized;
  };

  // Determine the end-of-day for an event's date.  We intentionally IGNORE
  // the `time` field when categorizing upcoming vs past so that an event
  // remains "upcoming" for the entire calendar day.
  const endOfDay = (ev) => {
    try {
      if (!ev.date) {
        console.warn('⚠️  Event has no date:', ev);
        return new Date(0); // return past date if no date available
      }
      const [y, m, d] = ev.date.split('-').map(Number);
      if (!y || !m || !d) {
        console.warn('⚠️  Invalid date format:', ev.date);
        return new Date(0);
      }
      // local time 23:59:59.999 ensures the event stays upcoming until the day is over
      return new Date(y, m - 1, d, 23, 59, 59, 999);
    } catch (e) {
      console.error('❌ Error computing endOfDay for event:', ev, e);
      return new Date(0);
    }
  };

  const now = new Date();
  console.log('📅 Current time:', now);
  const upcoming = events
    .filter(ev => {
      const endDay = endOfDay(ev);
      const isUpcoming = endDay >= now;
      console.log(`Event "${ev.title}": endOfDay=${endDay}, isUpcoming=${isUpcoming}`);
      return isUpcoming;
    })
    .sort((a, b) => {
      // Sort by date ascending (earliest first - tomorrow before next week)
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      // If same date, sort by time ascending
      return (a.time || '00:00').localeCompare(b.time || '00:00');
    });
  const past = events.filter(ev => endOfDay(ev) < now);
  
  console.log(`📊 Events loaded: ${events.length} total, ${upcoming.length} upcoming, ${past.length} past`);

  // Debug effect - log when events change
  useEffect(() => {
    console.log('🔔 Events state updated:', events);
  }, [events]);


  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1a1a1a' }}>
            <EventIcon sx={{ color: theme.palette.primary.main }} />
            Events
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>Create and manage community events professionally.</Typography>
        </Box>
      </Box>


      <Paper elevation={3} sx={{ borderRadius: 3, mb: 4, backgroundColor: '#fff' }}>
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          indicatorColor="none"
          textColor="inherit"
          variant="fullWidth"
          sx={{
            backgroundColor: theme.palette.primary.main,
            '& .MuiTab-root': {
              color: '#ffffff',
              fontWeight: 600,
              fontSize: { xs: '13px', md: '14px' },
              transition: 'all 0.2s ease',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
            },
            '& .Mui-selected': {
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderBottom: '3px solid #fff',
            },
          }}
        >
          <Tab label="Create Event" />
          <Tab label={`Upcoming (${upcoming.length})`} />
          <Tab label={`Past (${past.length})`} />
        </Tabs>
      </Paper>


      {tab === 0 && (
        <Paper elevation={4} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, backgroundColor: '#fff' }}>
          <Typography fontWeight={700} mb={4} sx={{ color: '#1a1a1a', fontSize: { xs: '20px', md: '24px' } }}>Create New Event</Typography>
          <Stack spacing={3}>
            {/* Event Name */}
            <TextField
              label="Event Name"
              fullWidth
              placeholder="e.g., Alumni Reunion 2026"
              value={form.title}
              onChange={handleChange('title')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#ddd' },
                  '&:hover fieldset': { borderColor: theme.palette.primary.main },
                  '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                },
                '& .MuiOutlinedInput-input': { color: '#000', fontWeight: 500 },
                '& .MuiInputLabel-root': { color: '#666' },
                '& .MuiInputLabel-root.Mui-focused': { color: theme.palette.primary.main },
              }}
            />


            {/* Event Description */}
            <TextField
              label="Event Description"
              multiline
              rows={4}
              fullWidth
              placeholder="Describe the event details, agenda, and any other important information..."
              value={form.description}
              onChange={handleChange('description')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#ddd' },
                  '&:hover fieldset': { borderColor: theme.palette.primary.main },
                  '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                },
                '& .MuiOutlinedInput-input': { color: '#000', fontWeight: 500 },
                '& .MuiInputLabel-root': { color: '#666' },
                '& .MuiInputLabel-root.Mui-focused': { color: theme.palette.primary.main },
              }}
            />


            {/* Event Date */}
            <TextField
              label="Event Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={form.date}
              onChange={handleChange('date')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon sx={{ color: theme.palette.primary.main, fontSize: '22px' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#ddd' },
                  '&:hover fieldset': { borderColor: theme.palette.primary.main, borderWidth: '2px' },
                  '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main, borderWidth: '2px' },
                },
                '& .MuiOutlinedInput-input': { color: '#000', fontWeight: 600, fontSize: '15px', cursor: 'pointer' },
                '& .MuiInputLabel-root': { color: '#666' },
                '& .MuiInputLabel-root.Mui-focused': { color: theme.palette.primary.main },
              }}
            />


            {/* Event Time with AM/PM Toggle */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <TextField
                label="Event Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={form.time}
                onChange={handleChange('time')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon sx={{ color: theme.palette.primary.main, fontSize: '22px' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#ddd' },
                    '&:hover fieldset': { borderColor: theme.palette.primary.main, borderWidth: '2px' },
                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main, borderWidth: '2px' },
                  },
                  '& .MuiOutlinedInput-input': { color: '#000', fontWeight: 600, fontSize: '15px', cursor: 'pointer' },
                  '& .MuiInputLabel-root': { color: '#666' },
                  '& .MuiInputLabel-root.Mui-focused': { color: theme.palette.primary.main },
                }}
              />
              <ToggleButtonGroup
                value={form.timeFormat}
                exclusive
                onChange={(e, val) => val && setForm((s) => ({ ...s, timeFormat: val }))}
                sx={{
                  mt: 1,
                  '& .MuiToggleButton-root': {
                    color: '#666',
                    borderColor: '#ddd',
                    fontWeight: 700,
                    fontSize: '14px',
                    px: 2,
                    py: 1.2,
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#f8f9fa',
                    '&:hover': {
                      backgroundColor: '#e8ecf5',
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                    },
                  },
                  '& .MuiToggleButton-root.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: '#fff',
                    borderColor: theme.palette.primary.main,
                    boxShadow: '0 4px 12px rgba(104, 121, 227, 0.3)',
                    '&:hover': {
                      backgroundColor: '#4a5bbf',
                    },
                  },
                }}
              >
                <ToggleButton value="AM">AM</ToggleButton>
                <ToggleButton value="PM">PM</ToggleButton>
              </ToggleButtonGroup>
            </Box>


            {/* Event Type Toggle */}
            <Box>
              <Typography fontWeight={600} mb={1.5} sx={{ fontSize: '14px', color: '#1a1a1a' }}>Event Format</Typography>
              <ToggleButtonGroup
                value={form.eventType}
                exclusive
                onChange={(e, val) => val && setForm((s) => ({ ...s, eventType: val }))}
                fullWidth
                sx={{
                  '& .MuiToggleButton-root': {
                    color: '#666',
                    borderColor: '#ddd',
                    fontWeight: 700,
                    fontSize: '15px',
                    py: 1.4,
                    flex: 1,
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#f8f9fa',
                    '&:hover': {
                      backgroundColor: '#e8ecf5',
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(104, 121, 227, 0.2)',
                    },
                  },
                  '& .MuiToggleButton-root.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: '#fff',
                    borderColor: theme.palette.primary.main,
                    boxShadow: '0 4px 12px rgba(104, 121, 227, 0.3)',
                    '&:hover': {
                      backgroundColor: '#4a5bbf',
                      boxShadow: '0 6px 16px rgba(104, 121, 227, 0.4)',
                    },
                  },
                }}
              >
                <ToggleButton value="offline">📍 Offline</ToggleButton>
                <ToggleButton value="online">🔗 Online</ToggleButton>
              </ToggleButtonGroup>
            </Box>


            {/* Location or Meeting Link - Conditional */}
            {form.eventType === 'offline' && (
              <TextField
                label="Venue / Location"
                fullWidth
                placeholder="e.g., Hotel Grand, Mumbai"
                value={form.location}
                onChange={handleChange('location')}
                InputProps={{ startAdornment: (<LocationOnIcon sx={{ mr: 1, color: theme.palette.primary.main }} />) }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#ddd' },
                    '&:hover fieldset': { borderColor: theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                  },
                  '& .MuiOutlinedInput-input': { color: '#000', fontWeight: 500 },
                  '& .MuiInputLabel-root': { color: '#666' },
                  '& .MuiInputLabel-root.Mui-focused': { color: theme.palette.primary.main },
                }}
              />
            )}


            {form.eventType === 'online' && (
              <TextField
                label="Meeting Link"
                fullWidth
                placeholder="e.g., https://zoom.us/..."
                value={form.meetingLink}
                onChange={handleChange('meetingLink')}
                InputProps={{ startAdornment: (<LinkIcon sx={{ mr: 1, color: theme.palette.primary.main }} />) }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#ddd' },
                    '&:hover fieldset': { borderColor: theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                  },
                  '& .MuiOutlinedInput-input': { color: '#000', fontWeight: 500 },
                  '& .MuiInputLabel-root': { color: '#666' },
                  '& .MuiInputLabel-root.Mui-focused': { color: theme.palette.primary.main },
                }}
              />
            )}


            {/* Organizer Name */}
            <TextField
              label="Organizer Name"
              fullWidth
              placeholder="Your name"
              value={form.organizer}
              onChange={handleChange('organizer')}
              InputProps={{ startAdornment: (<PersonIcon sx={{ mr: 1, color: theme.palette.primary.main }} />) }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#ddd' },
                  '&:hover fieldset': { borderColor: theme.palette.primary.main },
                  '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                },
                '& .MuiOutlinedInput-input': { color: '#000', fontWeight: 500 },
                '& .MuiInputLabel-root': { color: '#666' },
                '& .MuiInputLabel-root.Mui-focused': { color: theme.palette.primary.main },
              }}
            />


            {/* Organizer Email */}
            <TextField
              label="Organizer Email"
              type="email"
              fullWidth
              placeholder="organizer@example.com"
              value={form.email}
              onChange={handleChange('email')}
              InputProps={{ startAdornment: (<EmailIcon sx={{ mr: 1, color: theme.palette.primary.main }} />) }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#ddd' },
                  '&:hover fieldset': { borderColor: theme.palette.primary.main },
                  '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                },
                '& .MuiOutlinedInput-input': { color: '#000', fontWeight: 500 },
                '& .MuiInputLabel-root': { color: '#666' },
                '& .MuiInputLabel-root.Mui-focused': { color: theme.palette.primary.main },
              }}
            />


            {/* Fee */}
            <TextField
              label="Fee (INR, optional)"
              type="number"
              fullWidth
              placeholder="e.g., 500 (₹)"
              value={form.fee}
              onChange={handleChange('fee')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#ddd' },
                  '&:hover fieldset': { borderColor: theme.palette.primary.main },
                  '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                },
                '& .MuiOutlinedInput-input': { color: '#000', fontWeight: 500 },
                '& .MuiInputLabel-root': { color: '#666' },
                '& .MuiInputLabel-root.Mui-focused': { color: theme.palette.primary.main },
              }}
            />


            {/* Invitation Image */}
            <Box>
              <Typography fontWeight={600} mb={2} sx={{ fontSize: '14px', color: '#1a1a1a' }}>Invitation Image (Optional)</Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => fileInputRef.current?.click()}
                startIcon={<PhotoCameraIcon />}
                sx={{
                  color: '#fff',
                  backgroundColor: theme.palette.primary.main,
                  fontWeight: 600,
                  py: 1.2,
                  mb: 2,
                  '&:hover': { backgroundColor: 'rgba(104, 121, 227, 0.9)' }
                }}
              >
                Upload Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              {form.image && (
                <Box
                  component="img"
                  src={form.image}
                  alt="preview"
                  sx={{ width: '100%', maxHeight: '250px', borderRadius: 2, objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              )}
            </Box>


            {/* Create Event Button */}
            <Button
              onClick={handleCreate}
              variant="contained"
              disabled={!validateForm()}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
                fontWeight: 700,
                py: 1.8,
                fontSize: '16px',
                borderRadius: 1.5,
                transition: 'all 0.3s',
                mt: 2,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark || '#4a5bbf',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 12px rgba(104, 121, 227, 0.3)',
                },
                '&:disabled': { backgroundColor: '#ccc', color: '#999' }
              }}
            >
              Create Event
            </Button>
          </Stack>
        </Paper>
      )}


      {tab === 1 && (
        <Stack spacing={3}>
          {loading && (
            <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">Loading events...</Typography>
            </Paper>
          )}
          {!loading && upcoming.length === 0 && (
            <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
              <EventIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
              <Typography color="text.secondary" variant="body1">No upcoming events.</Typography>
            </Paper>
          )}
          {!loading && upcoming.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            {upcoming.map((ev) => (
              <Card
                key={ev.id}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  backgroundColor: '#fff',
                  transition: 'all 0.3s ease',
                  border: '1px solid #e8ecf1',
                  '&:hover': {
                    boxShadow: '0 12px 32px rgba(104, 121, 227, 0.15)',
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: { xs: 'auto', md: '280px' } }}>
                  {/* Image Section */}
                  {ev.image && (
                    <Box
                      component="img"
                      src={ev.image}
                      alt={ev.title}
                      sx={{
                        width: { xs: '100%', md: '300px' },
                        height: { xs: '200px', md: '100%' },
                        objectFit: 'cover',
                        backgroundColor: '#f0f4ff',
                        flexShrink: 0,
                      }}
                    />
                  )}

                  {/* Content Section */}
                  <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Date Badge */}
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        icon={<CalendarTodayIcon sx={{ fontSize: '16px !important' }} />}
                        label={`${ev.date}${ev.time ? ' at ' + ev.time + ' ' + ev.timeFormat : ''}`}
                        size="small"
                        sx={{
                          backgroundColor: '#f0f4ff',
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                          fontSize: '12px',
                          '& .MuiChip-icon': { color: theme.palette.primary.main }
                        }}
                      />
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: '#1a1a1a',
                        mb: 1.5,
                        fontSize: '20px',
                        lineHeight: 1.3,
                      }}
                    >
                      {ev.title}
                    </Typography>

                    {/* Description */}
                    {ev.description && (
                      <Typography
                        sx={{
                          color: '#666',
                          fontSize: '14px',
                          lineHeight: 1.5,
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {ev.description}
                      </Typography>
                    )}

                    {/* Details Grid */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, flex: 1 }}>
                      {/* Venue/Location */}
                      {ev.location && (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', minWidth: '200px' }}>
                          <LocationOnIcon sx={{ fontSize: '18px', color: theme.palette.primary.main, flexShrink: 0 }} />
                          <Box>
                            <Typography sx={{ fontSize: '11px', color: '#999', fontWeight: 600, letterSpacing: '0.5px' }}>
                              {ev.eventType === 'online' ? 'LINK' : 'VENUE'}
                            </Typography>
                            {ev.eventType === 'online' ? (
                              <Typography
                                component="a"
                                href={ev.location}
                                target="_blank"
                                rel="noopener"
                                sx={{
                                  fontSize: '13px',
                                  color: theme.palette.primary.main,
                                  textDecoration: 'none',
                                  fontWeight: 600,
                                  '&:hover': { textDecoration: 'underline' }
                                }}
                              >
                                Join Now
                              </Typography>
                            ) : (
                              <Typography sx={{ fontSize: '13px', color: '#2d2d2d', fontWeight: 600 }}>
                                {ev.location}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      )}

                      {/* Organizer */}
                      {ev.organizer && (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', minWidth: '200px' }}>
                          <PersonIcon sx={{ fontSize: '18px', color: '#ff9800', flexShrink: 0 }} />
                          <Box>
                            <Typography sx={{ fontSize: '11px', color: '#999', fontWeight: 600, letterSpacing: '0.5px' }}>
                              ORGANIZER
                            </Typography>
                            <Typography sx={{ fontSize: '13px', color: '#2d2d2d', fontWeight: 600 }}>
                              {ev.organizer}
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      {/* Fee */}
                      {ev.fee != null && ev.fee !== 0 && (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Box>
                            <Typography sx={{ fontSize: '11px', color: '#999', fontWeight: 600, letterSpacing: '0.5px' }}>
                              FEE
                            </Typography>
                            <Typography sx={{ fontSize: '14px', color: '#f44336', fontWeight: 700 }}>
                              ₹{ev.fee}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>

                  </CardContent>
                </Box>
              </Card>
            ))}
          </Box>
          )}
        </Stack>
      )}


      {tab === 2 && (
        <Stack spacing={3}>
          {past.length === 0 && (
            <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
              <EventIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
              <Typography color="text.secondary" variant="body1">No past events.</Typography>
            </Paper>
          )}
          {past.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            {past.map((ev) => (
              <Card
                key={ev.id}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e8ecf0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: { xs: 'auto', md: '280px' } }}>
                  {/* Image Section */}
                  {ev.image && (
                    <Box
                      component="img"
                      src={ev.image}
                      alt={ev.title}
                      sx={{
                        width: { xs: '100%', md: '300px' },
                        height: { xs: '200px', md: '100%' },
                        objectFit: 'cover',
                        backgroundColor: '#f5f5f5',
                        flexShrink: 0,
                      }}
                    />
                  )}

                  {/* Content Section */}
                  <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    {/* Completed Badge */}
                    <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                      <Chip
                        label="✓ Completed"
                        size="small"
                        sx={{
                          backgroundColor: '#e8f5e9',
                          color: '#2e7d32',
                          fontWeight: 600,
                          fontSize: '12px',
                          border: '1px solid #c8e6c9',
                        }}
                      />
                    </Box>

                    {/* Date Badge */}
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        icon={<CalendarTodayIcon sx={{ fontSize: '16px !important' }} />}
                        label={`${ev.date}${ev.time ? ' at ' + ev.time + ' ' + ev.timeFormat : ''}`}
                        size="small"
                        sx={{
                          backgroundColor: '#f0f4ff',
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                          fontSize: '12px',
                          '& .MuiChip-icon': { color: theme.palette.primary.main }
                        }}
                      />
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: '#1a1a1a',
                        mb: 1.5,
                        fontSize: '20px',
                        lineHeight: 1.3,
                      }}
                    >
                      {ev.title}
                    </Typography>

                    {/* Description */}
                    {ev.description && (
                      <Typography
                        sx={{
                          color: '#666',
                          fontSize: '14px',
                          lineHeight: 1.5,
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {ev.description}
                      </Typography>
                    )}

                    {/* Details Grid */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, flex: 1 }}>
                      {/* Venue/Location */}
                      {ev.location && (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', minWidth: '200px' }}>
                          <LocationOnIcon sx={{ fontSize: '18px', color: theme.palette.primary.main, flexShrink: 0 }} />
                          <Box>
                            <Typography sx={{ fontSize: '11px', color: '#999', fontWeight: 600, letterSpacing: '0.5px' }}>
                              {ev.eventType === 'online' ? 'LINK' : 'VENUE'}
                            </Typography>
                            {ev.eventType === 'online' ? (
                              <Typography
                                component="a"
                                href={ev.location}
                                target="_blank"
                                rel="noopener"
                                sx={{
                                  fontSize: '13px',
                                  color: theme.palette.primary.main,
                                  textDecoration: 'none',
                                  fontWeight: 600,
                                  '&:hover': { textDecoration: 'underline' }
                                }}
                              >
                                View Recording
                              </Typography>
                            ) : (
                              <Typography sx={{ fontSize: '13px', color: '#2d2d2d', fontWeight: 600 }}>
                                {ev.location}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      )}

                      {/* Organizer */}
                      {ev.organizer && (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', minWidth: '200px' }}>
                          <PersonIcon sx={{ fontSize: '18px', color: '#ff9800', flexShrink: 0 }} />
                          <Box>
                            <Typography sx={{ fontSize: '11px', color: '#999', fontWeight: 600, letterSpacing: '0.5px' }}>
                              ORGANIZER
                            </Typography>
                            <Typography sx={{ fontSize: '13px', color: '#2d2d2d', fontWeight: 600 }}>
                              {ev.organizer}
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      {/* Fee */}
                      {ev.fee != null && ev.fee !== 0 && (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Box>
                            <Typography sx={{ fontSize: '11px', color: '#999', fontWeight: 600, letterSpacing: '0.5px' }}>
                              FEE
                            </Typography>
                            <Typography sx={{ fontSize: '14px', color: '#f44336', fontWeight: 700 }}>
                              ₹{ev.fee}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Box>
              </Card>
            ))}
          </Box>
          )}
        </Stack>
      )}
    </Box>
  );
};
export default Events;
