import React, { useState, useEffect } from "react";
import {
  Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Divider, Popover, Button,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import { useNavigate, useLocation } from "react-router-dom";
import API_BASE_URL from "../api/config";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingReportCount, setPendingReportCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";
  const displayName = user.fullName || user.email || "";

  // ── Poll for pending report count (admin only) ──────────────────
  useEffect(() => {
    if (!isAdmin) return;

    const fetchCount = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/reports/count`);
        if (!res.ok) return;
        const data = await res.json();
        setPendingReportCount(data.count || 0);
      } catch (_) {
        // silently ignore network errors
      }
    };

    fetchCount();                              // immediate
    const interval = setInterval(fetchCount, 30000); // every 30s
    return () => clearInterval(interval);
  }, [isAdmin]);

  const dynamicMenuItems = [
    { text: "Feeds", icon: <HomeOutlinedIcon />, path: "/home" },
    { text: "Alumni Profile", icon: <PeopleOutlineIcon />, path: "/alumni" },
    ...(!isAdmin ? [{ text: "Job", icon: <WorkOutlineIcon />, path: "/job" }] : []),
    { text: "Events", icon: <EventOutlinedIcon />, path: "/events" },
    ...(!isAdmin ? [{ text: "About Me", icon: <PersonOutlineIcon />, path: "/about-me" }] : []),
    ...(isAdmin ? [
      { text: "User Management", icon: <AdminPanelSettingsIcon />, path: "/admin" },
      {
        text: "Reports",
        icon: <ReportGmailerrorredIcon />,
        path: "/admin/reports",
        badge: pendingReportCount,
      },
    ] : []),
  ];

  const handleLogoutClick = (event) => setAnchorEl(event.currentTarget);
  const handleClosePopover = () => setAnchorEl(null);

  const confirmLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.removeItem("user");
      setIsLoading(false);
      handleClosePopover();
      navigate("/");
    }, 1500);
  };

  const open = Boolean(anchorEl);
  const id = open ? "logout-popover" : undefined;

  return (
    <Box
      sx={{
        width: { xs: 0, sm: 260 }, height: "100vh", backgroundColor: "#ffffff",
        borderRight: "1px solid #e8eaf6", display: "flex", flexDirection: "column",
        position: "fixed", left: 0, top: 0, zIndex: 1200,
        transition: "all 0.3s ease", boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      {/* LOGO */}
      <Box sx={{ p: 3, background: "linear-gradient(135deg, #6879e3 0%, #5a6fd6 100%)" }}>
        <Typography fontSize="22px" fontWeight="700" color="#ffffff" sx={{ letterSpacing: "-0.5px" }}>
          🎓 ALUMNI
        </Typography>
        <Typography fontSize="11px" fontWeight="500" color="rgba(255,255,255,0.8)" sx={{ mt: 0.5 }}>
          Community Network
        </Typography>
        {displayName && (
          <Typography fontSize="13px" fontWeight="600" color="#ffffff" sx={{ mt: 1 }}>
            {displayName}
          </Typography>
        )}
      </Box>

      <Divider sx={{ borderColor: "#e8eaf6" }} />

      {/* MENU */}
      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {dynamicMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const hasBadge = item.badge && item.badge > 0;
          return (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: "10px", mb: 1.5,
                backgroundColor: isActive ? "#f0f4ff" : "transparent",
                borderLeft: isActive ? "3px solid #6879e3" : "none",
                pl: isActive ? "calc(1rem - 3px)" : "1rem",
                transition: "all 0.2s ease",
                "&:hover": { backgroundColor: "#f7faff", borderLeft: isActive ? "3px solid #6879e3" : "none" },
              }}
            >
              <ListItemIcon sx={{ color: isActive ? "#6879e3" : "#999", minWidth: "40px", transition: "color 0.2s ease" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontSize: "14px", fontWeight: isActive ? "700" : "500", color: isActive ? "#6879e3" : "#2d3748" }}
              />
              {/* Notification badge */}
              {hasBadge && (
                <Box sx={{
                  minWidth: 20, height: 20, borderRadius: "10px", backgroundColor: "#ef4444",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  px: 0.8, boxShadow: "0 2px 8px rgba(239,68,68,0.5)",
                  animation: "pulse 2s ease-in-out infinite",
                  "@keyframes pulse": {
                    "0%, 100%": { boxShadow: "0 2px 8px rgba(239,68,68,0.5)" },
                    "50%": { boxShadow: "0 2px 16px rgba(239,68,68,0.9)" },
                  },
                }}>
                  <Typography sx={{ fontSize: "11px", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                    {item.badge > 99 ? "99+" : item.badge}
                  </Typography>
                </Box>
              )}
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "#e8eaf6" }} />

      {/* LOGOUT */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogoutClick}
          sx={{
            borderRadius: "10px", backgroundColor: "rgba(220,38,38,0.05)", transition: "all 0.2s ease",
            "&:hover": { backgroundColor: "rgba(220,38,38,0.1)" },
          }}
        >
          <ListItemIcon sx={{ color: "#dc2626", minWidth: "40px" }}><LogoutOutlinedIcon /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: "14px", fontWeight: "700", color: "#dc2626" }} />
        </ListItemButton>
      </Box>

      {/* LOGOUT POPOVER */}
      <Popover
        id={id} open={open} anchorEl={anchorEl} onClose={handleClosePopover}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2), 0 0 1px rgba(0,0,0,0.1)",
            overflow: "visible", backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.8)",
            "&::before": {
              content: '""', position: "absolute", top: "-10px", right: "24px",
              width: 0, height: 0,
              borderLeft: "10px solid transparent", borderRight: "10px solid transparent",
              borderBottom: "10px solid #ffffff",
              filter: "drop-shadow(0 -2px 4px rgba(0,0,0,0.05))", zIndex: 10,
            },
          },
        }}
      >
        <Box sx={{ p: "32px", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "24px", backgroundColor: "#ffffff", borderRadius: "16px", animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1)", "@keyframes slideUp": { "0%": { opacity: 0, transform: "translateY(12px)" }, "100%": { opacity: 1, transform: "translateY(0)" } } }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
            <Box sx={{ width: "48px", height: "48px", minWidth: "48px", borderRadius: "12px", background: "linear-gradient(135deg,#fee2e2,#fecaca)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(220,38,38,0.15)" }}>
              <LogoutOutlinedIcon sx={{ color: "#991b1b", fontSize: "26px" }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight="700" fontSize="18px" color="#1a202c" sx={{ letterSpacing: "-0.3px" }}>End Session</Typography>
              <Typography fontSize="12px" color="#718096" fontWeight="500" sx={{ mt: 0.5 }}>This action cannot be undone</Typography>
            </Box>
          </Box>
          <Box sx={{ height: "1px", background: "linear-gradient(90deg,transparent,#e2e8f0,transparent)" }} />
          <Typography fontSize="14px" color="#4a5568" sx={{ lineHeight: 1.7, fontWeight: "500" }}>
            Are you sure you want to logout? Your session will end and you'll need to sign in again to access your account.
          </Typography>
          <Box sx={{ display: "flex", gap: "12px", justifyContent: "flex-end", pt: "8px" }}>
            <Button variant="outlined" onClick={handleClosePopover}
              sx={{ textTransform: "none", fontSize: "14px", fontWeight: "600", borderColor: "#e2e8f0", color: "#4a5568", backgroundColor: "#f7fafc", padding: "10px 20px", borderRadius: "10px", border: "1.5px solid #e2e8f0", "&:hover": { borderColor: "#cbd5e0", backgroundColor: "#edf2f7", transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" } }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={confirmLogout} disabled={isLoading}
              sx={{ textTransform: "none", fontSize: "14px", fontWeight: "700", backgroundColor: "#dc2626", padding: "10px 24px", borderRadius: "10px", boxShadow: "0 8px 16px rgba(220,38,38,0.25)", minWidth: "110px", border: "none", "&:hover:not(:disabled)": { backgroundColor: "#b91c1c", boxShadow: "0 12px 24px rgba(220,38,38,0.3)", transform: "translateY(-2px)" }, "&:disabled": { backgroundColor: "#dc2626", opacity: 0.9 } }}>
              {isLoading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Box sx={{ width: "16px", height: "16px", border: "2.5px solid rgba(255,255,255,0.25)", borderTop: "2.5px solid #fff", borderRadius: "50%", animation: "spin 0.9s linear infinite", "@keyframes spin": { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } } }} />
                  <span>Logging out...</span>
                </Box>
              ) : "Logout"}
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default Sidebar;
