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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

/* ─────────────────────────────────────────────────────────────────
   VALIDATION RULES
───────────────────────────────────────────────────────────────── */
const VALIDATORS = {
  title: (v) => {
    if (!v.trim()) return "Event name is required";
    if (v.trim().length < 3) return "Must be at least 3 characters";
    if (v.trim().length > 100) return "Must be under 100 characters";
    return "";
  },
  description: (v) => {
    if (!v.trim()) return "Description is required";
    if (v.trim().length < 20) return "Please write at least 20 characters";
    if (v.trim().length > 1000) return "Must be under 1000 characters";
    return "";
  },
  date: (v) => {
    if (!v) return "Event date is required";
    const selected = new Date(v);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) return "Date cannot be in the past";
    return "";
  },
  time: (v) => {
    if (!v) return "Event time is required";
    return "";
  },
  location: (v) => {
    if (!v.trim()) return "Venue / location is required";
    if (v.trim().length < 3) return "Please enter a valid venue";
    return "";
  },
  meetingLink: (v) => {
    if (!v.trim()) return "Meeting link is required";
    try { new URL(v.trim()); return ""; } catch { return "Please enter a valid URL (e.g. https://zoom.us/...)"; }
  },
  organizer: (v) => {
    if (v.trim() && v.trim().length < 2) return "Name must be at least 2 characters";
    return "";
  },
  email: (v) => {
    if (!v.trim()) return "";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(v.trim())) return "Please enter a valid email address";
    return "";
  },
  fee: (v) => {
    if (!v) return "";
    if (isNaN(Number(v)) || Number(v) < 0) return "Fee must be a positive number";
    if (Number(v) > 100000) return "Fee seems too high — double check";
    return "";
  },
};

/* ─────────────────────────────────────────────────────────────────
   FIELD WRAPPER — label + input + helper/error + char count
───────────────────────────────────────────────────────────────── */
const FieldWrapper = ({ label, required, error, hint, charCount, maxChars, children }) => (
  <Box>
    {/* label row */}
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.7 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#334155", letterSpacing: "0.1px" }}>
        {label}
        {required && <Box component="span" sx={{ color: "#ef4444", ml: 0.4 }}>*</Box>}
      </Typography>
      {maxChars && (
        <Typography sx={{ fontSize: 11, fontWeight: 600, color: charCount > maxChars ? "#ef4444" : "#94a3b8" }}>
          {charCount}/{maxChars}
        </Typography>
      )}
    </Box>

    {/* input */}
    {children}

    {/* error or hint */}
    {error ? (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.6 }}>
        <ErrorOutlineIcon sx={{ fontSize: 13, color: "#ef4444" }} />
        <Typography sx={{ fontSize: 12, color: "#ef4444", fontWeight: 600 }}>{error}</Typography>
      </Box>
    ) : hint ? (
      <Typography sx={{ fontSize: 12, color: "#94a3b8", mt: 0.6, ml: 0.2 }}>{hint}</Typography>
    ) : null}
  </Box>
);

