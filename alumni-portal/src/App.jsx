import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

import HomeFeed from "./pages/Home/HomeFeed";
import AlumniProfile from "./pages/Home/AlumniProfile";
import AlumniDetails from "./pages/Home/AlumniDetails";
import AboutMe from "./pages/Home/AboutMe";
import Job from "./pages/Home/Job"; // 👈 ADD THIS
import Events from "./pages/Home/Events";
import AdminReports from "./pages/Admin/AdminReports";
import { getStoredUser } from "./api/config";
// the enhanced dashboard contains improved styling, a dedicated
// pending colour and is the version we will use going forward.
// the previous file remains in the repo for reference but is
// no longer imported anywhere, so you can delete it if you like.
import AdminDashboard from "./pages/Admin/AdminDashboardEnhanced";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* DASHBOARD ROUTES (WITH NAVBAR + SIDEBAR) */}
        <Route
          path="/home"
          element={
            <MainLayout>
              {/* always render home feed; admins can still open dashboard via sidebar */}
              <HomeFeed />
            </MainLayout>
          }
        />

        <Route
          path="/alumni"
          element={
            <MainLayout>
              <AlumniProfile />
            </MainLayout>
          }
        />

        <Route
          path="/alumni/:id"
          element={
            <MainLayout>
              <AlumniDetails />
            </MainLayout>
          }
        />

        {/* ABOUT ME – only non-admins */}
        <Route
          path="/about-me"
          element={
            <MainLayout>
              {/* only show to non-admins, admins should go to dashboard */}
              {getStoredUser()?.role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <AboutMe />
              )}
            </MainLayout>
          }
        />

        {/* JOB POST PAGE */}
        <Route
          path="/job"
          element={
            <MainLayout>
              <Job />
            </MainLayout>
          }
        />

        {/* EVENTS PAGE */}
        <Route
          path="/events"
          element={
            <MainLayout>
              <Events />
            </MainLayout>
          }
        />
      <Route
        path="/admin"
        element={
          <MainLayout>
            {/* only permit admins to see dashboard */}
            {getStoredUser()?.role === "admin" ? (
              <AdminDashboard />
            ) : (
              // redirect unauthenticated or non-admin users back to home
              <Navigate to="/home" replace />
            )}
          </MainLayout>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <MainLayout>
            {getStoredUser()?.role === "admin" ? (
              <AdminReports />
            ) : (
              <Navigate to="/home" replace />
            )}
          </MainLayout>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
