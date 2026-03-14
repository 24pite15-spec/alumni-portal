import React from "react";
import { AppBar, Toolbar, Typography, Box, Avatar, CircularProgress } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { getStoredUser, API_BASE_URL } from "../api/config";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";

const getPageTitle = (path) => {
  switch (path) {
    case "/home":           return "Home";
    case "/alumni":         return "Alumni Profile";
    case "/jobs":           return "Jobs";
    case "/events":         return "Events";
    case "/about-me":
    case "/about":          return "About Me";
    case "/admin":          return "User Management";
    case "/admin/reports":  return "Reports";
    default:                return "";
  }
};

const getProfilePhotoUrl = (photoPath) => {
  if (!photoPath) return "";
  if (photoPath.startsWith("http") || photoPath.startsWith("/")) return photoPath;
  return `${API_BASE_URL}/${photoPath}`;
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = React.useState(getStoredUser() || {});
  const [photoLoadFailed, setPhotoLoadFailed] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [pendingReportCount, setPendingReportCount] = React.useState(0);

  const dropdownRef = React.useRef(null);

  const displayName = user.role === "admin" ? "Admin" : (user.fullName || user.email || "Alumni User");
  const avatarSrc = getProfilePhotoUrl(user.profilePhoto);
  const initials = displayName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const isAdmin = user.role === "admin";

  // close dropdown on outside click
  React.useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // listen for user updates
  React.useEffect(() => {
    setPhotoLoadFailed(false);
    const handler = () => setUser(getStoredUser() || {});
    window.addEventListener("userUpdated", handler);
    window.addEventListener("storage", handler);
    return () => { window.removeEventListener("userUpdated", handler); window.removeEventListener("storage", handler); };
  }, []);

  // poll pending report count (admin only)
  React.useEffect(() => {
    if (!isAdmin) return;
    const fetchCount = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/reports/count`);
        if (!res.ok) return;
        const data = await res.json();
        setPendingReportCount(data.count || 0);
      } catch (_) {}
    };
    fetchCount();
    const iv = setInterval(fetchCount, 30000);
    return () => clearInterval(iv);
  }, [isAdmin]);

  const handleLogoutConfirm = () => {
    setLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("user");
      setLoggingOut(false);
      setConfirmOpen(false);
      navigate("/");
    }, 1500);
  };

  return (
    <>
      <AppBar
        position="fixed" elevation={0}
        sx={{
          backgroundColor: "#ffffff", color: "#1a1a1a", borderBottom: "2px solid #f0f4ff",
          zIndex: 1201, ml: { xs: 0, sm: "260px" }, width: { xs: "100%", sm: "calc(100% - 260px)" },
          boxShadow: "0 4px 20px rgba(104,121,227,0.08)", transition: "all 0.3s ease",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2, px: { xs: 2, sm: 3 }, minHeight: "75px", gap: { xs: 1, sm: 3 } }}>
          {/* Page title */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1, minWidth: 0 }}>
            <Box sx={{ width: "4px", height: "28px", backgroundColor: "#6879e3", borderRadius: "2px" }} />
            <Typography sx={{ fontSize: { xs: 16, sm: 20 }, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.5px", textOverflow: "ellipsis", overflow: "hidden" }}>
              {getPageTitle(location.pathname)}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2.5 }}>

            {/* Reports bell (admin only) */}
            {isAdmin && (
              <Box
                onClick={() => navigate("/admin/reports")}
                sx={{
                  position: "relative", cursor: "pointer",
                  width: 38, height: 38, borderRadius: "10px",
                  backgroundColor: location.pathname === "/admin/reports" ? "#f0f4ff" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s ease",
                  "&:hover": { backgroundColor: "#f0f4ff" },
                }}
              >
                <ReportGmailerrorredIcon sx={{ fontSize: 22, color: pendingReportCount > 0 ? "#ef4444" : "#bbb" }} />
                {pendingReportCount > 0 && (
                  <Box sx={{
                    position: "absolute", top: -3, right: -3,
                    minWidth: 18, height: 18, borderRadius: "9px", backgroundColor: "#ef4444",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    px: 0.5, border: "2px solid #fff",
                    animation: "badgePulse 2s ease-in-out infinite",
                    "@keyframes badgePulse": {
                      "0%, 100%": { boxShadow: "0 0 0 0 rgba(239,68,68,0.4)" },
                      "50%": { boxShadow: "0 0 0 6px rgba(239,68,68,0)" },
                    },
                  }}>
                    <Typography sx={{ fontSize: "9px", fontWeight: 900, color: "#fff", lineHeight: 1 }}>
                      {pendingReportCount > 99 ? "99+" : pendingReportCount}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            <Box sx={{ width: "1px", height: "32px", backgroundColor: "#e8eaf6" }} />

            {/* Avatar + dropdown */}
            <Box ref={dropdownRef} sx={{ position: "relative" }}>
              <Box display="flex" alignItems="center" gap={{ xs: 0.5, sm: 1.5 }}
                onClick={() => setDropdownOpen(o => !o)}
                sx={{ cursor: "pointer", px: 1, py: 0.5, borderRadius: "10px", backgroundColor: dropdownOpen ? "#f0f4ff" : "transparent", transition: "all 0.2s ease", "&:hover": { backgroundColor: "#f0f4ff" } }}>
                <Avatar
                  src={avatarSrc && !photoLoadFailed ? avatarSrc : undefined}
                  alt={displayName}
                  onError={() => setPhotoLoadFailed(true)}
                  sx={{ width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 }, backgroundColor: "#6879e3", color: "white", fontWeight: 700, fontSize: { xs: "14px", sm: "16px" }, boxShadow: "0 4px 12px rgba(104,121,227,0.25)", transition: "all 0.2s ease", "&:hover": { boxShadow: "0 6px 18px rgba(104,121,227,0.35)", transform: "scale(1.05)" } }}>
                  {(!avatarSrc || photoLoadFailed) && initials}
                </Avatar>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2 }}>{displayName}</Typography>
                </Box>
                <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", color: "#6879e3", transition: "transform 0.2s", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Box>
              </Box>

              {dropdownOpen && (
                <Box sx={{
                  position: "absolute", top: "calc(100% + 12px)", right: 0, width: 220, backgroundColor: "#ffffff",
                  borderRadius: "14px", boxShadow: "0 20px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(104,121,227,0.1)",
                  border: "1px solid #e8eaf6", overflow: "hidden", zIndex: 1300,
                  animation: "dropFade 0.18s cubic-bezier(0.16,1,0.3,1)",
                  "@keyframes dropFade": { "0%": { opacity: 0, transform: "translateY(-8px) scale(0.97)" }, "100%": { opacity: 1, transform: "translateY(0) scale(1)" } },
                  "&::before": { content: '""', position: "absolute", top: "-7px", right: "18px", width: 0, height: 0, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderBottom: "7px solid #ffffff", filter: "drop-shadow(0 -2px 2px rgba(0,0,0,0.05))" }
                }}>
                  <Box sx={{ px: 2, py: 1.8, background: "linear-gradient(135deg, #6879e3 0%, #5a6fd6 100%)", display: "flex", alignItems: "center", gap: 1.2 }}>
                    <Avatar src={avatarSrc && !photoLoadFailed ? avatarSrc : undefined} sx={{ width: 36, height: 36, backgroundColor: "rgba(255,255,255,0.25)", color: "#fff", fontWeight: 800, fontSize: "13px", border: "2px solid rgba(255,255,255,0.4)", flexShrink: 0 }}>
                      {(!avatarSrc || photoLoadFailed) && initials}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: "13px", fontWeight: 800, color: "#fff", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</Typography>
                      <Typography sx={{ fontSize: "10px", color: "rgba(255,255,255,0.7)", fontWeight: 500, mt: 0.2 }}>{user.role === "admin" ? "Administrator" : "Alumni Member"}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 1 }}>
                    <Box onClick={() => { setDropdownOpen(false); setConfirmOpen(true); }}
                      sx={{ display: "flex", alignItems: "center", gap: 1.2, px: 1.5, py: 1.2, borderRadius: "10px", cursor: "pointer", transition: "all 0.15s ease", "&:hover": { backgroundColor: "#fff1f1" } }}>
                      <Box sx={{ width: 30, height: 30, borderRadius: "8px", backgroundColor: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <LogoutOutlinedIcon sx={{ fontSize: 16, color: "#dc2626" }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#dc2626" }}>Logout</Typography>
                        <Typography sx={{ fontSize: "10px", color: "#f87171", fontWeight: 500 }}>End your session</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Logout Confirmation */}
      {confirmOpen && (
        <Box
          onClick={() => !loggingOut && setConfirmOpen(false)}
          sx={{ position: "fixed", inset: 0, zIndex: 9999, backgroundColor: "rgba(15,23,42,0.45)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "bgFade 0.2s ease", "@keyframes bgFade": { "0%": { opacity: 0 }, "100%": { opacity: 1 } } }}>
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{ width: { xs: "90vw", sm: 420 }, backgroundColor: "#ffffff", borderRadius: "24px", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.1)", animation: "cardPop 0.25s cubic-bezier(0.16,1,0.3,1)", "@keyframes cardPop": { "0%": { opacity: 0, transform: "scale(0.93) translateY(16px)" }, "100%": { opacity: 1, transform: "scale(1) translateY(0)" } } }}>
            <Box sx={{ height: "5px", background: "linear-gradient(90deg, #dc2626 0%, #ef4444 50%, #f87171 100%)" }} />
            <Box sx={{ px: 4, pt: 3.5, pb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2.5 }}>
                <Box sx={{ width: 52, height: 52, borderRadius: "14px", backgroundColor: "#fff1f1", border: "1.5px solid #fecaca", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <LogoutOutlinedIcon sx={{ fontSize: 26, color: "#dc2626" }} />
                </Box>
                <Box sx={{ pt: 0.5 }}>
                  <Typography sx={{ fontSize: "18px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.3px", lineHeight: 1.2 }}>Confirm Logout</Typography>
                  <Typography sx={{ fontSize: "13px", color: "#94a3b8", fontWeight: 500, mt: 0.5 }}>This action will end your session</Typography>
                </Box>
              </Box>
              <Box sx={{ height: "1px", backgroundColor: "#f1f5f9", mb: 2.5 }} />
              <Typography sx={{ fontSize: "14px", color: "#475569", fontWeight: 500, lineHeight: 1.75, mb: 2.5 }}>
                Are you sure you want to logout? You'll need to sign in again to access your account and continue where you left off.
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.8, backgroundColor: "#f8fafc", borderRadius: "14px", border: "1.5px solid #e2e8f0", mb: 3 }}>
                <Avatar src={avatarSrc && !photoLoadFailed ? avatarSrc : undefined} sx={{ width: 40, height: 40, backgroundColor: "#6879e3", color: "#fff", fontWeight: 800, fontSize: "14px", boxShadow: "0 4px 10px rgba(104,121,227,0.3)", flexShrink: 0 }}>
                  {(!avatarSrc || photoLoadFailed) && initials}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</Typography>
                  <Typography sx={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>{user.email || (user.role === "admin" ? "Administrator" : "Alumni Member")}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Box onClick={() => !loggingOut && setConfirmOpen(false)}
                  sx={{ flex: 1, py: 1.4, borderRadius: "12px", textAlign: "center", cursor: loggingOut ? "not-allowed" : "pointer", border: "1.5px solid #e2e8f0", backgroundColor: "#f8fafc", opacity: loggingOut ? 0.5 : 1, transition: "all 0.2s ease", "&:hover": !loggingOut ? { backgroundColor: "#f1f5f9", borderColor: "#cbd5e0", transform: "translateY(-1px)" } : {} }}>
                  <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#475569" }}>Cancel</Typography>
                </Box>
                <Box onClick={() => !loggingOut && handleLogoutConfirm()}
                  sx={{ flex: 1, py: 1.4, borderRadius: "12px", textAlign: "center", cursor: loggingOut ? "not-allowed" : "pointer", background: loggingOut ? "#ef4444" : "linear-gradient(135deg,#dc2626,#ef4444)", boxShadow: "0 6px 20px rgba(220,38,38,0.35)", transition: "all 0.2s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: 1, "&:hover": !loggingOut ? { background: "linear-gradient(135deg,#b91c1c,#dc2626)", boxShadow: "0 10px 28px rgba(220,38,38,0.45)", transform: "translateY(-1px)" } : {} }}>
                  {loggingOut ? (
                    <><CircularProgress size={15} sx={{ color: "#fff" }} thickness={3} />
                      <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Logging out...</Typography></>
                  ) : (
                    <><LogoutOutlinedIcon sx={{ fontSize: 16, color: "#fff" }} />
                      <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Yes, Logout</Typography></>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Navbar;
