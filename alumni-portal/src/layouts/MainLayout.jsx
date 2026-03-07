// layouts/MainLayout.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Box } from "@mui/material";

const MainLayout = ({ children }) => {
  return (
    <>
      <Sidebar />
      <Navbar />
      <Box
        sx={{
          ml: { xs: 0, sm: "260px" },
          mt: "75px",
          p: { xs: 1.5, sm: 3 },
          minHeight: "100vh",
          backgroundColor: "#ffffff",
          transition: "all 0.3s ease",
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default MainLayout;
