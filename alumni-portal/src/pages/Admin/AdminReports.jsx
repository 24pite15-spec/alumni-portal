import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../../api/config";
import API_BASE_URL from "../../api/config";
import {
  Box, Typography, Paper, CircularProgress,
  Snackbar, Alert, Tooltip, Divider, Pagination,
  Select, MenuItem, FormControl, InputLabel, Stack,
} from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon   from "@mui/icons-material/Visibility";
import CheckCircleIcon  from "@mui/icons-material/CheckCircle";
import CloseIcon        from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import RefreshIcon      from "@mui/icons-material/Refresh";

/* ─────────────────────────── helpers ──────────────────────────── */
const STATUS_STYLE = {
  PENDING:   { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa", dot: "#f97316" },
  RESOLVED:  { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0", dot: "#22c55e" },
  DISMISSED: { bg: "#f8fafc", color: "#64748b", border: "#e2e8f0", dot: "#94a3b8" },
};
const getStatusStyle = (s) => STATUS_STYLE[String(s).toUpperCase()] || STATUS_STYLE.DISMISSED;

const REASON_ICON = (r = "") => {
  if (r.toLowerCase().includes("spam"))           return { icon: "🚫", bg: "#fee2e2", color: "#dc2626" };
  if (r.toLowerCase().includes("harassment"))     return { icon: "😡", bg: "#fce7f3", color: "#be185d" };
  if (r.toLowerCase().includes("inappropriate"))  return { icon: "⚠️", bg: "#fef3c7", color: "#b45309" };
  if (r.toLowerCase().includes("false"))          return { icon: "❌", bg: "#fee2e2", color: "#dc2626" };
  return { icon: "📋", bg: "#ede9fe", color: "#7c3aed" };
};

/* ─────────────────── Stat Card ────────────────────────────────── */
const StatCard = ({ label, count, color, bg, border, active, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      flex: 1, minWidth: 110, px: 2.5, py: 2, borderRadius: "14px", cursor: "pointer",
      backgroundColor: active ? color : "#ffffff",
      border: `2px solid ${active ? color : border}`,
      boxShadow: active ? `0 8px 24px ${color}30` : "0 2px 8px rgba(0,0,0,0.06)",
      transition: "all 0.22s ease",
      "&:hover": { transform: "translateY(-2px)", boxShadow: `0 10px 28px ${color}25`, borderColor: color },
    }}
  >
    <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase",
      color: active ? "rgba(255,255,255,0.85)" : "#94a3b8", mb: 0.5 }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: 26, fontWeight: 900, color: active ? "#ffffff" : color, lineHeight: 1 }}>
      {count}
    </Typography>
  </Box>
);

