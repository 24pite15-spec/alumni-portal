import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  InputAdornment,
  Chip,
  Avatar,
} from "@mui/material";
import { eventsAPI, API_BASE_URL } from "../../api/config";
import { useTheme } from "@mui/material/styles";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/PersonOutline";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import LinkIcon from "@mui/icons-material/LinkOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

const Events = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [tab, setTab] = useState(() => {
    const saved = localStorage.getItem("activeEventTab");
    return saved !== null ? parseInt(saved) : 1;
  });

  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    location: "",
    date: "",
    time: "",
    timeFormat: "AM",
    organizer: "",
    email: "",
    eventType: "offline",
    meetingLink: "",
    fee: "",
    image: "",
    description: "",
  });

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── fetch events ──────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    eventsAPI
      .list()
      .then((data) => {
        const raw = Array.isArray(data) ? data : data.data || [];
        setEvents(raw.map(normalizeEvent));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events", err);
        setEvents([]);
        setLoading(false);
      });
  }, []);

  // ── persist tab ───────────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("activeEventTab", String(tab));
  }, [tab]);

  // ── form helpers ──────────────────────────────────────────────────────────
  const handleChange = (field) => (e) =>
    setForm((s) => ({ ...s, [field]: e.target.value }));

  const validateForm = () => {
    if (!form.title.trim() || !form.description.trim()) return false;
    if (!form.date || !form.time) return false;
    if (form.eventType === "offline" && !form.location.trim()) return false;
    if (form.eventType === "online" && !form.meetingLink.trim()) return false;
    return true;
  };

  // ── create event ──────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      // get logged-in user
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

      let imgPath = null;
      if (form.image && form.image.startsWith("data:")) {
        try {
          const res = await fetch(form.image);
          const blob = await res.blob();
          const fd = new FormData();
          fd.append("image", blob, "event-image");
          const uploadRes = await fetch(`${API_BASE_URL}/events/upload-image`, {
            method: "POST",
            body: fd,
          });
          if (!uploadRes.ok) {
            const errorData = await uploadRes.json();
            throw new Error(errorData.message || "Image upload failed");
          }
          const uploadData = await uploadRes.json();
          imgPath = uploadData.imagePath;
        } catch (uploadErr) {
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
        venue:
          form.eventType === "offline"
            ? form.location.trim()
            : form.meetingLink.trim(),
        organizer_name: form.organizer.trim() || null,
        organizer_email: form.email.trim() || null,
        invitation_image: imgPath || null,
        fee: form.fee ? Number(form.fee) : null,
        // ── NEW: store who posted this event ──
        posted_by_user_id: currentUser.userId || null,
        posted_by_name: currentUser.fullName || null,
      };

      const created = await eventsAPI.create(payload);
      setEvents((e) => [normalizeEvent(created), ...(Array.isArray(e) ? e : [])]);
      setForm({
        title: "",
        location: "",
        date: "",
        time: "",
        timeFormat: "AM",
        organizer: "",
        email: "",
        eventType: "offline",
        meetingLink: "",
        fee: "",
        image: "",
        description: "",
      });
      setTab(1);
    } catch (err) {
      console.error("Failed to create event", err);
      alert("Failed to create event. Please try again.");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setForm((s) => ({ ...s, image: ev.target?.result }));
      reader.readAsDataURL(file);
    }
  };

  // ── normalise backend → client model ─────────────────────────────────────
  const normalizeEvent = (ev) => {
    const dateStr = ev.event_date || ev.date;
    const date = dateStr ? dateStr.split("T")[0] : dateStr;
    const time = ev.event_time || ev.time;
    const timeFormat = ev.event_time_format || "AM";

    let imagePath = ev.invitation_image || ev.image;
    if (imagePath && !imagePath.startsWith("http")) {
      imagePath = `${API_BASE_URL}/${imagePath}`;
    }

    return {
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
      fee: ev.fee,
      image: imagePath,
      // ── NEW: posted-by fields ──
      postedByUserId: ev.posted_by_user_id || null,
      postedByName: ev.posted_by_name || null,
      when: `${date}${time ? " " + time + " " + timeFormat : ""}`,
    };
  };

  // ── date helpers ──────────────────────────────────────────────────────────
  const endOfDay = (ev) => {
    try {
      if (!ev.date) return new Date(0);
      const [y, m, d] = ev.date.split("-").map(Number);
      if (!y || !m || !d) return new Date(0);
      return new Date(y, m - 1, d, 23, 59, 59, 999);
    } catch {
      return new Date(0);
    }
  };

  const now = new Date();
  const upcoming = events
    .filter((ev) => endOfDay(ev) >= now)
    .sort((a, b) => {
      const diff = new Date(a.date) - new Date(b.date);
      return diff !== 0 ? diff : (a.time || "").localeCompare(b.time || "");
    });
  const past = events.filter((ev) => endOfDay(ev) < now);

  // ── shared field style ────────────────────────────────────────────────────
  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#ddd" },
      "&:hover fieldset": { borderColor: theme.palette.primary.main },
      "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
    },
    "& .MuiOutlinedInput-input": { color: "#000", fontWeight: 500 },
    "& .MuiInputLabel-root": { color: "#666" },
    "& .MuiInputLabel-root.Mui-focused": {
      color: theme.palette.primary.main,
    },
  };

  // ── Posted-By badge (clickable) ───────────────────────────────────────────
  const PostedByBadge = ({ userId, name }) => {
    if (!name) return null;
    const initials = name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const handleClick = () => {
      if (userId) {
        navigate(`/alumni/${userId}`);
      }
    };

    return (
      <Box
        onClick={userId ? handleClick : undefined}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          mt: "auto",
          px: 1.5,
          py: 0.8,
          borderRadius: "10px",
          border: `1.5px solid ${theme.palette.primary.main}22`,
          backgroundColor: "#f0f4ff",
          cursor: userId ? "pointer" : "default",
          transition: "all 0.2s ease",
          width: "fit-content",
          "&:hover": userId
            ? {
                backgroundColor: theme.palette.primary.main,
                "& *": { color: "#fff !important" },
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(104,121,227,0.25)",
              }
            : {},
        }}
      >
        <Avatar
          sx={{
            width: 26,
            height: 26,
            fontSize: "11px",
            fontWeight: 800,
            backgroundColor: theme.palette.primary.main,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {initials}
        </Avatar>
        <Box>
          <Typography
            sx={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#999",
              letterSpacing: "0.4px",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            Posted by
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 700,
                color: theme.palette.primary.main,
                lineHeight: 1.3,
              }}
            >
              {name}
            </Typography>
            {userId && (
              <OpenInNewIcon
                sx={{
                  fontSize: "12px",
                  color: theme.palette.primary.main,
                  mt: "1px",
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    );
  };

  // ── Event card (reused for upcoming & past) ───────────────────────────────
  const EventCard = ({ ev, isPast }) => (
    <Card
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: isPast
          ? "0 2px 8px rgba(0,0,0,0.05)"
          : "0 4px 12px rgba(0,0,0,0.08)",
        backgroundColor: "#fff",
        transition: "all 0.3s ease",
        border: "1px solid #e8ecf1",
        "&:hover": {
          boxShadow: isPast
            ? "0 8px 24px rgba(0,0,0,0.08)"
            : "0 12px 32px rgba(104,121,227,0.15)",
          transform: "translateY(-4px)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          minHeight: { xs: "auto", md: "280px" },
        }}
      >
        {/* Image */}
        {ev.image && (
          <Box
            component="img"
            src={ev.image}
            alt={ev.title}
            sx={{
              width: { xs: "100%", md: "300px" },
              height: { xs: "200px", md: "100%" },
              objectFit: "cover",
              backgroundColor: "#f0f4ff",
              flexShrink: 0,
            }}
          />
        )}

        {/* Content */}
        <CardContent
          sx={{
            p: 3,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Completed badge (past only) */}
          {isPast && (
            <Box sx={{ position: "absolute", top: 16, right: 16 }}>
              <Chip
                label="✓ Completed"
                size="small"
                sx={{
                  backgroundColor: "#e8f5e9",
                  color: "#2e7d32",
                  fontWeight: 600,
                  fontSize: "12px",
                  border: "1px solid #c8e6c9",
                }}
              />
            </Box>
          )}

          {/* Date chip */}
          <Box sx={{ mb: 2 }}>
            <Chip
              icon={
                <CalendarTodayIcon sx={{ fontSize: "16px !important" }} />
              }
              label={`${ev.date}${
                ev.time ? " at " + ev.time + " " + ev.timeFormat : ""
              }`}
              size="small"
              sx={{
                backgroundColor: "#f0f4ff",
                color: theme.palette.primary.main,
                fontWeight: 600,
                fontSize: "12px",
                "& .MuiChip-icon": { color: theme.palette.primary.main },
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: "#1a1a1a",
              mb: 1.5,
              fontSize: "20px",
              lineHeight: 1.3,
            }}
          >
            {ev.title}
          </Typography>

          {/* Description */}
          {ev.description && (
            <Typography
              sx={{
                color: "#666",
                fontSize: "14px",
                lineHeight: 1.5,
                mb: 2,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {ev.description}
            </Typography>
          )}

          {/* Details row */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
            {/* Venue / Link */}
            {ev.location && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  minWidth: "200px",
                }}
              >
                <LocationOnIcon
                  sx={{
                    fontSize: "18px",
                    color: theme.palette.primary.main,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#999",
                      fontWeight: 600,
                      letterSpacing: "0.5px",
                    }}
                  >
                    {ev.eventType === "online" ? "LINK" : "VENUE"}
                  </Typography>
                  {ev.eventType === "online" ? (
                    <Typography
                      component="a"
                      href={ev.location}
                      target="_blank"
                      rel="noopener"
                      sx={{
                        fontSize: "13px",
                        color: theme.palette.primary.main,
                        textDecoration: "none",
                        fontWeight: 600,
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      {isPast ? "View Recording" : "Join Now"}
                    </Typography>
                  ) : (
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "#2d2d2d",
                        fontWeight: 600,
                      }}
                    >
                      {ev.location}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}

            {/* Organizer */}
            {ev.organizer && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  minWidth: "200px",
                }}
              >
                <PersonIcon
                  sx={{ fontSize: "18px", color: "#ff9800", flexShrink: 0 }}
                />
                <Box>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#999",
                      fontWeight: 600,
                      letterSpacing: "0.5px",
                    }}
                  >
                    ORGANIZER
                  </Typography>
                  <Typography
                    sx={{ fontSize: "13px", color: "#2d2d2d", fontWeight: 600 }}
                  >
                    {ev.organizer}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Fee */}
            {ev.fee != null && ev.fee !== 0 && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#999",
                      fontWeight: 600,
                      letterSpacing: "0.5px",
                    }}
                  >
                    FEE
                  </Typography>
                  <Typography
                    sx={{ fontSize: "14px", color: "#f44336", fontWeight: 700 }}
                  >
                    ₹{ev.fee}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* ── Posted-by badge ── */}
          <PostedByBadge userId={ev.postedByUserId} name={ev.postedByName} />
        </CardContent>
      </Box>
    </Card>
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Box
      sx={{ p: { xs: 2, md: 3 }, minHeight: "100vh", backgroundColor: "#f5f7fa" }}
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={4}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#1a1a1a",
            }}
          >
            <EventIcon sx={{ color: theme.palette.primary.main }} />
            Events
          </Typography>
          <Typography variant="body2" sx={{ color: "#666", mt: 0.5 }}>
            Create and manage community events professionally.
          </Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper elevation={3} sx={{ borderRadius: 3, mb: 4, backgroundColor: "#fff" }}>
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          indicatorColor="none"
          textColor="inherit"
          variant="fullWidth"
          sx={{
            backgroundColor: theme.palette.primary.main,
            "& .MuiTab-root": {
              color: "#ffffff",
              fontWeight: 600,
              fontSize: { xs: "13px", md: "14px" },
              transition: "all 0.2s ease",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
            },
            "& .Mui-selected": {
              backgroundColor: "rgba(255,255,255,0.2)",
              borderBottom: "3px solid #fff",
            },
          }}
        >
          <Tab label="Create Event" />
          <Tab label={`Upcoming (${upcoming.length})`} />
          <Tab label={`Past (${past.length})`} />
        </Tabs>
      </Paper>

      {/* ── CREATE EVENT TAB ── */}
      {tab === 0 && (
        <Paper
          elevation={4}
          sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, backgroundColor: "#fff" }}
        >
          <Typography
            fontWeight={700}
            mb={4}
            sx={{ color: "#1a1a1a", fontSize: { xs: "20px", md: "24px" } }}
          >
            Create New Event
          </Typography>
          <Stack spacing={3}>
            {/* Event Name */}
            <TextField
              label="Event Name"
              fullWidth
              placeholder="e.g., Alumni Reunion 2026"
              value={form.title}
              onChange={handleChange("title")}
              sx={fieldSx}
            />

            {/* Description */}
            <TextField
              label="Event Description"
              multiline
              rows={4}
              fullWidth
              placeholder="Describe the event details, agenda, and any other important information..."
              value={form.description}
              onChange={handleChange("description")}
              sx={fieldSx}
            />

            {/* Date */}
            <TextField
              label="Event Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={form.date}
              onChange={handleChange("date")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon
                      sx={{
                        color: theme.palette.primary.main,
                        fontSize: "22px",
                      }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={fieldSx}
            />

            {/* Time + AM/PM */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
              <TextField
                label="Event Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={form.time}
                onChange={handleChange("time")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon
                        sx={{
                          color: theme.palette.primary.main,
                          fontSize: "22px",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: 1, ...fieldSx }}
              />
              <ToggleButtonGroup
                value={form.timeFormat}
                exclusive
                onChange={(e, val) =>
                  val && setForm((s) => ({ ...s, timeFormat: val }))
                }
                sx={{
                  mt: 1,
                  "& .MuiToggleButton-root": {
                    color: "#666",
                    borderColor: "#ddd",
                    fontWeight: 700,
                    fontSize: "14px",
                    px: 2,
                    py: 1.2,
                    textTransform: "none",
                    transition: "all 0.3s ease",
                    backgroundColor: "#f8f9fa",
                    "&:hover": {
                      backgroundColor: "#e8ecf5",
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                    },
                  },
                  "& .MuiToggleButton-root.Mui-selected": {
                    backgroundColor: theme.palette.primary.main,
                    color: "#fff",
                    borderColor: theme.palette.primary.main,
                    boxShadow: "0 4px 12px rgba(104,121,227,0.3)",
                    "&:hover": { backgroundColor: "#4a5bbf" },
                  },
                }}
              >
                <ToggleButton value="AM">AM</ToggleButton>
                <ToggleButton value="PM">PM</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Event Format */}
            <Box>
              <Typography
                fontWeight={600}
                mb={1.5}
                sx={{ fontSize: "14px", color: "#1a1a1a" }}
              >
                Event Format
              </Typography>
              <ToggleButtonGroup
                value={form.eventType}
                exclusive
                onChange={(e, val) =>
                  val && setForm((s) => ({ ...s, eventType: val }))
                }
                fullWidth
                sx={{
                  "& .MuiToggleButton-root": {
                    color: "#666",
                    borderColor: "#ddd",
                    fontWeight: 700,
                    fontSize: "15px",
                    py: 1.4,
                    flex: 1,
                    textTransform: "none",
                    transition: "all 0.3s ease",
                    backgroundColor: "#f8f9fa",
                    "&:hover": {
                      backgroundColor: "#e8ecf5",
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 8px rgba(104,121,227,0.2)",
                    },
                  },
                  "& .MuiToggleButton-root.Mui-selected": {
                    backgroundColor: theme.palette.primary.main,
                    color: "#fff",
                    borderColor: theme.palette.primary.main,
                    boxShadow: "0 4px 12px rgba(104,121,227,0.3)",
                    "&:hover": {
                      backgroundColor: "#4a5bbf",
                      boxShadow: "0 6px 16px rgba(104,121,227,0.4)",
                    },
                  },
                }}
              >
                <ToggleButton value="offline">📍 Offline</ToggleButton>
                <ToggleButton value="online">🔗 Online</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Venue / Meeting Link */}
            {form.eventType === "offline" && (
              <TextField
                label="Venue / Location"
                fullWidth
                placeholder="e.g., Hotel Grand, Mumbai"
                value={form.location}
                onChange={handleChange("location")}
                InputProps={{
                  startAdornment: (
                    <LocationOnIcon
                      sx={{ mr: 1, color: theme.palette.primary.main }}
                    />
                  ),
                }}
                sx={fieldSx}
              />
            )}
            {form.eventType === "online" && (
              <TextField
                label="Meeting Link"
                fullWidth
                placeholder="e.g., https://zoom.us/..."
                value={form.meetingLink}
                onChange={handleChange("meetingLink")}
                InputProps={{
                  startAdornment: (
                    <LinkIcon
                      sx={{ mr: 1, color: theme.palette.primary.main }}
                    />
                  ),
                }}
                sx={fieldSx}
              />
            )}

            {/* Organizer Name */}
            <TextField
              label="Organizer Name"
              fullWidth
              placeholder="Your name"
              value={form.organizer}
              onChange={handleChange("organizer")}
              InputProps={{
                startAdornment: (
                  <PersonIcon
                    sx={{ mr: 1, color: theme.palette.primary.main }}
                  />
                ),
              }}
              sx={fieldSx}
            />

            {/* Organizer Email */}
            <TextField
              label="Organizer Email"
              type="email"
              fullWidth
              placeholder="organizer@example.com"
              value={form.email}
              onChange={handleChange("email")}
              InputProps={{
                startAdornment: (
                  <EmailIcon
                    sx={{ mr: 1, color: theme.palette.primary.main }}
                  />
                ),
              }}
              sx={fieldSx}
            />

            {/* Fee */}
            <TextField
              label="Fee (INR, optional)"
              type="number"
              fullWidth
              placeholder="e.g., 500 (₹)"
              value={form.fee}
              onChange={handleChange("fee")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
              sx={fieldSx}
            />

            {/* Invitation Image */}
            <Box>
              <Typography
                fontWeight={600}
                mb={2}
                sx={{ fontSize: "14px", color: "#1a1a1a" }}
              >
                Invitation Image (Optional)
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => fileInputRef.current?.click()}
                startIcon={<PhotoCameraIcon />}
                sx={{
                  color: "#fff",
                  backgroundColor: theme.palette.primary.main,
                  fontWeight: 600,
                  py: 1.2,
                  mb: 2,
                  "&:hover": {
                    backgroundColor: "rgba(104,121,227,0.9)",
                  },
                }}
              >
                Upload Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              {form.image && (
                <Box
                  component="img"
                  src={form.image}
                  alt="preview"
                  sx={{
                    width: "100%",
                    maxHeight: "250px",
                    borderRadius: 2,
                    objectFit: "cover",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
              )}
            </Box>

            {/* Submit */}
            <Button
              onClick={handleCreate}
              variant="contained"
              disabled={!validateForm()}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: "#fff",
                fontWeight: 700,
                py: 1.8,
                fontSize: "16px",
                borderRadius: 1.5,
                transition: "all 0.3s",
                mt: 2,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark || "#4a5bbf",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 12px rgba(104,121,227,0.3)",
                },
                "&:disabled": { backgroundColor: "#ccc", color: "#999" },
              }}
            >
              Create Event
            </Button>
          </Stack>
        </Paper>
      )}

      {/* ── UPCOMING TAB ── */}
      {tab === 1 && (
        <Stack spacing={3}>
          {loading && (
            <Paper sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
              <Typography color="text.secondary">Loading events...</Typography>
            </Paper>
          )}
          {!loading && upcoming.length === 0 && (
            <Paper sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
              <EventIcon sx={{ fontSize: 48, color: "#ccc", mb: 2 }} />
              <Typography color="text.secondary" variant="body1">
                No upcoming events.
              </Typography>
            </Paper>
          )}
          {!loading &&
            upcoming.map((ev) => (
              <EventCard key={ev.id} ev={ev} isPast={false} />
            ))}
        </Stack>
      )}

      {/* ── PAST TAB ── */}
      {tab === 2 && (
        <Stack spacing={3}>
          {past.length === 0 && (
            <Paper sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
              <EventIcon sx={{ fontSize: 48, color: "#ccc", mb: 2 }} />
              <Typography color="text.secondary" variant="body1">
                No past events.
              </Typography>
            </Paper>
          )}
          {past.map((ev) => (
            <EventCard key={ev.id} ev={ev} isPast={true} />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default Events;
