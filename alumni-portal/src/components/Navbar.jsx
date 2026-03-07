import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { getStoredUser, API_BASE_URL } from "../api/config";


const getPageTitle = (path) => {
  switch (path) {
    case "/home":
      return "Home";
    case "/alumni":
      return "Alumni Profile";
    case "/jobs":
      return "Jobs";
    case "/events":
      return "Events";
    case "/about-me":
    case "/about":
      return "About Me";
    default:
      return "";
  }
};

// Helper function to build full profile photo URL
const getProfilePhotoUrl = (photoPath) => {
  if (!photoPath) return "";
  
  if (photoPath.startsWith('http') || photoPath.startsWith('/')) {
    return photoPath;
  }
  
  // Add the API base URL for relative paths like "uploads/1234-photo.jpg"
  return `${API_BASE_URL}/${photoPath}`;
};


const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = React.useState(getStoredUser() || {});
  const [photoLoadFailed, setPhotoLoadFailed] = React.useState(false);

  const displayName = user.role === 'admin' ? 'Admin' : (user.fullName || user.email || "Alumni User");
  const avatarSrc = getProfilePhotoUrl(user.profilePhoto);

  const handleProfileClick = () => {
    if (user.userId) {
      navigate(`/alumni/${user.userId}`);
    } else {
      navigate("/about-me");
    }
  };

  const handlePhotoError = () => {
    console.warn("❌ Profile photo failed to load from:", avatarSrc);
    setPhotoLoadFailed(true);
  };

  React.useEffect(() => {
    setPhotoLoadFailed(false);
    
    const handler = () => {
      const updatedUser = getStoredUser() || {};
      console.log("📸 User updated, profile photo:", updatedUser.profilePhoto);
      setUser(updatedUser);
    };
    
    window.addEventListener('userUpdated', handler);
    window.addEventListener('storage', handler);
    
    return () => {
      window.removeEventListener('userUpdated', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "#ffffff",
        color: "#1a1a1a",
        borderBottom: "2px solid #f0f4ff",
        zIndex: 1201,
        ml: { xs: 0, sm: "260px" },
        width: { xs: "100%", sm: "calc(100% - 260px)" },
        boxShadow: "0 4px 20px rgba(104, 121, 227, 0.08)",
        transition: "all 0.3s ease",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2,
          px: { xs: 2, sm: 3 },
          minHeight: "75px",
          gap: { xs: 1, sm: 3 }
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              width: "4px",
              height: "28px",
              backgroundColor: "#6879e3",
              borderRadius: "2px",
            }}
          />
          <Typography
            sx={{
              fontSize: { xs: 16, sm: 20 },
              fontWeight: 800,
              color: "#1a1a1a",
              letterSpacing: "-0.5px",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {getPageTitle(location.pathname)}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2.5 }}>
          <Box
            sx={{
              width: "1px",
              height: "32px",
              backgroundColor: "#e8eaf6",
            }}
          />

          <Box
            display="flex"
            alignItems="center"
            gap={{ xs: 0.5, sm: 1.5 }}
            onClick={handleProfileClick}
            sx={{
              cursor: "pointer",
              px: 1,
              py: 0.5,
              borderRadius: "10px",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "#f0f4ff",
              }
            }}
          >
            <Avatar
              src={avatarSrc && !photoLoadFailed ? avatarSrc : undefined}
              alt={displayName}
              onError={handlePhotoError}
              sx={{
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                backgroundColor: (avatarSrc && !photoLoadFailed) ? undefined : "linear-gradient(135deg, #6879e3 0%, #5a6fd6 100%)",
                color: "white",
                fontWeight: 700,
                fontSize: { xs: "14px", sm: "16px" },
                boxShadow: "0 4px 12px rgba(104, 121, 227, 0.25)",
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "0 6px 18px rgba(104, 121, 227, 0.35)",
                  transform: "scale(1.05)",
                }
              }}
            >
              {(!avatarSrc || photoLoadFailed) && displayName.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
            </Avatar>
            
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  lineHeight: 1.2
                }}
              >
                {displayName}
              </Typography>
             
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 