/* ─────────────────── Confirm Modal ────────────────────────────── */
const ConfirmModal = ({ open, type, report, onConfirm, onClose, loading }) => {
  if (!open) return null;
  const isHide = type === "hide";

  return (
    <Box
      onClick={() => !loading && onClose()}
      sx={{
        position: "fixed", inset: 0, zIndex: 9999,
        backgroundColor: "rgba(15,23,42,0.4)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "bgFade 0.18s ease",
        "@keyframes bgFade": { from: { opacity: 0 }, to: { opacity: 1 } },
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: { xs: "92vw", sm: 460 }, backgroundColor: "#ffffff",
          borderRadius: "20px", overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.08)",
          animation: "popIn 0.25s cubic-bezier(0.16,1,0.3,1)",
          "@keyframes popIn": {
            from: { opacity: 0, transform: "scale(0.92) translateY(18px)" },
            to:   { opacity: 1, transform: "scale(1) translateY(0)" },
          },
        }}
      >
        {/* accent stripe */}
        <Box sx={{
          height: 5,
          background: isHide
            ? "linear-gradient(90deg,#ef4444,#f87171)"
            : "linear-gradient(90deg,#667eea,#764ba2)",
        }} />

        <Box sx={{ p: 3.5 }}>
          {/* header row */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2.5 }}>
            <Box sx={{
              width: 52, height: 52, borderRadius: "14px", flexShrink: 0,
              backgroundColor: isHide ? "#fee2e2" : "#ede9fe",
              border: `1.5px solid ${isHide ? "#fecaca" : "#ddd6fe"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {isHide
                ? <VisibilityOffIcon sx={{ fontSize: 24, color: "#dc2626" }} />
                : <VisibilityIcon   sx={{ fontSize: 24, color: "#7c3aed" }} />
              }
            </Box>
            <Box sx={{ flex: 1, pt: 0.3 }}>
              <Typography sx={{ fontSize: 18, fontWeight: 900, color: "#0f172a", lineHeight: 1.25 }}>
                {isHide ? "Hide This Post?" : "Restore This Post?"}
              </Typography>
              <Typography sx={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, mt: 0.4 }}>
                {isHide ? "Post will be removed from the public feed" : "Post will become visible in the feed again"}
              </Typography>
            </Box>
            <Box
              onClick={() => !loading && onClose()}
              sx={{
                width: 30, height: 30, borderRadius: "8px", backgroundColor: "#f1f5f9",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: loading ? "not-allowed" : "pointer", flexShrink: 0,
                "&:hover": { backgroundColor: "#e2e8f0" }, transition: "background 0.15s",
              }}
            >
              <CloseIcon sx={{ fontSize: 15, color: "#64748b" }} />
            </Box>
          </Box>

          <Divider sx={{ mb: 2.5, borderColor: "#f1f5f9" }} />

          {/* post preview */}
          {report && (
            <Box sx={{ mb: 2.5, p: 2, backgroundColor: "#f8fafc", borderRadius: "12px", border: "1.5px solid #e8eaf6" }}>
              <Typography sx={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", mb: 0.8 }}>
                Post Preview
              </Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#334155", mb: 0.6 }}>
                ✍️ {report.post_author || "Unknown Author"}
              </Typography>
              {report.post_description && (
                <Typography sx={{ fontSize: 13, color: "#475569", lineHeight: 1.65,
                  display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {report.post_description}
                </Typography>
              )}
              {report.post_image_path && (
                <Box component="img" src={`${API_BASE_URL}/${report.post_image_path}`} alt="post"
                  sx={{ mt: 1, width: "100%", maxHeight: 110, objectFit: "cover", borderRadius: "8px" }} />
              )}
            </Box>
          )}

          {/* warning strip for hide */}
          {isHide && (
            <Box sx={{ mb: 2.5, p: 1.5, backgroundColor: "#fff7ed", borderRadius: "10px",
              border: "1px solid #fed7aa", display: "flex", alignItems: "flex-start", gap: 1 }}>
              <WarningAmberIcon sx={{ fontSize: 16, color: "#ea580c", mt: 0.1, flexShrink: 0 }} />
              <Typography sx={{ fontSize: 12, color: "#c2410c", fontWeight: 600, lineHeight: 1.55 }}>
                All pending reports for this post will be marked as Resolved. You can undo this by restoring the post.
              </Typography>
            </Box>
          )}

          {/* action buttons */}
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Box
              onClick={() => !loading && onClose()}
              sx={{
                flex: 1, py: 1.4, borderRadius: "11px", textAlign: "center",
                cursor: loading ? "not-allowed" : "pointer",
                border: "1.5px solid #e2e8f0", backgroundColor: "#f8fafc",
                opacity: loading ? 0.5 : 1, transition: "all 0.2s ease",
                "&:hover": !loading ? { backgroundColor: "#f1f5f9", transform: "translateY(-1px)" } : {},
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#64748b" }}>Cancel</Typography>
            </Box>
            <Box
              onClick={() => !loading && onConfirm()}
              sx={{
                flex: 1.3, py: 1.4, borderRadius: "11px", textAlign: "center",
                cursor: loading ? "not-allowed" : "pointer",
                background: isHide
                  ? "linear-gradient(135deg,#dc2626,#ef4444)"
                  : "linear-gradient(135deg,#667eea,#764ba2)",
                boxShadow: isHide ? "0 6px 20px rgba(220,38,38,0.3)" : "0 6px 20px rgba(102,126,234,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
                transition: "all 0.2s ease",
                "&:hover": !loading ? {
                  transform: "translateY(-1px)",
                  boxShadow: isHide ? "0 10px 28px rgba(220,38,38,0.4)" : "0 10px 28px rgba(102,126,234,0.4)",
                } : {},
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={14} sx={{ color: "#fff" }} thickness={3} />
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Processing...</Typography>
                </>
              ) : (
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
                  {isHide ? "Yes, Hide Post" : "Yes, Restore Post"}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

/* ─────────────────── Main Page ─────────────────────────────────── */
const AdminReports = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = getStoredUser();
    if (!user || user.role !== "admin") navigate("/home");
  }, [navigate]);

  const [reports,       setReports]       = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error,         setError]         = useState("");
  const [snackbar,      setSnackbar]      = useState({ open: false, message: "", severity: "success" });
  const [filterStatus,  setFilterStatus]  = useState("ALL");
  const [currentPage,   setCurrentPage]   = useState(1);
  const [recordsPerPage,setRecordsPerPage]= useState(10);
  const [confirmModal,  setConfirmModal]  = useState({ open: false, type: null, report: null });

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`${API_BASE_URL}/admin/reports`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch reports");
      setReports(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (err) {
      setError(err.message || "Unable to load reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  /* counts */
  const counts = {
    ALL:       reports.length,
    PENDING:   reports.filter(r => String(r.status).toUpperCase() === "PENDING").length,
    RESOLVED:  reports.filter(r => String(r.status).toUpperCase() === "RESOLVED").length,
    DISMISSED: reports.filter(r => String(r.status).toUpperCase() === "DISMISSED").length,
  };

  const filtered = reports.filter(r =>
    filterStatus === "ALL" || String(r.status).toUpperCase() === filterStatus
  );
  const totalPages      = Math.ceil(filtered.length / recordsPerPage);
  const startIndex      = (currentPage - 1) * recordsPerPage;
  const paginated       = filtered.slice(startIndex, startIndex + recordsPerPage);

  /* modal helpers */
  const openConfirm  = (report) => setConfirmModal({ open: true, type: report.is_hidden ? "unhide" : "hide", report });
  const closeConfirm = ()        => setConfirmModal({ open: false, type: null, report: null });

  const handleConfirmAction = async () => {
    const { type, report } = confirmModal;
    setActionLoading(true);
    try {
      const url = type === "hide"
        ? `${API_BASE_URL}/admin/posts/${report.post_id}/hide`
        : `${API_BASE_URL}/admin/posts/${report.post_id}/unhide`;
      const res  = await fetch(url, { method: "PUT" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Action failed");
      setSnackbar({ open: true, message: type === "hide" ? "✅ Post hidden from feed." : "✅ Post restored to feed.", severity: "success" });
      closeConfirm();
      fetchReports();
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Action failed.", severity: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDismiss = async (reportId) => {
    try {
      const res  = await fetch(`${API_BASE_URL}/admin/reports/${reportId}/dismiss`, { method: "PUT" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Dismiss failed");
      setSnackbar({ open: true, message: "Report dismissed.", severity: "info" });
      fetchReports();
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  /* ── render ── */
  return (
    <Box sx={{
      p: { xs: 2, md: 4 },
      minHeight: "100vh",
      background: "linear-gradient(135deg,#f5f7fa 0%,#e8ecf8 100%)",
    }}>

      {/* ── Page title ── */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.8 }}>
          <Box sx={{
            width: 46, height: 46, borderRadius: "13px",
            background: "linear-gradient(135deg,#667eea,#764ba2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 18px rgba(102,126,234,0.35)",
          }}>
            <ReportGmailerrorredIcon sx={{ fontSize: 24, color: "#fff" }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Reports Management
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#64748b", fontWeight: 500, mt: 0.3 }}>
              Review flagged posts and take appropriate action
            </Typography>
          </Box>
          {counts.PENDING > 0 && (
            <Box sx={{
              ml: 1, px: 1.8, py: 0.6, borderRadius: "20px",
              background: "linear-gradient(135deg,#ef4444,#f87171)",
              boxShadow: "0 4px 14px rgba(239,68,68,0.4)",
              display: "flex", alignItems: "center", gap: 0.7,
            }}>
              <Box sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#fff",
                animation: "blink 1.4s ease-in-out infinite",
                "@keyframes blink": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.3 } } }} />
              <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>
                {counts.PENDING} Pending
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* ── Stat cards row ── */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <StatCard label="All Reports"  count={counts.ALL}       color="#667eea" bg="#ede9fe" border="#ddd6fe"
          active={filterStatus === "ALL"}       onClick={() => { setFilterStatus("ALL");       setCurrentPage(1); }} />
        <StatCard label="Pending"      count={counts.PENDING}   color="#f97316" bg="#fff7ed" border="#fed7aa"
          active={filterStatus === "PENDING"}   onClick={() => { setFilterStatus("PENDING");   setCurrentPage(1); }} />
        <StatCard label="Resolved"     count={counts.RESOLVED}  color="#22c55e" bg="#f0fdf4" border="#bbf7d0"
          active={filterStatus === "RESOLVED"}  onClick={() => { setFilterStatus("RESOLVED");  setCurrentPage(1); }} />
        <StatCard label="Dismissed"    count={counts.DISMISSED} color="#94a3b8" bg="#f8fafc" border="#e2e8f0"
          active={filterStatus === "DISMISSED"} onClick={() => { setFilterStatus("DISMISSED"); setCurrentPage(1); }} />
      </Box>

      {/* ── Main panel ── */}
      <Paper elevation={0} sx={{
        borderRadius: "20px", overflow: "hidden",
        border: "1.5px solid #e8eaf6",
        boxShadow: "0 8px 40px rgba(102,126,234,0.1)",
        backgroundColor: "#ffffff",
      }}>

        {/* panel header */}
        <Box sx={{
          px: 3, py: 2.5,
          background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2,
        }}>
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>
              {filterStatus === "ALL" ? "All Reports" : `${filterStatus.charAt(0) + filterStatus.slice(1).toLowerCase()} Reports`}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.75)", mt: 0.3 }}>
              Showing {filtered.length} report{filtered.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
          <Box
            onClick={fetchReports}
            sx={{
              display: "flex", alignItems: "center", gap: 0.8,
              px: 2.2, py: 1, borderRadius: "10px", cursor: "pointer",
              backgroundColor: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)",
              transition: "all 0.2s ease",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.28)", transform: "translateY(-1px)" },
            }}
          >
            {loading
              ? <CircularProgress size={14} sx={{ color: "#fff" }} thickness={3} />
              : <RefreshIcon sx={{ fontSize: 16, color: "#fff" }} />
            }
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Refresh</Typography>
          </Box>
        </Box>

        {/* error banner */}
        {error && (
          <Box sx={{ px: 3, py: 1.5, backgroundColor: "#fff5f5", borderBottom: "1px solid #fecaca",
            display: "flex", alignItems: "center", gap: 1 }}>
            <WarningAmberIcon sx={{ fontSize: 16, color: "#dc2626" }} />
            <Typography sx={{ color: "#dc2626", fontWeight: 600, fontSize: 13 }}>{error}</Typography>
          </Box>
        )}

        {/* report list */}
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {loading && paginated.length === 0 ? (
            <Box sx={{ py: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <CircularProgress sx={{ color: "#667eea" }} size={44} thickness={3.5} />
              <Typography sx={{ color: "#94a3b8", fontWeight: 600, fontSize: 14 }}>Loading reports...</Typography>
            </Box>
          ) : paginated.length === 0 ? (
            <Box sx={{ py: 10, textAlign: "center" }}>
              <Box sx={{ fontSize: 48, mb: 2 }}>📭</Box>
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#334155", mb: 0.8 }}>No reports found</Typography>
              <Typography sx={{ color: "#94a3b8", fontSize: 14 }}>
                {filterStatus !== "ALL" ? `No ${filterStatus.toLowerCase()} reports at the moment` : "No reports have been submitted yet"}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {paginated.map((report) => {
                const sc       = getStatusStyle(report.status);
                const ri       = REASON_ICON(report.reported_reason);
                const isHidden = !!report.is_hidden;
                const isPending = String(report.status).toUpperCase() === "PENDING";

                return (
                  <Paper
                    key={report.id}
                    elevation={0}
                    sx={{
                      borderRadius: "16px",
                      border: `1.5px solid ${isPending ? "#e0e7ff" : "#f1f5f9"}`,
                      backgroundColor: "#ffffff",
                      overflow: "hidden",
                      transition: "all 0.22s ease",
                      "&:hover": {
                        borderColor: "#c7d2fe",
                        boxShadow: "0 8px 32px rgba(102,126,234,0.12)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    {/* top colour stripe */}
                    <Box sx={{ height: 3, background: isPending
                      ? "linear-gradient(90deg,#667eea,#764ba2)"
                      : isHidden
                        ? "linear-gradient(90deg,#94a3b8,#cbd5e1)"
                        : "linear-gradient(90deg,#22c55e,#4ade80)" }} />

                    <Box sx={{ p: { xs: 2, md: 2.5 } }}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>

                        {/* ── LEFT ── */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>

                          {/* badges row */}
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.8, flexWrap: "wrap" }}>

                            {/* reason icon badge */}
                            <Box sx={{ width: 32, height: 32, borderRadius: "9px", backgroundColor: ri.bg,
                              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>
                              {ri.icon}
                            </Box>

                            {/* status pill */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, px: 1.4, py: 0.45,
                              borderRadius: "20px", backgroundColor: sc.bg, border: `1px solid ${sc.border}` }}>
                              <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: sc.dot }} />
                              <Typography sx={{ fontSize: 11, fontWeight: 800, color: sc.color, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                {report.status}
                              </Typography>
                            </Box>

                            {/* hidden pill */}
                            {isHidden && (
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 1.2, py: 0.45,
                                borderRadius: "20px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                                <VisibilityOffIcon sx={{ fontSize: 11, color: "#94a3b8" }} />
                                <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>Hidden</Typography>
                              </Box>
                            )}

                            {/* IDs */}
                            <Typography sx={{ fontSize: 11, color: "#cbd5e1", fontWeight: 600, ml: 0.5 }}>
                              Report #{report.id} · Post #{report.post_id}
                            </Typography>
                          </Box>

                          {/* reason text */}
                          <Box sx={{ mb: 1.8, p: 1.5, backgroundColor: "#f8fafc", borderRadius: "10px",
                            border: "1px solid #f1f5f9", display: "inline-flex", alignItems: "center", gap: 1 }}>
                            <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                              Reason:
                            </Typography>
                            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>
                              {report.reported_reason || "—"}
                            </Typography>
                          </Box>

                          {/* meta row */}
                          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 1.8 }}>
                            {[
                              { label: "Reported By", value: report.reported_by || `User #${report.user_id}` },
                              { label: "Post Author",  value: report.post_author || "Unknown" },
                              { label: "Date & Time",  value: report.reported_date
                                ? `${new Date(report.reported_date).toLocaleDateString("en-IN",{ day:"2-digit", month:"short", year:"numeric" })}${report.reported_time ? " · " + report.reported_time.slice(0,5) : ""}`
                                : "—" },
                            ].map(({ label, value }) => (
                              <Box key={label}>
                                <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", mb: 0.3 }}>
                                  {label}
                                </Typography>
                                <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{value}</Typography>
                              </Box>
                            ))}
                          </Box>

                          {/* post content preview */}
                          {(report.post_description || report.post_image_path) && (
                            <Box sx={{ p: 2, backgroundColor: "#f8fafc", borderRadius: "12px",
                              border: "1.5px solid #e8eaf6", mt: 0.5 }}>
                              <Typography sx={{ fontSize: 10, fontWeight: 800, color: "#667eea", textTransform: "uppercase",
                                letterSpacing: "0.6px", mb: 0.8, display: "flex", alignItems: "center", gap: 0.5 }}>
                                📄 Post Content
                              </Typography>
                              {report.post_description && (
                                <Typography sx={{ fontSize: 13, color: "#475569", lineHeight: 1.65,
                                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                  {report.post_description}
                                </Typography>
                              )}
                              {report.post_image_path && (
                                <Box component="img"
                                  src={`${API_BASE_URL}/${report.post_image_path}`}
                                  alt="reported post"
                                  sx={{ mt: 1, maxHeight: 90, borderRadius: "8px", objectFit: "cover", display: "block",
                                    border: "1px solid #e2e8f0" }}
                                />
                              )}
                            </Box>
                          )}
                        </Box>

                        {/* ── RIGHT: actions ── */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2, alignItems: "stretch", minWidth: 136, flexShrink: 0 }}>

                          {/* Hide / Restore */}
                          <Tooltip title={isHidden ? "Restore post to public feed" : "Hide post from public feed"} arrow placement="left">
                            <Box
                              onClick={() => openConfirm(report)}
                              sx={{
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 0.8,
                                px: 2, py: 1.1, borderRadius: "10px", cursor: "pointer",
                                backgroundColor: isHidden ? "#f0fdf4" : "#fff5f5",
                                border: `1.5px solid ${isHidden ? "#bbf7d0" : "#fecaca"}`,
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  transform: "translateY(-2px)",
                                  boxShadow: isHidden ? "0 6px 16px rgba(34,197,94,0.2)" : "0 6px 16px rgba(239,68,68,0.2)",
                                  backgroundColor: isHidden ? "#dcfce7" : "#fee2e2",
                                },
                              }}
                            >
                              {isHidden
                                ? <VisibilityIcon   sx={{ fontSize: 16, color: "#16a34a" }} />
                                : <VisibilityOffIcon sx={{ fontSize: 16, color: "#dc2626" }} />
                              }
                              <Typography sx={{ fontSize: 12, fontWeight: 700, color: isHidden ? "#15803d" : "#dc2626" }}>
                                {isHidden ? "Restore Post" : "Hide Post"}
                              </Typography>
                            </Box>
                          </Tooltip>

                          {/* Dismiss — only for pending */}
                          {isPending && (
                            <Tooltip title="Mark report as dismissed (post stays visible)" arrow placement="left">
                              <Box
                                onClick={() => handleDismiss(report.id)}
                                sx={{
                                  display: "flex", alignItems: "center", justifyContent: "center", gap: 0.8,
                                  px: 2, py: 1.1, borderRadius: "10px", cursor: "pointer",
                                  backgroundColor: "#f8fafc", border: "1.5px solid #e2e8f0",
                                  transition: "all 0.2s ease",
                                  "&:hover": { backgroundColor: "#f1f5f9", transform: "translateY(-1px)", borderColor: "#cbd5e1" },
                                }}
                              >
                                <CheckCircleIcon sx={{ fontSize: 16, color: "#667eea" }} />
                                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#667eea" }}>Dismiss</Typography>
                              </Box>
                            </Tooltip>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          )}
        </Box>

        {/* ── Pagination footer ── */}
        {filtered.length > 0 && (
          <Box sx={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            px: 3, py: 2, borderTop: "1.5px solid #f1f5f9",
            backgroundColor: "#fafbff", flexWrap: "wrap", gap: 2,
          }}>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              <FormControl sx={{ minWidth: 155 }} size="small">
                <InputLabel sx={{ fontSize: 13, fontWeight: 600, color: "#667eea" }}>Rows per page</InputLabel>
                <Select
                  value={recordsPerPage}
                  onChange={(e) => { setRecordsPerPage(e.target.value); setCurrentPage(1); }}
                  label="Rows per page"
                  sx={{ borderRadius: "10px", fontSize: 13, fontWeight: 600,
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e7ff" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#667eea" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#667eea" },
                  }}
                >
                  {[5, 10, 20, 50].map(n => (
                    <MenuItem key={n} value={n} sx={{ fontSize: 13, fontWeight: 600 }}>{n} per page</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#667eea" }}>
                {startIndex + 1}–{Math.min(startIndex + recordsPerPage, filtered.length)} of {filtered.length}
              </Typography>
            </Stack>
            <Pagination
              count={totalPages} page={currentPage}
              onChange={(_, v) => { setCurrentPage(v); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              variant="outlined" shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": {
                  borderColor: "#e0e7ff", color: "#667eea", fontWeight: 700, fontSize: 13,
                  "&.Mui-selected": { backgroundColor: "#667eea", color: "#fff", borderColor: "#667eea" },
                  "&:hover:not(.Mui-selected)": { backgroundColor: "#ede9fe", borderColor: "#667eea" },
                },
              }}
            />
          </Box>
        )}
      </Paper>

      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmModal.open}
        type={confirmModal.type}
        report={confirmModal.report}
        onConfirm={handleConfirmAction}
        onClose={closeConfirm}
        loading={actionLoading}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open} autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%", fontWeight: 600, borderRadius: "12px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminReports;
