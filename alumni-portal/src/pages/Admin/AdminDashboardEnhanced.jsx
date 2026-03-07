import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI, getStoredUser } from "../../api/config";
import {
  Box,
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Avatar,
  Slide,
  IconButton,
  Divider,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";

const AdminDashboard = () => {
  const theme = useTheme();

  const navigate = useNavigate();
  useEffect(() => {
    const user = getStoredUser();
    if (!user || user.role !== "admin") {
      navigate("/home");
    }
  }, [navigate]);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    email: null,
    actionType: null, // "status" or "action"
    actionValue: null,
  });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminAPI.getUsers();
      setUsers(Array.isArray(data) ? data : []);
      setCurrentPage(1); // Reset to page 1 when data refreshes
      if (Array.isArray(data) && data.length === 0) {
        setError("No users found or admin API not available.");
      }
    } catch (err) {
      console.error(err);
      if (err.message.includes("404")) {
        setError("Admin endpoints not present on backend");
      } else {
        setError("Unable to load users. Check server or network.");
      }
    } finally {
      setLoading(false);
    }
  };

  const openConfirmDialog = (email, actionType, actionValue) => {
    setConfirmDialog({ open: true, email, actionType, actionValue });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, email: null, actionType: null, actionValue: null });
    setConfirmLoading(false);
    setLoading(false);
  };

  useEffect(() => {
    if (!confirmDialog.open) {
      document.querySelectorAll('.MuiBackdrop-root').forEach((b) => {
        if (!document.body.contains(b.closest('[role="presentation"]'))) {
          b.remove();
        }
      });
      const root = document.getElementById('root');
      if (root && root.getAttribute('aria-hidden') === 'true') {
        root.removeAttribute('aria-hidden');
      }
      if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }
    }
  }, [confirmDialog.open]);

  const confirmAction = async () => {
    const { email, actionType, actionValue } = confirmDialog;
    setConfirmLoading(true);
    try {
      // ✅ Send appropriate parameters based on actionType
      if (actionType === "status") {
        // Sending status parameter
        await adminAPI.updateUserStatus(email, actionValue);
      } else if (actionType === "action") {
        // Sending action parameter
        await adminAPI.updateUserStatus(email, null, actionValue);
      }

      await fetchUsers();
      
      if (actionValue === "REJECTED") {
        setSnackbar({ 
          open: true, 
          message: `User ${email} has been rejected and removed.`, 
          severity: 'success' 
        });
      } else if (actionValue === "APPROVED") {
        setSnackbar({ 
          open: true, 
          message: `User ${email} has been accepted and set to Active.`, 
          severity: 'success' 
        });
      } else if (actionValue === "INACTIVE") {
        setSnackbar({ 
          open: true, 
          message: `User ${email} is now Inactive.`, 
          severity: 'success' 
        });
      } else if (actionValue === "ACTIVE") {
        setSnackbar({ 
          open: true, 
          message: `User ${email} is now Active.`, 
          severity: 'success' 
        });
      }
    } catch (err) {
      console.error(err);
      if (err.message.includes("not available")) {
        setError("Admin actions are not supported by this backend");
      } else {
        setError("Unable to update status. Try again.");
      }
      setSnackbar({ open: true, message: 'Unable to update status', severity: 'error' });
    } finally {
      setConfirmLoading(false);
      closeConfirmDialog();
    }
  };

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });

  // Filter users: show PENDING and APPROVED only (hide REJECTED)
  const filteredUsers = users.filter(user => {
    const status = String(user.status).toUpperCase();
    return status !== "REJECTED";
  });

  // PAGINATION LOGIC
  const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRecordsPerPageChange = (event) => {
    setRecordsPerPage(event.target.value);
    setCurrentPage(1);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        color: "#000000",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          fontWeight={900}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            mb: 1,
          }}
        >
          Admin Dashboard
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#666", fontWeight: 500 }}
        >
          Manage and verify user accounts
        </Typography>
      </Box>

      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
          background: "#ffffff",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            p: 3,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#ffffff",
                  fontSize: 18,
                  mb: 0.5,
                }}
              >
                User Management & Verification
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                Review and manage user accounts ({filteredUsers.length} total)
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Button
                onClick={fetchUsers}
                disabled={loading}
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#667eea",
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 2.5,
                  px: 3,
                  py: 1.2,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    backgroundColor: "#f0f0ff",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)",
                  },
                  "&:disabled": {
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                    color: "rgba(102, 126, 234, 0.5)",
                  },
                }}
                variant="contained"
              >
                🔄 Refresh
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{ color: "#ffffff" }}
                  thickness={4}
                />
              )}
            </Stack>
          </Stack>
        </Box>

        {error && (
          <Box
            sx={{
              px: 3,
              pt: 2,
              pb: 1,
              background: "linear-gradient(135deg, rgba(211, 47, 47, 0.1) 0%, rgba(229, 57, 53, 0.05) 100%)",
              borderLeft: "4px solid #d32f2f",
              borderRadius: 1,
              mb: 2,
            }}
          >
            <Typography
              sx={{
                color: "#d32f2f",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              ⚠️ {error}
            </Typography>
          </Box>
        )}

        <TableContainer sx={{ backgroundColor: "#ffffff" }}>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow
                sx={{
                  background: "linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)",
                  borderBottom: `3px solid #667eea`,
                  "& .MuiTableCell-head": {
                    padding: "18px 14px",
                  },
                }}
              >
                <TableCell sx={{ fontWeight: 800, fontSize: 13, color: "#667eea", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: 13, color: "#667eea", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Phone
                </TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: 13, color: "#667eea", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Department
                </TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: 13, color: "#667eea", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Year
                </TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: 13, color: "#667eea", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Email
                </TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: 13, color: "#667eea", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: 13, color: "#667eea", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Action
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 800, fontSize: 13, color: "#667eea", textTransform: "uppercase", letterSpacing: 0.5 }}
                >
                  Controls
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUsers.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h6"
                        sx={{ color: "#999", fontSize: 18, fontWeight: 600, mb: 1 }}
                      >
                        📭 No pending users
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#bbb", fontSize: 14 }}
                      >
                        All users have been reviewed
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user, index) => {
                  const userStatus = String(user.status).toUpperCase();
                  const userAction = String(user.action || "ACTIVE").toUpperCase();
                  const isPending = userStatus === "PENDING";
                  const isApproved = userStatus === "APPROVED";

                  return (
                    <TableRow
                      key={user.email}
                      hover
                      sx={{
                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb",
                        borderBottom: `1px solid #e5e7eb`,
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: "#f0f4ff",
                          boxShadow: "0 4px 12px rgba(102, 126, 234, 0.08) inset",
                        },
                        "& .MuiTableCell-body": {
                          padding: "16px 14px",
                        },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>
                        {user.name || "—"}
                      </TableCell>
                      <TableCell sx={{ fontSize: 14, color: "#555" }}>
                        {user.phone_number || "—"}
                      </TableCell>
                      <TableCell sx={{ fontSize: 14, color: "#555" }}>
                        {user.department || "—"}
                      </TableCell>
                      <TableCell sx={{ fontSize: 14, color: "#555" }}>
                        {user.year_of_passout || "—"}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#667eea",
                          fontWeight: 700,
                          fontSize: 14,
                        }}
                      >
                        {user.email}
                      </TableCell>

                      {/* STATUS COLUMN */}
                      <TableCell>
                        <Chip
                          label={isPending ? "Pending" : isApproved ? "Approved" : "Unknown"}
                          color={isPending ? "warning" : isApproved ? "success" : "default"}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: 12,
                            borderRadius: 1.5,
                            height: 28,
                            "& .MuiChip-label": { px: 1.5 },
                          }}
                        />
                      </TableCell>

                      {/* ACTION COLUMN (Only for APPROVED users) */}
                      <TableCell>
                        {isApproved && (
                          <Chip
                            label={userAction === "ACTIVE" ? "Active" : "Inactive"}
                            color={userAction === "ACTIVE" ? "success" : "default"}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              fontSize: 12,
                              borderRadius: 1.5,
                              height: 28,
                              "& .MuiChip-label": { px: 1.5 },
                            }}
                          />
                        )}
                        {isPending && (
                          <Typography variant="caption" sx={{ color: "#999" }}>
                            —
                          </Typography>
                        )}
                      </TableCell>

                      {/* CONTROLS COLUMN */}
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.8} justifyContent="flex-end">
                          {isPending ? (
                            <>
                              <Tooltip title="Accept this user" arrow placement="top">
                                <Button
                                  size="small"
                                  variant="contained"
                                  disabled={confirmDialog.open && confirmLoading}
                                  onClick={() => openConfirmDialog(user.email, "status", "APPROVED")}
                                  sx={{
                                    background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                                    color: "#ffffff",
                                    textTransform: "none",
                                    fontWeight: 700,
                                    borderRadius: 2,
                                    fontSize: 12,
                                    padding: "8px 14px",
                                    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    "&:hover": {
                                      background: "linear-gradient(135deg, #45a049 0%, #3d8b40 100%)",
                                      boxShadow: "0 8px 20px rgba(76, 175, 80, 0.4)",
                                      transform: "translateY(-2px)",
                                    },
                                    "&:disabled": {
                                      opacity: 0.6,
                                    },
                                  }}
                                >
                                  ✓ Accept
                                </Button>
                              </Tooltip>
                              <Tooltip title="Reject this user" arrow placement="top">
                                <Button
                                  size="small"
                                  variant="contained"
                                  disabled={confirmDialog.open && confirmLoading}
                                  onClick={() => openConfirmDialog(user.email, "status", "REJECTED")}
                                  sx={{
                                    background: "linear-gradient(135deg, #f44336 0%, #da190b 100%)",
                                    color: "#ffffff",
                                    textTransform: "none",
                                    fontWeight: 700,
                                    borderRadius: 2,
                                    fontSize: 12,
                                    padding: "8px 14px",
                                    boxShadow: "0 4px 12px rgba(244, 67, 54, 0.3)",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    "&:hover": {
                                      background: "linear-gradient(135deg, #da190b 0%, #c41c04 100%)",
                                      boxShadow: "0 8px 20px rgba(244, 67, 54, 0.4)",
                                      transform: "translateY(-2px)",
                                    },
                                    "&:disabled": {
                                      opacity: 0.6,
                                    },
                                  }}
                                >
                                  ✕ Reject
                                </Button>
                              </Tooltip>
                            </>
                          ) : isApproved ? (
                            <>
                              <Tooltip 
                                title={userAction === "ACTIVE" ? "Click to make Inactive" : "Click to make Active"} 
                                arrow 
                                placement="top"
                              >
                                <Button
                                  size="small"
                                  variant="contained"
                                  disabled={confirmDialog.open && confirmLoading}
                                  onClick={() =>
                                    userAction === "ACTIVE"
                                      ? openConfirmDialog(user.email, "action", "INACTIVE")
                                      : openConfirmDialog(user.email, "action", "ACTIVE")
                                  }
                                  sx={{
                                    background: userAction === "ACTIVE"
                                      ? "linear-gradient(135deg, #4caf50 0%, #45a049 100%)"
                                      : "linear-gradient(135deg, #9e9e9e 0%, #757575 100%)",
                                    color: "#ffffff",
                                    textTransform: "none",
                                    fontWeight: 700,
                                    borderRadius: 2,
                                    fontSize: 12,
                                    padding: "8px 14px",
                                    boxShadow: userAction === "ACTIVE"
                                      ? "0 4px 12px rgba(76, 175, 80, 0.3)"
                                      : "0 4px 12px rgba(158, 158, 158, 0.3)",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    "&:hover": {
                                      background: userAction === "ACTIVE"
                                        ? "linear-gradient(135deg, #45a049 0%, #3d8b40 100%)"
                                        : "linear-gradient(135deg, #757575 0%, #616161 100%)",
                                      boxShadow: userAction === "ACTIVE"
                                        ? "0 8px 20px rgba(76, 175, 80, 0.4)"
                                        : "0 8px 20px rgba(158, 158, 158, 0.4)",
                                      transform: "translateY(-2px)",
                                    },
                                    "&:disabled": {
                                      opacity: 0.6,
                                    },
                                  }}
                                >
                                  {userAction === "ACTIVE" ? "● Active" : "● Inactive"}
                                </Button>
                              </Tooltip>
                            </>
                          ) : null}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* PAGINATION & RECORDS PER PAGE */}
        {filteredUsers.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2.5,
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap' }}>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel sx={{ fontSize: 13, fontWeight: 600 }}>Records per page</InputLabel>
                <Select
                  value={recordsPerPage}
                  onChange={handleRecordsPerPageChange}
                  label="Records per page"
                  size="small"
                  sx={{
                    borderRadius: 1.5,
                    '& .MuiOutlinedInput-root': {
                      borderColor: '#667eea',
                    }
                  }}
                >
                  <MenuItem value={5}>5 records</MenuItem>
                  <MenuItem value={10}>10 records</MenuItem>
                  <MenuItem value={20}>20 records</MenuItem>
                  <MenuItem value={50}>50 records</MenuItem>
                  <MenuItem value={filteredUsers.length}>All records</MenuItem>
                </Select>
              </FormControl>

              <Typography
                variant="body2"
                sx={{
                  color: '#667eea',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
              </Typography>
            </Stack>

            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderColor: '#667eea',
                  color: '#667eea',
                  fontWeight: 600,
                  '&.Mui-selected': {
                    backgroundColor: '#667eea',
                    color: '#ffffff',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.08)',
                  }
                }
              }}
            />
          </Box>
        )}
      </Paper>

      {/* CONFIRMATION DIALOG */}
      <Dialog
        open={confirmDialog.open}
        onClose={closeConfirmDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        disableEscapeKeyDown={false}
        onBackdropClick={closeConfirmDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 40px 100px rgba(2, 6, 23, 0.2)",
            backgroundColor: "rgba(255,255,255,0.98)",
            overflow: "hidden",
            borderLeft: `6px solid ${
              confirmDialog.actionValue === 'APPROVED' ? '#16a34a' : 
              confirmDialog.actionValue === 'ACTIVE' ? '#16a34a' :
              confirmDialog.actionValue === 'REJECTED' ? '#ef4444' : 
              '#9e9e9e'
            }`,
            backdropFilter: "blur(6px)",
          },
        }}
        BackdropProps={{ sx: { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(7,10,26,0.45)' } }}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: confirmDialog.actionValue === 'APPROVED' ? '#16a34a' : 
                         confirmDialog.actionValue === 'ACTIVE' ? '#16a34a' :
                         confirmDialog.actionValue === 'REJECTED' ? '#ef4444' : 
                         '#9e9e9e',
                width: 64,
                height: 64,
                mr: 2,
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.07)' },
                  '100%': { transform: 'scale(1)' },
                },
                animation: 'pulse 2.2s ease-in-out infinite',
              }}
            >
              {(confirmDialog.actionValue === 'APPROVED' || confirmDialog.actionValue === 'ACTIVE') ? (
                <CheckCircleIcon sx={{ color: '#fff', fontSize: 28 }} />
              ) : (
                <CancelIcon sx={{ color: '#fff', fontSize: 28 }} />
              )}
            </Avatar>

            <Box>
              <Typography id="confirm-dialog-title" sx={{ fontWeight: 900, fontSize: 20, color: '#0f172a' }}>
                {confirmDialog.actionValue === 'APPROVED' ? 'Accept User' : 
                 confirmDialog.actionValue === 'ACTIVE' ? 'Make Active' :
                 confirmDialog.actionValue === 'REJECTED' ? 'Reject User' : 
                 'Make Inactive'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                {confirmDialog.actionValue === 'APPROVED'
                  ? 'This user will be accepted and set to Active.'
                  : confirmDialog.actionValue === 'ACTIVE'
                  ? 'This user will be activated and can login.'
                  : confirmDialog.actionValue === 'REJECTED'
                  ? 'This user will be rejected and completely removed from the list.'
                  : 'This user will be deactivated and cannot login.'}
              </Typography>
            </Box>
          </Box>

          <IconButton onClick={closeConfirmDialog} size="small" aria-label="close" sx={{ bgcolor: '#fff', boxShadow: '0 4px 16px rgba(15,23,42,0.06)' }}>
            <CloseIcon sx={{ color: '#475569' }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ pt: 2, pb: 2, backgroundColor: '#ffffff' }}>
          <Typography id="confirm-dialog-description" variant="h6" sx={{ mb: 1, color: '#0f172a', fontWeight: 700 }}>
            Are you sure you want to{' '}
            <strong>
              {confirmDialog.actionValue === 'APPROVED' ? 'accept' : 
               confirmDialog.actionValue === 'ACTIVE' ? 'activate' :
               confirmDialog.actionValue === 'REJECTED' ? 'reject' : 
               'deactivate'}
            </strong>{' '}
            this user?
          </Typography>

          <Paper variant="outlined" sx={{ p: 2, background: 'linear-gradient(180deg,#f8fafc,#ffffff)', borderRadius: 2, mb: 1 }}>
            <Typography variant="overline" sx={{ color: '#0f172a', fontWeight: 800 }}>User Details</Typography>
            <Typography variant="body1" sx={{ color: '#334155', fontWeight: 800, mt: 1 }}>
              {confirmDialog.email || '—'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
              Department: <strong>{filteredUsers.find(u => u.email === confirmDialog.email)?.department || '—'}</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Year: <strong>{filteredUsers.find(u => u.email === confirmDialog.email)?.year_of_passout || '—'}</strong>
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              {confirmDialog.actionValue === 'REJECTED' 
                ? '⚠️ This action cannot be undone. The user will be permanently removed from the system.'
                : '✓ You can change this status anytime.'}
            </Typography>
          </Paper>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, borderTop: '1px solid #f1f5f9', backgroundColor: '#ffffff' }}>
          <Button onClick={closeConfirmDialog} variant="outlined" sx={{ mr: 1, textTransform: 'none', fontWeight: 800 }}>
            Cancel
          </Button>
          <Button
            onClick={confirmAction}
            variant="contained"
            disabled={confirmLoading}
            sx={{
              background: confirmDialog.actionValue === 'APPROVED' ? '#16a34a' : 
                          confirmDialog.actionValue === 'ACTIVE' ? '#16a34a' :
                          confirmDialog.actionValue === 'REJECTED' ? '#ef4444' : 
                          '#9e9e9e',
              color: '#ffffff',
              fontWeight: 900,
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
              boxShadow: (theme) => `0 14px 40px ${
                confirmDialog.actionValue === 'APPROVED' ? '#16a34a' : 
                confirmDialog.actionValue === 'ACTIVE' ? '#16a34a' :
                confirmDialog.actionValue === 'REJECTED' ? '#ef4444' : 
                '#9e9e9e'
              }33`,
              '&:hover': { 
                transform: 'translateY(-3px)', 
                boxShadow: (theme) => `0 18px 46px ${
                  confirmDialog.actionValue === 'APPROVED' ? '#16a34a' : 
                  confirmDialog.actionValue === 'ACTIVE' ? '#16a34a' :
                  confirmDialog.actionValue === 'REJECTED' ? '#ef4444' : 
                  '#9e9e9e'
                }44` 
              },
              '&:disabled': { opacity: 0.6 },
            }}
            startIcon={
              (confirmDialog.actionValue === 'APPROVED' || confirmDialog.actionValue === 'ACTIVE') ? <CheckCircleIcon /> : 
              <CancelIcon />
            }
          >
            {confirmLoading ? (
              <CircularProgress size={20} sx={{ color: '#fff' }} />
            ) : (
              confirmDialog.actionValue === 'APPROVED' ? 'Accept' : 
              confirmDialog.actionValue === 'ACTIVE' ? 'Activate' :
              confirmDialog.actionValue === 'REJECTED' ? 'Reject' : 
              'Deactivate'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* SUCCESS/ERROR SNACKBAR */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar(s => ({...s, open:false}))} 
        anchorOrigin={{vertical:'bottom', horizontal:'right'}}
      >
        <Alert 
          onClose={() => setSnackbar(s => ({...s, open:false}))} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;
