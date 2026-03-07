import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// simple navbar that reads logged-in user info from localStorage
const NavBar = () => {
  const navigate = useNavigate();

  // keep user in state so we can re-render when it changes
  const [user, setUser] = React.useState(() => {
    const stored = typeof window !== 'undefined' && localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  // listen for storage events (e.g. profile updates in another tab) and update state
  React.useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'user') {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleProfile = () => {
    if (user && user.userId) {
      navigate(`/alumni/${user.userId}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  // helper to update stored user (e.g. after profile photo change)
  const updateLocalUser = (updates) => {
    const newUser = { ...(user || {}), ...updates };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // expose updateLocalUser via window for convenience (optional)
  React.useEffect(() => {
    window.updateLocalUser = updateLocalUser;
    return () => { delete window.updateLocalUser; };
  }, [user]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>Alumni Portal</Typography>

        {user ? (
          <>
            <Button
              color="inherit"
              startIcon={
                user.profilePhoto ? (
                  <Avatar src={user.profilePhoto} sx={{ width: 24, height: 24 }} />
                ) : (
                  <AccountCircleIcon />
                )
              }
              onClick={handleProfile}
              sx={{ textTransform: 'none' }}
            >
              {user.fullName || user.email}
            </Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