/* ─────────────────────────────────────────────────────────────────
   SECTION HEADER — divides the form into sections
───────────────────────────────────────────────────────────────── */
const SectionHeader = ({ number, title, subtitle }) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.8, pt: 1 }}>
    <Box sx={{
      width: 30, height: 30, borderRadius: "9px", flexShrink: 0,
      background: "linear-gradient(135deg,#667eea,#764ba2)",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 4px 12px rgba(102,126,234,0.3)",
    }}>
      <Typography sx={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>{number}</Typography>
    </Box>
    <Box>
      <Typography sx={{ fontSize: 15, fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>{title}</Typography>
      {subtitle && <Typography sx={{ fontSize: 12, color: "#94a3b8", mt: 0.3 }}>{subtitle}</Typography>}
    </Box>
  </Box>
);

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
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

  // per-field touched state — only show errors after user interacts
  const [touched, setTouched] = useState({});
  // submission attempted flag — shows all errors at once on submit click
  const [submitAttempted, setSubmitAttempted] = useState(false);

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
  const handleChange = (field) => (e) => {
    setForm((s) => ({ ...s, [field]: e.target.value }));
    setTouched((t) => ({ ...t, [field]: true }));
  };

  const handleBlur = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

  // get error for a field — only show if touched or submit attempted
  const getError = (field, value) => {
    if (!touched[field] && !submitAttempted) return "";
    if (!VALIDATORS[field]) return "";
    return VALIDATORS[field](value);
  };

  // ── original validateForm (unchanged) ────────────────────────────────────
  const validateForm = () => {
    if (!form.title.trim() || !form.description.trim()) return false;
    if (!form.date || !form.time) return false;
    if (form.eventType === "offline" && !form.location.trim()) return false;
    if (form.eventType === "online" && !form.meetingLink.trim()) return false;
    return true;
  };

  // check if ALL fields pass validation (for the submit button)
  const isFormValid = () => {
    if (VALIDATORS.title(form.title)) return false;
    if (VALIDATORS.description(form.description)) return false;
    if (VALIDATORS.date(form.date)) return false;
    if (VALIDATORS.time(form.time)) return false;
    if (form.eventType === "offline" && VALIDATORS.location(form.location)) return false;
    if (form.eventType === "online" && VALIDATORS.meetingLink(form.meetingLink)) return false;
    if (form.organizer && VALIDATORS.organizer(form.organizer)) return false;
    if (form.email && VALIDATORS.email(form.email)) return false;
    if (form.fee && VALIDATORS.fee(form.fee)) return false;
    return true;
  };

  // ── create event ──────────────────────────────────────────────────────────
  const handleCreate = async () => {
    setSubmitAttempted(true);
    if (!validateForm() || !isFormValid()) return;

    try {
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
        posted_by_user_id: currentUser.userId || null,
        posted_by_name: currentUser.fullName || null,
      };

      const created = await eventsAPI.create(payload);
      setEvents((e) => [normalizeEvent(created), ...(Array.isArray(e) ? e : [])]);
      setForm({
        title: "", location: "", date: "", time: "", timeFormat: "AM",
        organizer: "", email: "", eventType: "offline",
        meetingLink: "", fee: "", image: "", description: "",
      });
      setTouched({});
      setSubmitAttempted(false);
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
      reader.onload = (ev) => setForm((s) => ({ ...s, image: ev.target?.result }));
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
    if (imagePath && !imagePath.startsWith("http")) imagePath = `${API_BASE_URL}/${imagePath}`;
    return {
      id: ev.id,
      title: ev.event_name || ev.title,
      description: ev.event_description || ev.description,
      date, time, timeFormat,
      eventType: ev.event_format || ev.eventType,
      location: ev.venue || ev.location,
      organizer: ev.organizer_name || ev.organizer,
      email: ev.organizer_email || ev.email,
      fee: ev.fee,
      image: imagePath,
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
    } catch { return new Date(0); }
  };

  const now = new Date();
  const upcoming = events
    .filter((ev) => endOfDay(ev) >= now)
    .sort((a, b) => {
      const diff = new Date(a.date) - new Date(b.date);
      return diff !== 0 ? diff : (a.time || "").localeCompare(b.time || "");
    });
  const past = events.filter((ev) => endOfDay(ev) < now);

  // ── shared input sx ───────────────────────────────────────────────────────
  const inputSx = (hasError) => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#fafbff",
      transition: "all 0.2s ease",
      "& fieldset": { borderColor: hasError ? "#ef4444" : "#e8eaf6", borderWidth: hasError ? "2px" : "1.5px" },
      "&:hover fieldset": { borderColor: hasError ? "#dc2626" : "#667eea" },
      "&.Mui-focused fieldset": { borderColor: hasError ? "#dc2626" : "#667eea", borderWidth: "2px" },
      "&.Mui-focused": { backgroundColor: "#ffffff", boxShadow: hasError ? "0 0 0 4px rgba(239,68,68,0.08)" : "0 0 0 4px rgba(102,126,234,0.08)" },
    },
    "& .MuiOutlinedInput-input": { color: "#0f172a", fontWeight: 500, fontSize: "14px" },
    "& .MuiInputBase-inputMultiline": { color: "#0f172a", fontWeight: 500, fontSize: "14px" },
  });

  // ── Posted-By badge ───────────────────────────────────────────────────────
  const PostedByBadge = ({ userId, name }) => {
    if (!name) return null;
    const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
    return (
      <Box
        onClick={userId ? () => navigate(`/alumni/${userId}`) : undefined}
        sx={{
          display: "inline-flex", alignItems: "center", gap: 1, mt: "auto",
          px: 1.5, py: 0.8, borderRadius: "10px",
          border: `1.5px solid ${theme.palette.primary.main}22`,
          backgroundColor: "#f0f4ff", cursor: userId ? "pointer" : "default",
          transition: "all 0.2s ease", width: "fit-content",
          "&:hover": userId ? {
            backgroundColor: theme.palette.primary.main,
            "& *": { color: "#fff !important" },
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(104,121,227,0.25)",
          } : {},
        }}
      >
        <Avatar sx={{ width: 26, height: 26, fontSize: "11px", fontWeight: 800, backgroundColor: theme.palette.primary.main, color: "#fff", flexShrink: 0 }}>
          {initials}
        </Avatar>
        <Box>
          <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#999", letterSpacing: "0.4px", textTransform: "uppercase", lineHeight: 1 }}>
            Posted by
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
            <Typography sx={{ fontSize: "13px", fontWeight: 700, color: theme.palette.primary.main, lineHeight: 1.3 }}>
              {name}
            </Typography>
            {userId && <OpenInNewIcon sx={{ fontSize: "12px", color: theme.palette.primary.main, mt: "1px" }} />}
          </Box>
        </Box>
      </Box>
    );
  };

  // ── Event Card ────────────────────────────────────────────────────────────
  const EventCard = ({ ev, isPast }) => (
    <Card sx={{
      borderRadius: "20px", overflow: "hidden", backgroundColor: "#ffffff",
      border: isPast ? "1.5px solid #f1f5f9" : "1.5px solid #e8eaf6",
      boxShadow: isPast ? "0 2px 12px rgba(0,0,0,0.04)" : "0 4px 20px rgba(102,121,227,0.08)",
      transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
      "&:hover": {
        boxShadow: isPast ? "0 8px 28px rgba(0,0,0,0.08)" : "0 16px 48px rgba(102,121,227,0.18)",
        transform: "translateY(-5px)", borderColor: isPast ? "#e2e8f0" : theme.palette.primary.main,
      },
    }}>
      <Box sx={{ height: 4, background: isPast ? "linear-gradient(90deg,#94a3b8,#cbd5e1)" : "linear-gradient(90deg,#667eea,#764ba2)" }} />
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, minHeight: { xs: "auto", md: "270px" } }}>
        {ev.image && (
          <Box sx={{ position: "relative", width: { xs: "100%", md: "280px" }, flexShrink: 0 }}>
            <Box component="img" src={ev.image} alt={ev.title}
              sx={{ width: "100%", height: { xs: "200px", md: "100%" }, objectFit: "cover", display: "block", filter: isPast ? "grayscale(30%)" : "none" }} />
            <Box sx={{ position: "absolute", top: 12, left: 12, px: 1.4, py: 0.5, borderRadius: "8px", backgroundColor: "#1e293b", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                {ev.eventType === "online" ? "🔗 Online" : "📍 Offline"}
              </Typography>
            </Box>
          </Box>
        )}
        <CardContent sx={{ p: { xs: 2.5, md: 3 }, flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
          <Box sx={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 1 }}>
            {!ev.image && <Chip label={ev.eventType === "online" ? "🔗 Online" : "📍 Offline"} size="small" sx={{ backgroundColor: "#f0f4ff", color: theme.palette.primary.main, fontWeight: 700, fontSize: "11px", border: `1px solid ${theme.palette.primary.main}33` }} />}
            {isPast && <Chip label="✓ Completed" size="small" sx={{ backgroundColor: "#f0fdf4", color: "#15803d", fontWeight: 700, fontSize: "11px", border: "1px solid #bbf7d0" }} />}
          </Box>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.8, px: 1.5, py: 0.6, borderRadius: "8px", backgroundColor: isPast ? "#f8fafc" : "#f0f4ff", border: `1px solid ${isPast ? "#e2e8f0" : "#dde4ff"}`, mb: 1.8, width: "fit-content" }}>
            <CalendarTodayIcon sx={{ fontSize: 13, color: isPast ? "#94a3b8" : theme.palette.primary.main }} />
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: isPast ? "#64748b" : theme.palette.primary.main }}>
              {ev.date}{ev.time ? ` · ${ev.time} ${ev.timeFormat}` : ""}
            </Typography>
          </Box>
          <Typography sx={{ fontWeight: 800, color: isPast ? "#64748b" : "#0f172a", mb: 1.2, fontSize: { xs: "18px", md: "20px" }, lineHeight: 1.3, pr: { md: "100px" } }}>
            {ev.title}
          </Typography>
          {ev.description && (
            <Typography sx={{ color: "#64748b", fontSize: "14px", lineHeight: 1.65, mb: 2, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {ev.description}
            </Typography>
          )}
          <Box sx={{ height: "1px", backgroundColor: "#f1f5f9", mb: 2 }} />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2.5, mb: 2 }}>
            {ev.location && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start", minWidth: "180px" }}>
                <Box sx={{ width: 32, height: 32, borderRadius: "9px", backgroundColor: "#f0f4ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <LocationOnIcon sx={{ fontSize: 17, color: theme.palette.primary.main }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "10px", color: "#94a3b8", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", mb: 0.2 }}>
                    {ev.eventType === "online" ? "Link" : "Venue"}
                  </Typography>
                  {ev.eventType === "online" ? (
                    <Typography component="a" href={ev.location} target="_blank" rel="noopener"
                      sx={{ fontSize: "13px", color: theme.palette.primary.main, textDecoration: "none", fontWeight: 700, "&:hover": { textDecoration: "underline" } }}>
                      {isPast ? "View Recording" : "Join Now →"}
                    </Typography>
                  ) : (
                    <Typography sx={{ fontSize: "13px", color: "#334155", fontWeight: 600 }}>{ev.location}</Typography>
                  )}
                </Box>
              </Box>
            )}
            {ev.organizer && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start", minWidth: "160px" }}>
                <Box sx={{ width: 32, height: 32, borderRadius: "9px", backgroundColor: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <PersonIcon sx={{ fontSize: 17, color: "#f97316" }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "10px", color: "#94a3b8", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", mb: 0.2 }}>Organizer</Typography>
                  <Typography sx={{ fontSize: "13px", color: "#334155", fontWeight: 600 }}>{ev.organizer}</Typography>
                </Box>
              </Box>
            )}
            {ev.fee != null && ev.fee !== 0 && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                <Box sx={{ width: 32, height: 32, borderRadius: "9px", backgroundColor: "#fff5f5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 800, color: "#ef4444" }}>₹</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "10px", color: "#94a3b8", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", mb: 0.2 }}>Fee</Typography>
                  <Typography sx={{ fontSize: "14px", color: "#ef4444", fontWeight: 800 }}>₹{ev.fee}</Typography>
                </Box>
              </Box>
            )}
          </Box>
          <PostedByBadge userId={ev.postedByUserId} name={ev.postedByName} />
        </CardContent>
      </Box>
    </Card>
  );

  // ─── count required errors for summary ───────────────────────────────────
  const requiredErrors = submitAttempted ? [
    VALIDATORS.title(form.title),
    VALIDATORS.description(form.description),
    VALIDATORS.date(form.date),
    VALIDATORS.time(form.time),
    form.eventType === "offline" ? VALIDATORS.location(form.location) : VALIDATORS.meetingLink(form.meetingLink),
  ].filter(Boolean).length : 0;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh", background: "linear-gradient(135deg,#f5f7fa 0%,#e8ecf8 100%)" }}>

      {/* ── Page Header ── */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{
          width: 46, height: 46, borderRadius: "13px",
          background: "linear-gradient(135deg,#667eea,#764ba2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 6px 18px rgba(102,126,234,0.35)",
        }}>
          <EventIcon sx={{ fontSize: 24, color: "#fff" }} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
            Events
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#64748b", fontWeight: 500, mt: 0.3 }}>
            Create and manage community events professionally
          </Typography>
        </Box>
      </Box>

      {/* ── Tab Bar ── */}
      <Paper elevation={0} sx={{ borderRadius: "16px", mb: 4, overflow: "hidden", border: "1.5px solid #e8eaf6", boxShadow: "0 4px 20px rgba(102,126,234,0.1)" }}>
        <Tabs
          value={tab} onChange={(e, v) => setTab(v)}
          indicatorColor="none" textColor="inherit" variant="fullWidth"
          sx={{
            background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)", minHeight: 52,
            "& .MuiTab-root": {
              color: "rgba(255,255,255,0.75)", fontWeight: 700, fontSize: { xs: "13px", md: "14px" },
              minHeight: 52, letterSpacing: "0.2px", transition: "all 0.2s ease", textTransform: "none",
              "&:hover": { color: "#fff", backgroundColor: "rgba(255,255,255,0.1)" },
            },
            "& .Mui-selected": { color: "#ffffff !important", backgroundColor: "rgba(255,255,255,0.18)", borderBottom: "3px solid rgba(255,255,255,0.9)" },
          }}
        >
          <Tab label="✨ Create Event" />
          <Tab label={`📅 Upcoming (${upcoming.length})`} />
          <Tab label={`🕐 Past (${past.length})`} />
        </Tabs>
      </Paper>

      {/* ══════════════════════════════════════════════════════
          CREATE EVENT FORM
      ══════════════════════════════════════════════════════ */}
      {tab === 0 && (
        <Paper elevation={0} sx={{
          borderRadius: "20px", backgroundColor: "#ffffff",
          border: "1.5px solid #e8eaf6",
          boxShadow: "0 8px 40px rgba(102,126,234,0.08)",
          overflow: "hidden",
        }}>
          {/* Form header */}
          <Box sx={{
            px: { xs: 3, md: 5 }, py: 3,
            background: "linear-gradient(135deg,#f8f9ff 0%,#f0f4ff 100%)",
            borderBottom: "1.5px solid #e8eaf6",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2,
          }}>
            <Box>
              <Typography sx={{ fontSize: { xs: "18px", md: "22px" }, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.3px" }}>
                Create New Event
              </Typography>
              <Typography sx={{ fontSize: 13, color: "#64748b", fontWeight: 500, mt: 0.4 }}>
                Fields marked <Box component="span" sx={{ color: "#ef4444", fontWeight: 700 }}>*</Box> are required
              </Typography>
            </Box>
            {/* progress indicator */}
            {(() => {
              const filled = [
                form.title.trim() && !VALIDATORS.title(form.title),
                form.description.trim() && !VALIDATORS.description(form.description),
                form.date && !VALIDATORS.date(form.date),
                form.time,
                form.eventType === "offline"
                  ? (form.location.trim() && !VALIDATORS.location(form.location))
                  : (form.meetingLink.trim() && !VALIDATORS.meetingLink(form.meetingLink)),
              ].filter(Boolean).length;
              const total = 5;
              const pct = Math.round((filled / total) * 100);
              return (
                <Box sx={{ textAlign: "right" }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", mb: 0.8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Form Progress
                  </Typography>
                  <Box sx={{ width: 140, height: 6, backgroundColor: "#e8eaf6", borderRadius: "3px", overflow: "hidden" }}>
                    <Box sx={{
                      width: `${pct}%`, height: "100%", borderRadius: "3px",
                      background: pct === 100 ? "linear-gradient(90deg,#22c55e,#4ade80)" : "linear-gradient(90deg,#667eea,#764ba2)",
                      transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
                    }} />
                  </Box>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: pct === 100 ? "#15803d" : "#667eea", mt: 0.6 }}>
                    {pct}% complete
                  </Typography>
                </Box>
              );
            })()}
          </Box>

          {/* error summary banner */}
          {submitAttempted && requiredErrors > 0 && (
            <Box sx={{ mx: { xs: 3, md: 5 }, mt: 3, p: 2, backgroundColor: "#fff5f5", borderRadius: "12px", border: "1.5px solid #fecaca", display: "flex", alignItems: "center", gap: 1.5 }}>
              <ErrorOutlineIcon sx={{ fontSize: 20, color: "#ef4444", flexShrink: 0 }} />
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#dc2626" }}>
                Please fix {requiredErrors} required field{requiredErrors > 1 ? "s" : ""} before submitting.
              </Typography>
            </Box>
          )}

          <Box sx={{ px: { xs: 3, md: 5 }, py: 4 }}>
            <Stack spacing={4}>

              {/* ── SECTION 1: Basic Info ── */}
              <SectionHeader number="1" title="Basic Information" subtitle="Event name and description" />

              <Box sx={{ pl: { md: 5.5 } }}>
                <Stack spacing={3}>

                  {/* Event Name */}
                  <FieldWrapper
                    label="Event Name" required
                    error={getError("title", form.title)}
                    hint="Give your event a clear, descriptive name"
                    charCount={form.title.length} maxChars={100}
                  >
                    <TextField
                      fullWidth
                      placeholder="e.g., Alumni Reunion 2026"
                      value={form.title}
                      onChange={handleChange("title")}
                      onBlur={handleBlur("title")}
                      sx={inputSx(!!getError("title", form.title))}
                    />
                  </FieldWrapper>

                  {/* Description */}
                  <FieldWrapper
                    label="Event Description" required
                    error={getError("description", form.description)}
                    hint="Describe the agenda, activities, and what attendees can expect"
                    charCount={form.description.length} maxChars={1000}
                  >
                    <TextField
                      fullWidth multiline rows={4}
                      placeholder="Describe the event details, agenda, and any other important information..."
                      value={form.description}
                      onChange={handleChange("description")}
                      onBlur={handleBlur("description")}
                      sx={inputSx(!!getError("description", form.description))}
                    />
                  </FieldWrapper>

                </Stack>
              </Box>

              {/* divider */}
              <Box sx={{ height: "1.5px", background: "linear-gradient(90deg,transparent,#e8eaf6,transparent)" }} />

              {/* ── SECTION 2: Date & Time ── */}
              <SectionHeader number="2" title="Date & Time" subtitle="When will this event take place?" />

              <Box sx={{ pl: { md: 5.5 } }}>
                {/* Date and Time on same row */}
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>

                  {/* Date */}
                  <FieldWrapper label="Event Date" required error={getError("date", form.date)}>
                    <TextField
                      type="date" fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={form.date}
                      onChange={handleChange("date")}
                      onBlur={handleBlur("date")}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarTodayIcon sx={{ color: getError("date", form.date) ? "#ef4444" : theme.palette.primary.main, fontSize: "18px" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputSx(!!getError("date", form.date))}
                    />
                  </FieldWrapper>

                  {/* Time + AM/PM */}
                  <FieldWrapper label="Event Time" required error={getError("time", form.time)}>
                    <Box sx={{ display: "flex", gap: 1.5 }}>
                      <TextField
                        type="time" fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={form.time}
                        onChange={handleChange("time")}
                        onBlur={handleBlur("time")}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccessTimeIcon sx={{ color: getError("time", form.time) ? "#ef4444" : theme.palette.primary.main, fontSize: "18px" }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ flex: 1, ...inputSx(!!getError("time", form.time)) }}
                      />
                      <ToggleButtonGroup
                        value={form.timeFormat} exclusive
                        onChange={(e, val) => val && setForm((s) => ({ ...s, timeFormat: val }))}
                        sx={{
                          height: 48, alignSelf: "flex-start",
                          "& .MuiToggleButton-root": {
                            color: "#64748b", borderColor: "#e8eaf6", fontWeight: 700, fontSize: "13px",
                            px: 1.8, textTransform: "none", borderRadius: "10px !important",
                            backgroundColor: "#fafbff", transition: "all 0.2s ease",
                            "&:hover": { backgroundColor: "#f0f4ff", borderColor: "#667eea", color: "#667eea" },
                          },
                          "& .MuiToggleButton-root.Mui-selected": {
                            backgroundColor: "#667eea", color: "#fff", borderColor: "#667eea",
                            boxShadow: "0 4px 12px rgba(104,121,227,0.35)",
                            "&:hover": { backgroundColor: "#5a6fd6" },
                          },
                        }}
                      >
                        <ToggleButton value="AM">AM</ToggleButton>
                        <ToggleButton value="PM">PM</ToggleButton>
                      </ToggleButtonGroup>
                    </Box>
                  </FieldWrapper>

                </Box>
              </Box>

              {/* divider */}
              <Box sx={{ height: "1.5px", background: "linear-gradient(90deg,transparent,#e8eaf6,transparent)" }} />

              {/* ── SECTION 3: Format & Venue ── */}
              <SectionHeader number="3" title="Format & Location" subtitle="How and where is this event happening?" />

              <Box sx={{ pl: { md: 5.5 } }}>
                <Stack spacing={3}>

                  {/* Event Format toggle */}
                  <FieldWrapper label="Event Format" required hint="Choose whether attendees join in person or online">
                    <ToggleButtonGroup
                      value={form.eventType} exclusive fullWidth
                      onChange={(e, val) => val && setForm((s) => ({ ...s, eventType: val }))}
                      sx={{
                        "& .MuiToggleButton-root": {
                          color: "#64748b", borderColor: "#e8eaf6", fontWeight: 700, fontSize: "14px",
                          py: 1.4, flex: 1, textTransform: "none", borderRadius: "12px !important",
                          backgroundColor: "#fafbff", transition: "all 0.25s ease",
                          "&:hover": { backgroundColor: "#f0f4ff", borderColor: "#667eea", color: "#667eea", transform: "translateY(-1px)" },
                        },
                        "& .MuiToggleButton-root.Mui-selected": {
                          background: "linear-gradient(135deg,#667eea,#764ba2)",
                          color: "#fff", borderColor: "#667eea",
                          boxShadow: "0 6px 18px rgba(104,121,227,0.35)",
                          "&:hover": { background: "linear-gradient(135deg,#5a6fd6,#6b3fa0)" },
                        },
                      }}
                    >
                      <ToggleButton value="offline">📍 Offline — In Person</ToggleButton>
                      <ToggleButton value="online">🔗 Online — Virtual</ToggleButton>
                    </ToggleButtonGroup>
                  </FieldWrapper>

                  {/* Venue / Meeting Link */}
                  {form.eventType === "offline" ? (
                    <FieldWrapper
                      label="Venue / Location" required
                      error={getError("location", form.location)}
                      hint="Full address or location name"
                    >
                      <TextField
                        fullWidth
                        placeholder="e.g., Hotel Grand Ballroom, Mumbai"
                        value={form.location}
                        onChange={handleChange("location")}
                        onBlur={handleBlur("location")}
                        InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon sx={{ color: getError("location", form.location) ? "#ef4444" : theme.palette.primary.main, fontSize: "20px" }} /></InputAdornment> }}
                        sx={inputSx(!!getError("location", form.location))}
                      />
                    </FieldWrapper>
                  ) : (
                    <FieldWrapper
                      label="Meeting Link" required
                      error={getError("meetingLink", form.meetingLink)}
                      hint="Zoom, Google Meet, Microsoft Teams or any other video conferencing URL"
                    >
                      <TextField
                        fullWidth
                        placeholder="https://zoom.us/j/..."
                        value={form.meetingLink}
                        onChange={handleChange("meetingLink")}
                        onBlur={handleBlur("meetingLink")}
                        InputProps={{ startAdornment: <InputAdornment position="start"><LinkIcon sx={{ color: getError("meetingLink", form.meetingLink) ? "#ef4444" : theme.palette.primary.main, fontSize: "20px" }} /></InputAdornment> }}
                        sx={inputSx(!!getError("meetingLink", form.meetingLink))}
                      />
                    </FieldWrapper>
                  )}

                </Stack>
              </Box>

              {/* divider */}
              <Box sx={{ height: "1.5px", background: "linear-gradient(90deg,transparent,#e8eaf6,transparent)" }} />

              {/* ── SECTION 4: Organizer ── */}
              <SectionHeader number="4" title="Organizer Details" subtitle="Who is organising this event? (optional)" />

              <Box sx={{ pl: { md: 5.5 } }}>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>

                  {/* Organizer Name */}
                  <FieldWrapper
                    label="Organizer Name"
                    error={getError("organizer", form.organizer)}
                    hint="Leave blank to use your profile name"
                  >
                    <TextField
                      fullWidth
                      placeholder="Full name"
                      value={form.organizer}
                      onChange={handleChange("organizer")}
                      onBlur={handleBlur("organizer")}
                      InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: getError("organizer", form.organizer) ? "#ef4444" : "#f97316", fontSize: "20px" }} /></InputAdornment> }}
                      sx={inputSx(!!getError("organizer", form.organizer))}
                    />
                  </FieldWrapper>

                  {/* Organizer Email */}
                  <FieldWrapper
                    label="Organizer Email"
                    error={getError("email", form.email)}
                    hint="For attendee queries and RSVPs"
                  >
                    <TextField
                      fullWidth type="email"
                      placeholder="organizer@example.com"
                      value={form.email}
                      onChange={handleChange("email")}
                      onBlur={handleBlur("email")}
                      InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: getError("email", form.email) ? "#ef4444" : theme.palette.primary.main, fontSize: "20px" }} /></InputAdornment> }}
                      sx={inputSx(!!getError("email", form.email))}
                    />
                  </FieldWrapper>

                </Box>
              </Box>

              {/* divider */}
              <Box sx={{ height: "1.5px", background: "linear-gradient(90deg,transparent,#e8eaf6,transparent)" }} />

              {/* ── SECTION 5: Fee & Image ── */}
              <SectionHeader number="5" title="Fee & Media" subtitle="Registration fee and event invitation image (both optional)" />

              <Box sx={{ pl: { md: 5.5 } }}>
                <Stack spacing={3}>

                  {/* Fee */}
                  <Box sx={{ maxWidth: { sm: "50%" } }}>
                    <FieldWrapper
                      label="Registration Fee (INR)"
                      error={getError("fee", form.fee)}
                      hint="Leave blank for a free event"
                    >
                      <TextField
                        fullWidth type="number"
                        placeholder="0"
                        value={form.fee}
                        onChange={handleChange("fee")}
                        onBlur={handleBlur("fee")}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ fontWeight: 700, color: getError("fee", form.fee) ? "#ef4444" : "#64748b", fontSize: 15 }}>₹</Typography></InputAdornment> }}
                        sx={inputSx(!!getError("fee", form.fee))}
                      />
                    </FieldWrapper>
                  </Box>

                  {/* Image upload */}
                  <FieldWrapper label="Invitation / Banner Image" hint="Recommended: 1200×630px, JPG or PNG, max 5 MB">
                    <Box>
                      <Button
                        variant="outlined" fullWidth
                        onClick={() => fileInputRef.current?.click()}
                        startIcon={<PhotoCameraIcon />}
                        sx={{
                          borderRadius: "12px", borderColor: "#e8eaf6", borderWidth: "1.5px",
                          color: theme.palette.primary.main, fontWeight: 700, py: 1.4, fontSize: "14px",
                          backgroundColor: "#fafbff",
                          "&:hover": { borderColor: theme.palette.primary.main, backgroundColor: "#f0f4ff", borderWidth: "1.5px" },
                        }}
                      >
                        {form.image ? "Change Image" : "Upload Invitation Image"}
                      </Button>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                      {form.image && (
                        <Box sx={{ mt: 2, position: "relative" }}>
                          <Box component="img" src={form.image} alt="preview"
                            sx={{ width: "100%", maxHeight: "240px", borderRadius: "14px", objectFit: "cover", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", border: "1.5px solid #e8eaf6", display: "block" }} />
                          {/* remove image button */}
                          <Box
                            onClick={() => setForm((s) => ({ ...s, image: "" }))}
                            sx={{
                              position: "absolute", top: 10, right: 10, width: 32, height: 32,
                              borderRadius: "8px", backgroundColor: "rgba(15,23,42,0.6)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              cursor: "pointer", backdropFilter: "blur(4px)",
                              "&:hover": { backgroundColor: "rgba(239,68,68,0.8)" },
                              transition: "background 0.2s",
                            }}
                          >
                            <Typography sx={{ color: "#fff", fontSize: 16, fontWeight: 700, lineHeight: 1 }}>×</Typography>
                          </Box>
                          <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 0.6 }}>
                            <CheckCircleIcon sx={{ fontSize: 14, color: "#16a34a" }} />
                            <Typography sx={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>Image ready to upload</Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </FieldWrapper>

                </Stack>
              </Box>

              {/* divider */}
              <Box sx={{ height: "1.5px", background: "linear-gradient(90deg,transparent,#e8eaf6,transparent)" }} />

              {/* ── SUBMIT ── */}
              <Box sx={{ pl: { md: 5.5 } }}>
                <Button
                  onClick={handleCreate}
                  variant="contained"
                  fullWidth
                  sx={{
                    background: isFormValid()
                      ? "linear-gradient(135deg,#667eea,#764ba2)"
                      : "#e2e8f0",
                    color: isFormValid() ? "#fff" : "#94a3b8",
                    fontWeight: 800, py: 1.8, fontSize: "15px",
                    borderRadius: "14px", letterSpacing: "0.3px",
                    boxShadow: isFormValid() ? "0 8px 24px rgba(102,126,234,0.35)" : "none",
                    transition: "all 0.25s ease",
                    "&:hover": isFormValid() ? {
                      background: "linear-gradient(135deg,#5a6fd6,#6b3fa0)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 32px rgba(102,126,234,0.45)",
                    } : {},
                  }}
                >
                  {isFormValid() ? "🚀 Publish Event" : "Complete required fields to publish"}
                </Button>
                {!isFormValid() && (
                  <Typography sx={{ textAlign: "center", fontSize: 12, color: "#94a3b8", mt: 1.2, fontWeight: 500 }}>
                    Fill in all required fields marked with <Box component="span" sx={{ color: "#ef4444" }}>*</Box> to enable publishing
                  </Typography>
                )}
              </Box>

            </Stack>
          </Box>
        </Paper>
      )}

      {/* ── UPCOMING TAB ── */}
      {tab === 1 && (
        <Stack spacing={3}>
          {loading && (
            <Paper elevation={0} sx={{ p: 6, borderRadius: "20px", textAlign: "center", border: "1.5px solid #e8eaf6" }}>
              <Box sx={{ width: 48, height: 48, borderRadius: "14px", background: "linear-gradient(135deg,#667eea,#764ba2)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2, animation: "spin 1.2s linear infinite", "@keyframes spin": { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } } }}>
                <EventIcon sx={{ fontSize: 24, color: "#fff" }} />
              </Box>
              <Typography sx={{ color: "#64748b", fontWeight: 600, fontSize: 15 }}>Loading events...</Typography>
            </Paper>
          )}
          {!loading && upcoming.length === 0 && (
            <Paper elevation={0} sx={{ p: 6, borderRadius: "20px", textAlign: "center", border: "1.5px dashed #e0e7ff", backgroundColor: "#fafbff" }}>
              <Box sx={{ fontSize: 52, mb: 1.5 }}>📅</Box>
              <Typography sx={{ fontWeight: 800, fontSize: 18, color: "#334155", mb: 0.8 }}>No Upcoming Events</Typography>
              <Typography sx={{ color: "#94a3b8", fontSize: 14 }}>Be the first to create one!</Typography>
            </Paper>
          )}
          {!loading && upcoming.map((ev) => <EventCard key={ev.id} ev={ev} isPast={false} />)}
        </Stack>
      )}

      {/* ── PAST TAB ── */}
      {tab === 2 && (
        <Stack spacing={3}>
          {past.length === 0 && (
            <Paper elevation={0} sx={{ p: 6, borderRadius: "20px", textAlign: "center", border: "1.5px dashed #e2e8f0", backgroundColor: "#fafbff" }}>
              <Box sx={{ fontSize: 52, mb: 1.5 }}>🕐</Box>
              <Typography sx={{ fontWeight: 800, fontSize: 18, color: "#334155", mb: 0.8 }}>No Past Events</Typography>
              <Typography sx={{ color: "#94a3b8", fontSize: 14 }}>Events you have hosted will appear here</Typography>
            </Paper>
          )}
          {past.map((ev) => <EventCard key={ev.id} ev={ev} isPast={true} />)}
        </Stack>
      )}
    </Box>
  );
};

export default Events;
