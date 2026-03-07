/**
 * FRONTEND INTEGRATION GUIDE FOR HOMEFEED WITH BACKEND
 * 
 * Replace the relevant sections in src/pages/Home/HomeFeed.jsx with these updated handlers
 * that connect to the new backend API endpoints for posts.
 */

import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  TextField,
  Button,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Menu,
  MenuItem,
} from "@mui/material";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const HomeFeed = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postText, setPostText] = useState("");
  const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [pasteImageMode, setPasteImageMode] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [linkUrlInput, setLinkUrlInput] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [tick, setTick] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);

  // ✅ AUTHENTICATION CHECK
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.userId) {
      navigate("/");
      return;
    }
    fetchPosts();
  }, [navigate]);

  // ✅ FETCH POSTS FROM BACKEND
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/posts`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data || []);
    } catch (error) {
      console.error("❌ Error fetching posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ HANDLE FILE SELECTION
  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setOpenPhotoDialog(false);
    }
  };

  // ✅ HANDLE IMAGE URL INPUT
  const handleAddImageUrl = () => {
    if (imageUrlInput) {
      setSelectedImage(imageUrlInput);
      setImageUrlInput("");
      setPasteImageMode(false);
      setOpenPhotoDialog(false);
    }
  };

  // ✅ HANDLE LINK INPUT
  const handleAddLink = () => {
    if (linkUrlInput) {
      setPostText((t) => (t ? `${t}\n${linkUrlInput}` : linkUrlInput));
      setLinkUrlInput("");
      setOpenLinkDialog(false);
    }
  };

  // ✅ CREATE POST WITH BACKEND
  const handlePost = async () => {
    if (!postText && !selectedImage) return;

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.userId;

    if (!userId) {
      alert("❌ User not logged in");
      return;
    }

    try {
      let uploadedImagePath = null;
      let imageUrl = null;

      // Upload image if it's a file (blob)
      if (selectedImage && selectedImage.startsWith("blob:")) {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        const file = new File([blob], "post-image", { type: blob.type });

        const formData = new FormData();
        formData.append("image", file);

        const uploadRes = await fetch(`${API_BASE_URL}/posts/upload-image`, {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Image upload failed");
        const uploadData = await uploadRes.json();
        uploadedImagePath = uploadData.imagePath;
      } else if (selectedImage) {
        // External URL image
        imageUrl = selectedImage;
      }

      // Create post
      const res = await fetch(`${API_BASE_URL}/posts/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          postDescription: postText,
          postImagePath: uploadedImagePath,
          imageUrl: imageUrl,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Post creation failed");
      }

      // Reset form and refresh posts
      setPostText("");
      setSelectedImage("");
      await fetchPosts();
    } catch (error) {
      console.error("❌ Error creating post:", error);
      alert(`Failed to create post: ${error.message}`);
    }
  };

  // ✅ DELETE POST WITH AUTHORIZATION
  const handleDeletePost = async (postId) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.userId;

    if (!userId) {
      alert("❌ User not logged in");
      return;
    }

    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Delete failed");
      }

      await fetchPosts();
      setAnchorEl(null);
    } catch (error) {
      console.error("❌ Error deleting post:", error);
      alert(`Failed to delete post: ${error.message}`);
    }
  };

  // ✅ TIME AGO FORMATTER
  const timeAgo = (isoDate) => {
    if (!isoDate) return "";
    const now = new Date();
    const postDate = new Date(isoDate);
    const diffMs = now - postDate;
    const diffSecs = Math.floor(diffMs / 1000);

    if (diffSecs < 60) return "Just now";
    const mins = Math.floor(diffSecs / 60);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return postDate.toLocaleDateString();
  };

  // ✅ AUTO-REFRESH TIME AGO DISPLAY
  useEffect(() => {
    const interval = setInterval(() => setTick((s) => s + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  // ✅ MENU HANDLERS
  const handleMenuOpen = (e, postId) => {
    setAnchorEl(e.currentTarget);
    setSelectedPostId(postId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPostId(null);
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6879e3 0%, #5a6fd6 50%, #4a60cc 100%)",
        py: { xs: 3, md: 5 },
        position: "relative",
      }}
    >
      <Box sx={{ maxWidth: 700, mx: "auto", px: { xs: 2, md: 3 } }}>
        {/* POST CREATION SECTION */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3.5 },
            mb: 3,
            borderRadius: 3,
            backgroundColor: "#fff",
            border: "1px solid #e8eaf6",
            boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
          }}
        >
          {/* User & Input */}
          <Box display="flex" gap={2.5} mb={2.5}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                backgroundColor: "#6879e3",
                color: "white",
                fontWeight: 700,
              }}
            >
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </Avatar>
            <TextField
              fullWidth
              placeholder="What's on your mind?"
              multiline
              maxRows={4}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f7fafc",
                  borderRadius: 2,
                  "&:hover fieldset": { borderColor: "#6879e3" },
                  "&.Mui-focused fieldset": { borderColor: "#6879e3" },
                },
              }}
            />
          </Box>

          {/* Selected Image Preview */}
          {selectedImage && (
            <Box
              sx={{
                mb: 2,
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
                maxHeight: 250,
              }}
            >
              <Box
                component="img"
                src={selectedImage}
                alt="preview"
                sx={{ width: "100%", objectFit: "cover" }}
              />
              <Button
                size="small"
                onClick={() => setSelectedImage("")}
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  color: "white",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
                }}
              >
                ✕ Remove
              </Button>
            </Box>
          )}

          {/* Action Buttons */}
          <Box display="flex" gap={1.5} alignItems="center">
            <Button
              startIcon={<PhotoCameraOutlinedIcon />}
              onClick={() => setOpenPhotoDialog(true)}
              variant="text"
              sx={{
                textTransform: "none",
                color: "#6879e3",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              Photo
            </Button>
            <Button
              startIcon={<LinkOutlinedIcon />}
              onClick={() => setOpenLinkDialog(true)}
              variant="text"
              sx={{
                textTransform: "none",
                color: "#6879e3",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              Link
            </Button>
            <Box sx={{ ml: "auto" }}>
              <Button
                variant="contained"
                onClick={handlePost}
                disabled={!postText && !selectedImage}
                sx={{
                  borderRadius: 2.5,
                  px: 4,
                  py: 1.2,
                  backgroundColor: "#6879e3",
                  color: "white",
                  fontWeight: 700,
                  "&:hover": { backgroundColor: "#5a6fd6" },
                  "&:disabled": { backgroundColor: "#c0c8e0" },
                }}
              >
                Post
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* PHOTO DIALOG */}
        <Dialog
          open={openPhotoDialog}
          onClose={() => {
            setOpenPhotoDialog(false);
            setPasteImageMode(false);
          }}
          PaperProps={{ sx: { borderRadius: "16px", minWidth: { xs: "85vw", sm: "500px" } } }}
        >
          <DialogTitle sx={{ fontWeight: 800, color: "#1a1a1a", fontSize: "22px" }}>
            📸 Add Photo
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {!pasteImageMode ? (
              <Stack spacing={2.5}>
                <Button
                  variant="contained"
                  onClick={() => fileInputRef.current?.click()}
                  fullWidth
                  sx={{ backgroundColor: "#6879e3", color: "white", fontWeight: 700, py: 1.3 }}
                >
                  Upload from Computer
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setPasteImageMode(true)}
                  fullWidth
                  sx={{ borderColor: "#6879e3", color: "#6879e3", fontWeight: 700, py: 1.3 }}
                >
                  Paste Image URL
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelected}
                  hidden
                />
              </Stack>
            ) : (
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  placeholder="Paste image URL here..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  autofocus
                />
                <DialogActions>
                  <Button onClick={() => setPasteImageMode(false)}>Back</Button>
                  <Button variant="contained" onClick={handleAddImageUrl} sx={{ backgroundColor: "#6879e3" }}>
                    Add
                  </Button>
                </DialogActions>
              </Stack>
            )}
          </DialogContent>
        </Dialog>

        {/* LINK DIALOG */}
        <Dialog open={openLinkDialog} onClose={() => setOpenLinkDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800, color: "#1a1a1a", fontSize: "22px" }}>
            🔗 Add Link
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              fullWidth
              placeholder="Paste your link here..."
              value={linkUrlInput}
              onChange={(e) => setLinkUrlInput(e.target.value)}
              autofocus
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenLinkDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAddLink} sx={{ backgroundColor: "#6879e3", color: "white" }}>
              Add Link
            </Button>
          </DialogActions>
        </Dialog>

        {/* POSTS FEED */}
        {loading ? (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <Typography sx={{ color: "white" }}>Loading posts...</Typography>
          </Box>
        ) : posts.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3, backgroundColor: "#fff" }}>
            <Typography sx={{ color: "#999", fontSize: "16px", fontWeight: 500 }}>
              No posts yet. Be the first to share! 🚀
            </Typography>
          </Paper>
        ) : (
          posts.map((post) => (
            <Paper
              key={post.post_id}
              sx={{
                p: { xs: 2.5, md: 3.5 },
                mb: 3,
                borderRadius: 3,
                backgroundColor: "#fff",
                border: "1px solid #e8eaf6",
                box Shadow: "0 10px 40px rgba(0,0,0,0.12)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 20px 60px rgba(0,0,0,0.16)",
                  transform: "translateY(-4px)",
                },
              }}
            >
              {/* Post Header */}
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2.5}>
                <Box display="flex" gap={2.5}>
                  <Avatar
                    src={
                      post.profile_photo
                        ? `${API_BASE_URL}/${post.profile_photo}`
                        : undefined
                    }
                    sx={{
                      width: 48,
                      height: 48,
                      backgroundColor: post.profile_photo ? "transparent" : "#6879e3",
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    {post.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={700} sx={{ fontSize: "15px", color: "#1a1a1a" }}>
                      {post.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#666", fontSize: "12px" }}>
                      {post.year ? `Class of ${post.year}` : ""} • {timeAgo(post.created_at)}
                    </Typography>
                  </Box>
                </Box>
                <IconButton size="small" onClick={(e) => handleMenuOpen(e, post.post_id)}>
                  <MoreHorizIcon sx={{ fontSize: "20px", color: "#bbb" }} />
                </IconButton>
              </Box>

              {/* Menu */}
              <Menu
                anchorEl={anchorEl}
                open={selectedPostId === post.post_id}
                onClose={handleMenuClose}
              >
                {post.user_id === user?.userId && (
                  <MenuItem onClick={() => handleDeletePost(post.post_id)} sx={{ color: "#d32f2f" }}>
                    🗑️ Delete Post
                  </MenuItem>
                )}
                <MenuItem onClick={handleMenuClose}>Report Post</MenuItem>
              </Menu>

              <Divider sx={{ my: 2.5 }} />

              {/* Post Text */}
              <Typography
                sx={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.7,
                  color: "#2d2d2d",
                  fontSize: "14.5px",
                  fontWeight: 500,
                  mb: post.post_image_path || post.image_url ? 2.5 : 0,
                }}
              >
                {post.post_description}
              </Typography>

              {/* Post Image */}
              {(post.post_image_path || post.image_url) && (
                <Box
                  component="img"
                  src={
                    post.image_url
                      ? post.image_url
                      : `${API_BASE_URL}/${post.post_image_path}`
                  }
                  alt="post"
                  sx={{
                    width: "100%",
                    borderRadius: 2.5,
                    objectFit: "cover",
                    maxHeight: 420,
                    boxShadow: "inset 0 0 0 1px rgba(104, 121, 227, 0.1)",
                  }}
                />
              )}
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
};

export default HomeFeed;
