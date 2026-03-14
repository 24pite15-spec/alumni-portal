import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postsAPI, default as API_BASE_URL } from "../../api/config";

import {
  Box,
  Typography,
  Paper,
  Avatar,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  CircularProgress,
} from "@mui/material";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const initialPosts = [];

const getImageUrl = (post_image_path, image_url) => {
  if (post_image_path) return `${API_BASE_URL}/${post_image_path}`;
  if (image_url && !image_url.startsWith("blob:")) return image_url;
  return "";
};

// ── Date Range Calendar component ───────────────────────────────────────────
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const CalendarPicker = ({ startDate, endDate, onChange, onClose }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selecting, setSelecting] = useState("start");
  const [hoverDate, setHoverDate] = useState(null);
  const [validationMsg, setValidationMsg] = useState("");

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const toDateStr = (d) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const toTs = (str) => {
    if (!str) return null;
    const [y, m, day] = str.split("-").map(Number);
    const dt = new Date(y, m - 1, day);
    dt.setHours(0, 0, 0, 0);
    return dt.getTime();
  };

  const isFuture = (d) => {
    const dt = new Date(viewYear, viewMonth, d);
    dt.setHours(0, 0, 0, 0);
    return dt.getTime() > today.getTime();
  };

  // ── Validation helpers ───────────────────────────────────────────────────
  const MAX_RANGE_DAYS = 365;

  const getRangeDays = (s, e) => {
    if (!s || !e) return 0;
    return Math.round((toTs(e) - toTs(s)) / (1000 * 60 * 60 * 24));
  };

  const validateSelection = (s, e) => {
    if (!s && !e) return "";
    if (s && !e) return "";
    if (s && e) {
      if (toTs(e) < toTs(s)) return "End date cannot be before start date.";
      const days = getRangeDays(s, e);
      if (days > MAX_RANGE_DAYS) return `Range cannot exceed ${MAX_RANGE_DAYS} days (selected: ${days} days).`;
    }
    return "";
  };

  const startTs = toTs(startDate);
  const endTs = toTs(endDate);

  const isStart = (d) => toDateStr(d) === startDate;
  const isEnd = (d) => toDateStr(d) === endDate;
  const isToday = (d) => toDateStr(d) === today.toISOString().split("T")[0];

  const isInRange = (d) => {
    const ts = toTs(toDateStr(d));
    const hoverTs = hoverDate ? toTs(hoverDate) : null;
    const rangeEnd = endTs || (selecting === "end" && hoverTs ? hoverTs : null);
    if (startTs && rangeEnd && ts !== null) {
      const lo = Math.min(startTs, rangeEnd);
      const hi = Math.max(startTs, rangeEnd);
      return ts > lo && ts < hi;
    }
    return false;
  };

  // Check if hover preview would exceed max range
  const isHoverOverRange = (d) => {
    if (!startTs || selecting !== "end") return false;
    const dTs = toTs(toDateStr(d));
    if (!dTs) return false;
    const days = Math.round(Math.abs(dTs - startTs) / (1000 * 60 * 60 * 24));
    return days > MAX_RANGE_DAYS;
  };

  const handleDayClick = (d) => {
    if (isFuture(d)) return;
    const dateStr = toDateStr(d);
    const clickTs = toTs(dateStr);

    if (selecting === "start") {
      const newEnd = endDate && clickTs > toTs(endDate) ? "" : endDate;
      setValidationMsg(newEnd ? validateSelection(dateStr, newEnd) : "");
      onChange({ startDate: dateStr, endDate: newEnd });
      setSelecting("end");
    } else {
      if (startTs && clickTs < startTs) {
        const msg = validateSelection(dateStr, startDate);
        if (msg) { setValidationMsg(msg); return; }
        setValidationMsg("");
        onChange({ startDate: dateStr, endDate: startDate });
      } else if (startTs && clickTs === startTs) {
        setValidationMsg("");
        onChange({ startDate: dateStr, endDate: dateStr });
      } else {
        const days = getRangeDays(startDate, dateStr);
        if (days > MAX_RANGE_DAYS) {
          setValidationMsg(`Range cannot exceed ${MAX_RANGE_DAYS} days. Please choose a closer end date.`);
          return;
        }
        setValidationMsg("");
        onChange({ startDate, endDate: dateStr });
      }
      setSelecting("start");
    }
  };

  const handleChipClick = (type) => {
    setSelecting(type);
    setValidationMsg("");
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const canSubmit = !validationMsg && (startDate || endDate);

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.22), 0 4px 16px rgba(104,121,227,0.18)",
        p: 2,
        width: 272,
        border: "1px solid #e8eaf6",
        animation: "fadeSlideDown 0.2s cubic-bezier(0.16,1,0.3,1)",
        "@keyframes fadeSlideDown": {
          "0%": { opacity: 0, transform: "translateY(-10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {/* From / To chips */}
      <Box display="flex" gap={0.8} mb={1.5}>
        {["start", "end"].map((type) => {
          const val = type === "start" ? startDate : endDate;
          const isActive = selecting === type;
          const hasError = !!validationMsg && type === "end";
          return (
            <Box
              key={type}
              onClick={() => handleChipClick(type)}
              sx={{
                flex: 1, py: 0.6, px: 1, borderRadius: "8px", cursor: "pointer",
                border: hasError
                  ? "2px solid #ef4444"
                  : isActive
                  ? "2px solid #6879e3"
                  : "1.5px solid #e8eaf6",
                backgroundColor: hasError ? "#fff5f5" : isActive ? "#f0f4ff" : "#fafafa",
                transition: "all 0.15s",
              }}
            >
              <Typography sx={{ fontSize: "9px", fontWeight: 700, color: hasError ? "#ef4444" : "#aaa", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {type === "start" ? "From" : "To"}
              </Typography>
              <Typography sx={{ fontSize: "12px", fontWeight: 700, color: hasError ? "#ef4444" : val ? "#6879e3" : "#ccc" }}>
                {val
                  ? new Date(val + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  : "Select"}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Validation error banner OR instruction hint */}
      {validationMsg ? (
        <Box
          sx={{
            mb: 1.2, px: 1.2, py: 0.7, borderRadius: "7px",
            backgroundColor: "#fff5f5", border: "1px solid #fecaca",
            display: "flex", alignItems: "flex-start", gap: 0.8,
          }}
        >
          <Box sx={{ flexShrink: 0, mt: "1px" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" />
              <path d="M12 8v4m0 4h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Box>
          <Typography sx={{ fontSize: "10px", fontWeight: 600, color: "#dc2626", lineHeight: 1.4 }}>
            {validationMsg}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            mb: 1.2, px: 1.2, py: 0.6, borderRadius: "7px",
            backgroundColor: "#f0f4ff", border: "1px solid #e0e7ff",
          }}
        >
          <Typography sx={{ fontSize: "10px", fontWeight: 600, color: "#6879e3", textAlign: "center" }}>
            {selecting === "start" ? "👆 Click to select start date" : "👆 Click to select end date"}
          </Typography>
        </Box>
      )}

      {/* Month nav */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
        <Box
          onClick={prevMonth}
          sx={{
            width: 26, height: 26, borderRadius: "7px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#6879e3", backgroundColor: "#f0f4ff",
            "&:hover": { backgroundColor: "#6879e3", color: "#fff" }, transition: "all 0.15s",
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Box>
        <Box textAlign="center">
          <Typography sx={{ fontWeight: 800, fontSize: "13px", color: "#1a1a1a", lineHeight: 1 }}>
            {MONTHS[viewMonth]}
          </Typography>
          <Typography sx={{ fontWeight: 600, fontSize: "11px", color: "#6879e3", mt: 0.2 }}>
            {viewYear}
          </Typography>
        </Box>
        <Box
          onClick={nextMonth}
          sx={{
            width: 26, height: 26, borderRadius: "7px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#6879e3", backgroundColor: "#f0f4ff",
            "&:hover": { backgroundColor: "#6879e3", color: "#fff" }, transition: "all 0.15s",
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Box>
      </Box>

      {/* Day headers */}
      <Box display="grid" sx={{ gridTemplateColumns: "repeat(7, 1fr)", mb: 0.5 }}>
        {DAYS.map((d) => (
          <Box key={d} sx={{ textAlign: "center", py: 0.3 }}>
            <Typography sx={{ fontSize: "9px", fontWeight: 700, color: "#aaa", textTransform: "uppercase" }}>
              {d}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Day cells */}
      <Box display="grid" sx={{ gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
        {cells.map((d, i) => {
          if (!d) return <Box key={i} />;
          const inRange = isInRange(d);
          const start = isStart(d);
          const end = isEnd(d);
          const future = isFuture(d);
          const todayCell = isToday(d);
          const colPos = (firstDay + d - 1) % 7;
          const isEndCap = end || (inRange && colPos === 6);
          const isStartCap = start || (inRange && colPos === 0);

          const dateStr = toDateStr(d);
          const hoverTs2 = hoverDate ? toTs(hoverDate) : null;
          const isHovered =
            selecting === "end" &&
            hoverDate &&
            startTs &&
            (() => {
              const dTs = toTs(dateStr);
              const lo = Math.min(startTs, hoverTs2);
              const hi = Math.max(startTs, hoverTs2);
              return dTs >= lo && dTs <= hi;
            })();

          // Red tint if hover range exceeds max
          const overRange = isHoverOverRange(d);
          const isDisabled = future || (selecting === "end" && overRange && !start);

          return (
            <Box
              key={i}
              onClick={() => !isDisabled && handleDayClick(d)}
              onMouseEnter={() => !future && setHoverDate(dateStr)}
              onMouseLeave={() => setHoverDate(null)}
              sx={{
                height: 30,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: future ? 0.3 : 1,
                borderRadius:
                  start || end
                    ? "10px"
                    : inRange
                    ? `${isStartCap ? "10px" : "0"} ${isEndCap ? "10px" : "0"} ${isEndCap ? "10px" : "0"} ${isStartCap ? "10px" : "0"}`
                    : "10px",
                backgroundColor:
                  start || end
                    ? "#6879e3"
                    : inRange
                    ? "#eef0fd"
                    : isHovered && overRange
                    ? "#fee2e2"
                    : isHovered
                    ? "#dde3fb"
                    : "transparent",
                border:
                  todayCell && !start && !end
                    ? "2px solid #6879e3"
                    : "2px solid transparent",
                transition: "all 0.12s ease",
                "&:hover": !isDisabled
                  ? { backgroundColor: start || end ? "#5a6fd6" : "#f0f4ff", transform: "scale(1.08)" }
                  : {},
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: start || end || todayCell ? 800 : 500,
                  color:
                    start || end ? "#ffffff"
                    : isHovered && overRange ? "#ef4444"
                    : inRange || isHovered ? "#6879e3"
                    : todayCell ? "#6879e3"
                    : "#1a1a1a",
                  lineHeight: 1,
                  pointerEvents: "none",
                }}
              >
                {d}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Range summary strip */}
      {startDate && endDate && !validationMsg && (
        <Box
          sx={{
            mt: 1.2, px: 1.2, py: 0.6, borderRadius: "7px",
            backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 0.6,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#16a34a" }}>
            {getRangeDays(startDate, endDate) === 0
              ? "Single day selected"
              : `${getRangeDays(startDate, endDate)} day${getRangeDays(startDate, endDate) > 1 ? "s" : ""} selected`}
          </Typography>
        </Box>
      )}

      {/* Footer */}
      <Box mt={1.5} pt={1.2} sx={{ borderTop: "1px solid #f0f4ff" }} display="flex" justifyContent="space-between" alignItems="center">
        <Box
          onClick={() => {
            onChange({ startDate: "", endDate: "" });
            setValidationMsg("");
            setSelecting("start");
            onClose();
          }}
          sx={{
            fontSize: "11px", fontWeight: 700, color: "#ef4444", cursor: "pointer",
            px: 1.2, py: 0.5, borderRadius: "6px",
            "&:hover": { backgroundColor: "#fee2e2" }, transition: "all 0.15s",
          }}
        >
          Clear
        </Box>
        <Box
          onClick={() => {
            const t = today.toISOString().split("T")[0];
            onChange({ startDate: t, endDate: t });
            setValidationMsg("");
            setSelecting("start");
          }}
          sx={{
            fontSize: "11px", fontWeight: 700, color: "#6879e3", cursor: "pointer",
            px: 1.2, py: 0.5, borderRadius: "6px",
            "&:hover": { backgroundColor: "#f0f4ff" }, transition: "all 0.15s",
          }}
        >
          Today
        </Box>
        <Box
          onClick={() => canSubmit && onClose()}
          sx={{
            fontSize: "11px", fontWeight: 700,
            color: canSubmit ? "#fff" : "#94a3b8",
            cursor: canSubmit ? "pointer" : "not-allowed",
            px: 1.5, py: 0.6, borderRadius: "7px",
            backgroundColor: canSubmit ? "#6879e3" : "#e2e8f0",
            "&:hover": canSubmit ? { backgroundColor: "#5a6fd6" } : {},
            transition: "all 0.15s",
          }}
        >
          Done
        </Box>
      </Box>
    </Box>
  );
};
// ────────────────────────────────────────────────────────────────────────────

const POSTS_PER_PAGE = 10;

const HomeFeed = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) navigate("/");
  }, [navigate]);

  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [allPosts, setAllPosts] = useState(initialPosts);
  const [tick, setTick] = useState(0);

  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });
  const filterStartDate = dateFilter.startDate;
  const filterEndDate = dateFilter.endDate;

  const [showDatePicker, setShowDatePicker] = useState(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLoading, setPageLoading] = useState(false);

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
  const endIdx = Math.min(startIdx + POSTS_PER_PAGE, allPosts.length);
  const visiblePosts = allPosts.slice(startIdx, endIdx);

  const [postText, setPostText] = useState("");
  const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [pasteImageMode, setPasteImageMode] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [linkUrlInput, setLinkUrlInput] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  // 3-dot menu + report
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [reportPostId, setReportPostId] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [reportOther, setReportOther] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpenId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ✅ FIXED: Real API call instead of fake setTimeout
  const handleReportSubmit = async () => {
    if (!reportReason) return;

    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser?.userId) {
      alert("You must be logged in to report a post.");
      return;
    }

    setReportSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/posts/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: reportPostId,
          userId: currentUser.userId,
          reportedReason:
            reportReason === "Other" && reportOther.trim()
              ? `Other: ${reportOther.trim()}`
              : reportReason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // 409 = already reported this post
        if (res.status === 409) {
          alert(data.message || "You have already reported this post.");
          closeReport();
          return;
        }
        throw new Error(data.message || "Failed to submit report");
      }

      // ✅ Success — show confirmation screen
      setReportSubmitted(true);
    } catch (err) {
      console.error("Report submit error:", err);
      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setReportSubmitting(false);
    }
  };

  const closeReport = () => {
    setReportPostId(null);
    setReportReason("");
    setReportOther("");
    setReportSubmitted(false);
    setReportSubmitting(false);
  };

  const handleFileSelected = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setSelectedImageFile(file);
      setOpenPhotoDialog(false);
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput) {
      setSelectedImage(imageUrlInput);
      setImageUrlInput("");
      setPasteImageMode(false);
      setOpenPhotoDialog(false);
    }
  };

  const handleAddLink = () => {
    if (linkUrlInput) {
      setPostText((t) => (t ? `${t}\n${linkUrlInput}` : linkUrlInput));
      setLinkUrlInput("");
      setOpenLinkDialog(false);
    }
  };

  const loadPosts = (startDate, endDate) => {
    postsAPI
      .list(startDate, endDate)
      .then((data) => {
        if (Array.isArray(data)) {
          const converted = data.map((p) => ({
            id: p.post_id,
            name: p.name,
            year: p.year ? `Class of ${p.year}` : "",
            createdAt: new Date(p.created_at).getTime(),
            createdAtStr: p.created_at
              ? String(p.created_at).slice(0, 10)
              : "",
            text: p.post_description || "",
            image: getImageUrl(p.post_image_path, p.image_url),
          }));

          const filtered = converted.filter((post) => {
            if (!startDate && !endDate) return true;
            const d = post.createdAtStr;
            if (startDate && d < startDate) return false;
            if (endDate && d > endDate) return false;
            return true;
          });

          setAllPosts(filtered);
          setCurrentPage(1);
        }
      })
      .catch((err) => console.warn("Could not load posts", err));
  };

  const handlePost = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.userId) { alert("User not logged in"); return; }
      let postImagePath = null, imageUrl = null;
      if (selectedImageFile) {
        const form = new FormData();
        form.append("image", selectedImageFile);
        const uploadRes = await postsAPI.uploadImage(form);
        if (!uploadRes?.imagePath)
          throw new Error(uploadRes?.message || "Image upload failed");
        postImagePath = uploadRes.imagePath;
      } else if (selectedImage) {
        imageUrl = selectedImage;
      }
      await postsAPI.create({
        userId: user.userId,
        postDescription: postText || null,
        postImagePath,
        imageUrl,
      });
      loadPosts(filterStartDate, filterEndDate);
      setPostText("");
      setSelectedImage("");
      setSelectedImageFile(null);
    } catch (err) {
      console.error("Post error:", err);
      alert(err.message || "Failed to create post");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage === currentPage || newPage < 1 || newPage > totalPages) return;
    setPageLoading(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setPageLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 400);
  };

  useEffect(() => {
    const t = setInterval(() => setTick((s) => s + 1), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (u) setUser(u);
    loadPosts(dateFilter.startDate, dateFilter.endDate);
  }, [dateFilter]);

  const timeAgo = (ts) => {
    if (!ts) return "";
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return "Just now";
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return new Date(ts).toLocaleDateString();
  };

  const hasFilter = filterStartDate || filterEndDate;

  const formattedFilterLabel = (() => {
    if (!filterStartDate && !filterEndDate) return "All posts";
    const fmt = (d) =>
      new Date(d + "T00:00:00").toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      });
    if (filterStartDate && filterEndDate && filterStartDate !== filterEndDate)
      return `${fmt(filterStartDate)} – ${fmt(filterEndDate)}`;
    if (filterStartDate && filterEndDate && filterStartDate === filterEndDate)
      return fmt(filterStartDate);
    if (filterStartDate) return `From ${fmt(filterStartDate)}`;
    return `Until ${fmt(filterEndDate)}`;
  })();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6879e3 0%, #5a6fd6 50%, #4a60cc 100%)",
        py: { xs: 3, md: 5 },
        position: "relative", overflow: "hidden",
        "&::before": {
          content: '""', position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 }, position: "relative", zIndex: 1 }}>

        {/* HEADER */}
        <Box mb={5}>
          <Typography
            variant="h3" fontWeight={800} mb={1.5}
            sx={{ color: "#ffffff", letterSpacing: "-0.5px", fontSize: { xs: "28px", md: "36px" } }}
          >
            Home Feed
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "rgba(255,255,255,0.85)", fontSize: "16px", fontWeight: 500, maxWidth: 500 }}
          >
            Share your story with the alumni community and stay connected
          </Typography>

          {/* Date Range Filter */}
          <Box mt={3} sx={{ position: "relative" }} display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Box
              onClick={() => setShowDatePicker((s) => !s)}
              sx={{
                display: "flex", alignItems: "center", gap: 1.5,
                px: 2, py: 1, borderRadius: "14px", cursor: "pointer",
                backgroundColor: hasFilter ? "#ffffff" : "rgba(255,255,255,0.15)",
                border: hasFilter ? "2px solid #ffffff" : "2px solid rgba(255,255,255,0.35)",
                backdropFilter: "blur(8px)", transition: "all 0.25s ease", userSelect: "none",
                "&:hover": {
                  backgroundColor: hasFilter ? "#f0f4ff" : "rgba(255,255,255,0.25)",
                  border: "2px solid #ffffff", transform: "translateY(-1px)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Box
                sx={{
                  width: 34, height: 34, borderRadius: "9px",
                  backgroundColor: hasFilter ? "#6879e3" : "rgba(255,255,255,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="3" stroke="#fff" strokeWidth="2" />
                  <path d="M3 9h18" stroke="#fff" strokeWidth="2" />
                  <path d="M8 2v4M16 2v4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="8" cy="14" r="1.3" fill="#fff" />
                  <circle cx="12" cy="14" r="1.3" fill="#fff" />
                  <circle cx="16" cy="14" r="1.3" fill="#fff" />
                </svg>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: "10px", fontWeight: 700, letterSpacing: "0.6px",
                    textTransform: "uppercase", lineHeight: 1,
                    color: hasFilter ? "#6879e3" : "rgba(255,255,255,0.65)",
                  }}
                >
                  {hasFilter ? "Filtered by date range" : "Date filter"}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "13px", fontWeight: 700, lineHeight: 1.5, mt: 0.2,
                    color: hasFilter ? "#1a1a1a" : "#ffffff",
                  }}
                >
                  {formattedFilterLabel}
                </Typography>
              </Box>
              <Box
                sx={{
                  color: hasFilter ? "#6879e3" : "#ffffff",
                  transition: "transform 0.2s",
                  transform: showDatePicker ? "rotate(180deg)" : "rotate(0deg)",
                  display: "flex", alignItems: "center", ml: 0.5,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Box>
            </Box>

            {hasFilter && (
              <Box
                onClick={() => {
                  setDateFilter({ startDate: "", endDate: "" });
                  setShowDatePicker(false);
                }}
                sx={{
                  display: "flex", alignItems: "center", gap: 0.8,
                  px: 1.8, py: 0.9, borderRadius: "10px", cursor: "pointer",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  border: "1.5px solid rgba(255,255,255,0.35)",
                  userSelect: "none", transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255,80,80,0.25)",
                    border: "1.5px solid rgba(255,160,160,0.6)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#ffffff" }}>
                  Clear filter
                </Typography>
              </Box>
            )}

            {showDatePicker && (
              <Box sx={{ position: "absolute", top: "calc(100% + 10px)", left: 0, zIndex: 200 }}>
                <CalendarPicker
                  startDate={filterStartDate}
                  endDate={filterEndDate}
                  onChange={({ startDate, endDate }) => {
                    setDateFilter({ startDate, endDate });
                  }}
                  onClose={() => setShowDatePicker(false)}
                />
              </Box>
            )}
          </Box>
        </Box>

        {/* CREATE POST */}
        <Paper
          sx={{
            p: { xs: 2.5, md: 3.5 }, borderRadius: 3, mb: 5,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            backgroundColor: "#ffffff", border: "1px solid #e8eaf6", color: "black",
          }}
        >
          <Typography fontWeight={700} mb={3} sx={{ fontSize: "16px", color: "#1a1a1a" }}>
            ✨ Create Post
          </Typography>
          <Box display="flex" gap={3} alignItems="flex-start">
            <Avatar sx={{ width: 52, height: 52, backgroundColor: "#6879e3", color: "white", fontWeight: 700, fontSize: "18px" }}>
              AU
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                placeholder="What's on your mind?"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                multiline
                minRows={2}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(104,121,227,0.02)", borderRadius: 2.5,
                    border: "1.5px solid rgba(104,121,227,0.15)", transition: "all 0.2s ease", fontSize: "15px",
                    "&:hover": { border: "1.5px solid rgba(104,121,227,0.25)" },
                    "&.Mui-focused": {
                      backgroundColor: "rgba(104,121,227,0.05)",
                      border: "1.5px solid #6879e3",
                      boxShadow: "0 0 0 3px rgba(104,121,227,0.1)",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "#1a1a1a", fontWeight: 500,
                    "&::placeholder": { color: "#999", opacity: 1 },
                  },
                }}
              />
              {selectedImage && (
                <Box
                  component="img" src={selectedImage} alt="preview"
                  sx={{ mt: 2.5, width: "100%", maxHeight: 380, objectFit: "cover", borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                />
              )}
            </Box>
          </Box>
          <Box
            mt={3.5} display="flex" alignItems="center" justifyContent="space-between"
            flexDirection={{ xs: "column", sm: "row" }} gap={2}
          >
            <Box display="flex" gap={2} flexWrap="wrap" sx={{ flex: 1 }}>
              <Button
                variant="outlined" startIcon={<PhotoCameraOutlinedIcon />}
                onClick={() => setOpenPhotoDialog(true)}
                sx={{
                  borderRadius: 2.5, borderColor: "rgba(104,121,227,0.4)", color: "#6879e3",
                  fontWeight: 600, fontSize: "14px",
                  "&:hover": { backgroundColor: "rgba(104,121,227,0.08)", borderColor: "#6879e3" },
                }}
              >
                Add Photo
              </Button>
              <Button
                variant="outlined" startIcon={<LinkOutlinedIcon />}
                onClick={() => setOpenLinkDialog(true)}
                sx={{
                  borderRadius: 2.5, borderColor: "rgba(104,121,227,0.4)", color: "#6879e3",
                  fontWeight: 600, fontSize: "14px",
                  "&:hover": { backgroundColor: "rgba(104,121,227,0.08)", borderColor: "#6879e3" },
                }}
              >
                Add Link
              </Button>
            </Box>
            <Button
              variant="contained" onClick={handlePost}
              disabled={!postText && !selectedImage}
              sx={{
                borderRadius: 2.5, px: 4, py: 1.2, backgroundColor: "#6879e3", color: "white",
                fontWeight: 700, fontSize: "15px", boxShadow: "0 8px 24px rgba(104,121,227,0.35)",
                "&:hover": { backgroundColor: "#5a6fd6", transform: "translateY(-2px)" },
                "&:disabled": { backgroundColor: "#c0c8e0", boxShadow: "none" },
              }}
            >
              Post
            </Button>
          </Box>
        </Paper>

        {/* POSTS HEADER */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3.5} flexWrap="wrap" gap={1}>
          <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 700, fontSize: "18px", letterSpacing: "0.5px" }}>
            📝 Recent Posts
          </Typography>
          {allPosts.length > 0 && (
            <Box
              sx={{
                backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: "10px", px: 2, py: 0.8,
              }}
            >
              <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#ffffff" }}>
                Showing {startIdx + 1}–{endIdx} of {allPosts.length} posts
              </Typography>
            </Box>
          )}
        </Box>

        {/* PAGE LOADER */}
        {pageLoading ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={8} gap={2}>
            <CircularProgress sx={{ color: "#ffffff" }} size={44} thickness={4} />
            <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: 600 }}>
              Loading posts {startIdx + 1}–{Math.min(currentPage * POSTS_PER_PAGE, allPosts.length)}...
            </Typography>
          </Box>
        ) : (
          <>
            {/* POSTS */}
            {visiblePosts.map((post) => (
              <Paper
                key={post.id}
                sx={{
                  p: { xs: 2.5, md: 3.5 }, mb: 3, borderRadius: 3,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                  backgroundColor: "#ffffff", border: "1px solid #e8eaf6",
                  transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                  "&:hover": { boxShadow: "0 20px 60px rgba(0,0,0,0.16)", transform: "translateY(-4px)" },
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2.5}>
                  <Box display="flex" gap={2.5}>
                    <Avatar sx={{ width: 48, height: 48, backgroundColor: "#6879e3", color: "white", fontWeight: 700, fontSize: "16px" }}>
                      {post.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={700} sx={{ fontSize: "15px", color: "#1a1a1a" }}>
                        {post.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#666", fontSize: "12px", fontWeight: 500 }}>
                        {post.year ? `${post.year} • ${timeAgo(post.createdAt)}` : timeAgo(post.createdAt)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* 3-dot menu */}
                  <Box ref={menuOpenId === post.id ? menuRef : null} sx={{ position: "relative" }}>
                    <IconButton
                      size="small"
                      onClick={() => setMenuOpenId(menuOpenId === post.id ? null : post.id)}
                      sx={{
                        color: menuOpenId === post.id ? "#6879e3" : "#bbb",
                        backgroundColor: menuOpenId === post.id ? "#f0f4ff" : "transparent",
                        "&:hover": { backgroundColor: "#f0f4ff", color: "#6879e3" },
                        transition: "all 0.15s",
                      }}
                    >
                      <MoreHorizIcon sx={{ fontSize: "20px" }} />
                    </IconButton>

                    {menuOpenId === post.id && (
                      <Box
                        sx={{
                          position: "absolute", top: "calc(100% + 6px)", right: 0,
                          width: 170, backgroundColor: "#ffffff", borderRadius: "12px",
                          boxShadow: "0 16px 48px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.07)",
                          border: "1px solid #e8eaf6", overflow: "hidden", zIndex: 500,
                          animation: "menuFade 0.15s cubic-bezier(0.16,1,0.3,1)",
                          "@keyframes menuFade": {
                            "0%": { opacity: 0, transform: "scale(0.95) translateY(-6px)" },
                            "100%": { opacity: 1, transform: "scale(1) translateY(0)" },
                          },
                          "&::before": {
                            content: '""', position: "absolute", top: "-6px", right: "12px",
                            width: 0, height: 0,
                            borderLeft: "6px solid transparent", borderRight: "6px solid transparent",
                            borderBottom: "6px solid #ffffff",
                            filter: "drop-shadow(0 -1px 1px rgba(0,0,0,0.06))",
                          },
                        }}
                      >
                        <Box
                          onClick={() => { setMenuOpenId(null); setReportPostId(post.id); }}
                          sx={{
                            display: "flex", alignItems: "center", gap: 1.2,
                            px: 1.8, py: 1.3, cursor: "pointer", transition: "all 0.15s",
                            "&:hover": { backgroundColor: "#fff5f5" },
                          }}
                        >
                          <Box
                            sx={{
                              width: 28, height: 28, borderRadius: "7px", backgroundColor: "#fee2e2",
                              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </Box>
                          <Box>
                            <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#dc2626" }}>Report</Typography>
                            <Typography sx={{ fontSize: "10px", color: "#f87171", fontWeight: 500 }}>Flag this post</Typography>
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>

                <Box sx={{ height: "1px", backgroundColor: "#e8eaf6", my: 2.5 }} />
                <Box mt={2}>
                  <Typography sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7, color: "#2d2d2d", fontSize: "14.5px", fontWeight: 500 }}>
                    {post.text}
                  </Typography>
                </Box>
                {post.image && (
                  <Box
                    component="img" src={post.image} alt="post"
                    sx={{
                      width: "100%", borderRadius: 2.5, mt: 2.5, objectFit: "cover",
                      maxHeight: 420, display: "block", cursor: "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
                    }}
                  />
                )}
              </Paper>
            ))}

            {/* EMPTY STATE */}
            {allPosts.length === 0 && (
              <Paper sx={{ p: 6, borderRadius: 3, textAlign: "center", backgroundColor: "#ffffff", border: "1px solid #e8eaf6" }}>
                <Typography sx={{ color: "#999", fontSize: "16px", fontWeight: 500 }}>
                  {hasFilter
                    ? `No posts found for ${formattedFilterLabel}`
                    : "No posts yet. Be the first to share! 🚀"}
                </Typography>
              </Paper>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <Box display="flex" alignItems="center" justifyContent="center" gap={1} mt={2} mb={4} flexWrap="wrap">
                {/* Prev */}
                <Box
                  onClick={() => handlePageChange(currentPage - 1)}
                  sx={{
                    display: "flex", alignItems: "center", gap: 0.8,
                    px: 2, py: 1, borderRadius: "10px",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    backgroundColor: currentPage === 1 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.15)",
                    border: "1.5px solid rgba(255,255,255,0.3)",
                    opacity: currentPage === 1 ? 0.4 : 1,
                    transition: "all 0.2s ease", userSelect: "none",
                    "&:hover": currentPage !== 1 ? { backgroundColor: "#ffffff", "& *": { color: "#6879e3" }, transform: "translateY(-1px)" } : {},
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#ffffff" }}>Prev</Typography>
                </Box>

                {/* Page pills */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const showPage = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                  const showDotsBefore = page === currentPage - 2 && currentPage > 3;
                  const showDotsAfter = page === currentPage + 2 && currentPage < totalPages - 2;

                  if (showDotsBefore || showDotsAfter) {
                    return (
                      <Typography key={page} sx={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", fontWeight: 700, px: 0.5 }}>
                        …
                      </Typography>
                    );
                  }
                  if (!showPage) return null;
                  const isActive = page === currentPage;
                  return (
                    <Box
                      key={page}
                      onClick={() => handlePageChange(page)}
                      sx={{
                        width: 38, height: 38, borderRadius: "10px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", userSelect: "none", transition: "all 0.2s ease",
                        backgroundColor: isActive ? "#ffffff" : "rgba(255,255,255,0.15)",
                        border: isActive ? "2px solid #ffffff" : "1.5px solid rgba(255,255,255,0.3)",
                        boxShadow: isActive ? "0 4px 16px rgba(0,0,0,0.2)" : "none",
                        transform: isActive ? "scale(1.1)" : "scale(1)",
                        "&:hover": !isActive ? { backgroundColor: "rgba(255,255,255,0.25)", transform: "translateY(-2px)" } : {},
                      }}
                    >
                      <Typography sx={{ fontSize: "14px", fontWeight: 800, color: isActive ? "#6879e3" : "#ffffff" }}>
                        {page}
                      </Typography>
                    </Box>
                  );
                })}

                {/* Next */}
                <Box
                  onClick={() => handlePageChange(currentPage + 1)}
                  sx={{
                    display: "flex", alignItems: "center", gap: 0.8,
                    px: 2, py: 1, borderRadius: "10px",
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    backgroundColor: currentPage === totalPages ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.15)",
                    border: "1.5px solid rgba(255,255,255,0.3)",
                    opacity: currentPage === totalPages ? 0.4 : 1,
                    transition: "all 0.2s ease", userSelect: "none",
                    "&:hover": currentPage !== totalPages ? { backgroundColor: "#ffffff", "& *": { color: "#6879e3" }, transform: "translateY(-1px)" } : {},
                  }}
                >
                  <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#ffffff" }}>Next</Typography>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Box>
              </Box>
            )}

            {/* Range label */}
            {totalPages > 1 && (
              <Box textAlign="center" mb={4} mt={-3}>
                <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>
                  Page {currentPage} of {totalPages} · Posts {startIdx + 1}–{endIdx} of {allPosts.length}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* ── Report Dialog ── */}
      {reportPostId && (
        <Box
          onClick={() => !reportSubmitting && closeReport()}
          sx={{
            position: "fixed", inset: 0, zIndex: 9999,
            backgroundColor: "rgba(15,23,42,0.45)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "bgFade 0.2s ease",
            "@keyframes bgFade": { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
          }}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              width: { xs: "90vw", sm: 440 }, backgroundColor: "#ffffff",
              borderRadius: "24px", overflow: "hidden",
              boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.1)",
              animation: "cardPop 0.25s cubic-bezier(0.16,1,0.3,1)",
              "@keyframes cardPop": {
                "0%": { opacity: 0, transform: "scale(0.93) translateY(16px)" },
                "100%": { opacity: 1, transform: "scale(1) translateY(0)" },
              },
            }}
          >
            <Box sx={{ height: "5px", background: "linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%)" }} />

            {reportSubmitted ? (
              <Box sx={{ px: 4, py: 5, textAlign: "center" }}>
                <Box
                  sx={{
                    width: 64, height: 64, borderRadius: "18px",
                    background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    mx: "auto", mb: 2.5, boxShadow: "0 8px 20px rgba(22,163,74,0.18)",
                  }}
                >
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Box>
                <Typography sx={{ fontSize: "20px", fontWeight: 900, color: "#0f172a", mb: 1 }}>
                  Report Submitted
                </Typography>
                <Typography sx={{ fontSize: "14px", color: "#64748b", fontWeight: 500, lineHeight: 1.7, mb: 3 }}>
                  Thank you for your report. Our team will review this post and take appropriate action.
                </Typography>
                <Box
                  onClick={closeReport}
                  sx={{
                    display: "inline-flex", alignItems: "center", px: 4, py: 1.4,
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #6879e3 0%, #5a6fd6 100%)",
                    cursor: "pointer", boxShadow: "0 6px 18px rgba(104,121,227,0.35)",
                    "&:hover": { transform: "translateY(-1px)", boxShadow: "0 10px 24px rgba(104,121,227,0.45)" },
                    transition: "all 0.2s ease",
                  }}
                >
                  <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Done</Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ px: 4, pt: 3.5, pb: 3.5 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2.5 }}>
                  <Box
                    sx={{
                      width: 52, height: 52, borderRadius: "14px",
                      backgroundColor: "#fffbeb", border: "1.5px solid #fde68a",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Box>
                  <Box sx={{ pt: 0.5 }}>
                    <Typography sx={{ fontSize: "18px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.3px", lineHeight: 1.2 }}>
                      Report Post
                    </Typography>
                    <Typography sx={{ fontSize: "13px", color: "#94a3b8", fontWeight: 500, mt: 0.5 }}>
                      Help us keep the community safe
                    </Typography>
                  </Box>
                  <Box
                    onClick={closeReport}
                    sx={{
                      ml: "auto", width: 32, height: 32, borderRadius: "8px",
                      backgroundColor: "#f1f5f9", display: "flex", alignItems: "center",
                      justifyContent: "center", cursor: "pointer", flexShrink: 0,
                      "&:hover": { backgroundColor: "#e2e8f0" }, transition: "all 0.15s",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </Box>
                </Box>

                <Box sx={{ height: "1px", backgroundColor: "#f1f5f9", mb: 2.5 }} />

                <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#374151", mb: 1.5, letterSpacing: "0.2px" }}>
                  Why are you reporting this post?
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2.5 }}>
                  {["Spam or misleading", "Harassment or hate speech", "Inappropriate content", "False information", "Other"].map((reason) => (
                    <Box
                      key={reason}
                      onClick={() => setReportReason(reason)}
                      sx={{
                        display: "flex", alignItems: "center", gap: 1.5,
                        px: 1.8, py: 1.3, borderRadius: "12px", cursor: "pointer",
                        border: reportReason === reason ? "2px solid #6879e3" : "1.5px solid #e2e8f0",
                        backgroundColor: reportReason === reason ? "#f0f4ff" : "#f8fafc",
                        transition: "all 0.15s ease",
                        "&:hover": { borderColor: "#6879e3", backgroundColor: "#f0f4ff" },
                      }}
                    >
                      <Box
                        sx={{
                          width: 18, height: 18, borderRadius: "50%",
                          border: reportReason === reason ? "2px solid #6879e3" : "2px solid #cbd5e0",
                          backgroundColor: reportReason === reason ? "#6879e3" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, transition: "all 0.15s",
                        }}
                      >
                        {reportReason === reason && (
                          <Box sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#ffffff" }} />
                        )}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "13.5px",
                          fontWeight: reportReason === reason ? 700 : 500,
                          color: reportReason === reason ? "#3730a3" : "#374151",
                        }}
                      >
                        {reason}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {reportReason === "Other" && (
                  <Box sx={{ mb: 2.5 }}>
                    <textarea
                      value={reportOther}
                      onChange={(e) => setReportOther(e.target.value)}
                      placeholder="Please describe the issue..."
                      rows={3}
                      style={{
                        width: "100%", boxSizing: "border-box", padding: "12px 14px",
                        borderRadius: "12px", border: "1.5px solid #e2e8f0",
                        backgroundColor: "#f8fafc", fontSize: "13px", fontWeight: 500,
                        color: "#374151", fontFamily: "inherit", resize: "none",
                        outline: "none", transition: "border-color 0.15s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#6879e3")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                  </Box>
                )}

                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <Box
                    onClick={closeReport}
                    sx={{
                      flex: 1, py: 1.4, borderRadius: "12px", textAlign: "center",
                      cursor: "pointer", border: "1.5px solid #e2e8f0", backgroundColor: "#f8fafc",
                      transition: "all 0.2s ease",
                      "&:hover": { backgroundColor: "#f1f5f9", borderColor: "#cbd5e0", transform: "translateY(-1px)" },
                    }}
                  >
                    <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#475569" }}>Cancel</Typography>
                  </Box>
                  <Box
                    onClick={handleReportSubmit}
                    sx={{
                      flex: 1, py: 1.4, borderRadius: "12px", textAlign: "center",
                      cursor: reportReason ? "pointer" : "not-allowed",
                      background: reportReason ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" : "#e2e8f0",
                      boxShadow: reportReason ? "0 6px 18px rgba(245,158,11,0.35)" : "none",
                      transition: "all 0.2s ease",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
                      "&:hover": reportReason ? { transform: "translateY(-1px)", boxShadow: "0 10px 24px rgba(245,158,11,0.45)" } : {},
                    }}
                  >
                    {reportSubmitting ? (
                      <>
                        <CircularProgress size={14} sx={{ color: "#fff" }} thickness={3} />
                        <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Submitting...</Typography>
                      </>
                    ) : (
                      <Typography sx={{ fontSize: "14px", fontWeight: 700, color: reportReason ? "#fff" : "#94a3b8" }}>
                        Submit Report
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Photo Dialog */}
      <Dialog
        open={openPhotoDialog}
        onClose={() => { setOpenPhotoDialog(false); setPasteImageMode(false); }}
        PaperProps={{ sx: { borderRadius: "16px", boxShadow: "0 20px 60px rgba(104,121,227,0.2)", minWidth: { xs: "85vw", sm: "500px" } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#1a1a1a", fontSize: "22px", pb: 1.5, pt: 3, px: 3, borderBottom: "2px solid #f0f4ff", background: "#ffffff" }}>
          📸 Add Photo
        </DialogTitle>
        <DialogContent sx={{ pt: 3, px: 3, backgroundColor: "#ffffff" }}>
          {!pasteImageMode ? (
            <Stack spacing={2.5}>
              <Button
                variant="contained" onClick={() => fileInputRef.current.click()} fullWidth
                sx={{ backgroundColor: "#6879e3", color: "white", fontWeight: 700, py: 1.3, fontSize: "15px", borderRadius: "10px", "&:hover": { backgroundColor: "#5a6fd6", transform: "translateY(-2px)" } }}
              >
                Upload from Computer
              </Button>
              <Button
                variant="outlined" onClick={() => setPasteImageMode(true)} fullWidth
                sx={{ borderColor: "#6879e3", color: "#6879e3", fontWeight: 700, py: 1.3, fontSize: "15px", borderRadius: "10px", border: "2px solid #6879e3", "&:hover": { backgroundColor: "#f0f4ff" } }}
              >
                Paste Image URL
              </Button>
            </Stack>
          ) : (
            <Stack spacing={2.5}>
              <TextField
                label="Image URL" value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                fullWidth placeholder="https://example.com/image.jpg"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", "&.Mui-focused fieldset": { borderColor: "#6879e3" } } }}
              />
              <Button
                variant="contained" onClick={handleAddImageUrl} disabled={!imageUrlInput} fullWidth
                sx={{ backgroundColor: "#6879e3", color: "white", fontWeight: 700, py: 1.3, borderRadius: "10px", "&:hover": { backgroundColor: "#5a6fd6" }, "&:disabled": { backgroundColor: "#d0d9f7" } }}
              >
                Add Image URL
              </Button>
            </Stack>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileSelected} />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, backgroundColor: "#ffffff", borderTop: "1px solid #f0f4ff" }}>
          <Button
            onClick={() => { setOpenPhotoDialog(false); setPasteImageMode(false); }}
            sx={{ color: "#999", fontWeight: 700, "&:hover": { backgroundColor: "#f0f4ff", color: "#6879e3" } }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Link Dialog */}
      <Dialog
        open={openLinkDialog}
        onClose={() => setOpenLinkDialog(false)}
        PaperProps={{ sx: { borderRadius: "16px", boxShadow: "0 20px 60px rgba(104,121,227,0.2)", minWidth: { xs: "85vw", sm: "500px" } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#1a1a1a", fontSize: "22px", pb: 1.5, pt: 3, px: 3, borderBottom: "2px solid #f0f4ff", background: "#ffffff" }}>
          🔗 Add Link
        </DialogTitle>
        <DialogContent sx={{ pt: 3, px: 3, backgroundColor: "#ffffff" }}>
          <TextField
            label="Paste Link" value={linkUrlInput}
            onChange={(e) => setLinkUrlInput(e.target.value)}
            fullWidth placeholder="https://example.com"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", "&.Mui-focused fieldset": { borderColor: "#6879e3" } } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, backgroundColor: "#ffffff", borderTop: "1px solid #f0f4ff", gap: 1 }}>
          <Button
            onClick={() => setOpenLinkDialog(false)}
            sx={{ color: "#999", fontWeight: 700, "&:hover": { backgroundColor: "#f0f4ff", color: "#6879e3" } }}
          >
            Cancel
          </Button>
          <Button
            variant="contained" onClick={handleAddLink} disabled={!linkUrlInput}
            sx={{ backgroundColor: "#6879e3", color: "white", fontWeight: 700, px: 3, borderRadius: "8px", "&:hover": { backgroundColor: "#5a6fd6" }, "&:disabled": { backgroundColor: "#d0d9f7" } }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomeFeed;
