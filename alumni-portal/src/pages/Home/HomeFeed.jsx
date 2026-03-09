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
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";


// initialPosts kept for fallback but normally feed is loaded from server
const initialPosts = [];

// ✅ Helper function to properly construct image URLs.  We also guard
// against old blob:// URLs that were accidentally stored in the database
// during an earlier development phase; those don’t survive a reload so we
// pretend they don’t exist.
const getImageUrl = (post_image_path, image_url) => {
  if (post_image_path) {
    return `${API_BASE_URL}/${post_image_path}`;
  }
  if (image_url && !image_url.startsWith("blob:")) {
    return image_url; // External URLs are used directly
  }
  return "";
};


const HomeFeed = () => {
  const navigate = useNavigate();

  // ensure a logged-in user; admins are allowed to view feed now
  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/");
    }
  }, [navigate]);
  
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(initialPosts);
  const [tick, setTick] = useState(0);
  const [postText, setPostText] = useState("");
  const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [pasteImageMode, setPasteImageMode] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [linkUrlInput, setLinkUrlInput] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  
  const handleFileSelected = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
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

// ✅ FIXED: Refreshes posts from server after posting (images persist!)
const handlePost = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.userId) {
      alert("User not logged in");
      return;
    }

    let postImagePath = null;
    let imageUrl = null;

    // If the user picked a local file we must upload it first; blob
    // URLs don't survive a page reload.  If they pasted an external URL we
    // can keep it in `imageUrl`.
    if (selectedImageFile) {
      const form = new FormData();
      form.append("image", selectedImageFile);
      const uploadRes = await postsAPI.uploadImage(form);
      if (!uploadRes || !uploadRes.imagePath) {
        throw new Error(uploadRes?.message || "Image upload failed");
      }
      postImagePath = uploadRes.imagePath;
    } else if (selectedImage) {
      // a plain string – likely an external link
      imageUrl = selectedImage;
    }

    const payload = {
      userId: user.userId,
      postDescription: postText || null,
      postImagePath, // either path from server or null
      imageUrl,      // external URL or null
    };

    // use the centralized API helper so the base URL picks up VITE_API_BASE_URL
    const postCreateRes = await postsAPI.create(payload);
    // `postsAPI.create` already throws on non-OK, so we can assume success
    const data = postCreateRes; // rename for consistency

    // refresh posts from backend to pick up newly created record
    postsAPI
      .list()
      .then((data) => {
        if (Array.isArray(data)) {
          const converted = data.map((p) => ({
            id: p.post_id,
            name: p.name,
            year: p.year ? `Class of ${p.year}` : "",
            createdAt: new Date(p.created_at).getTime(),
            text: p.post_description || "",
            image: getImageUrl(p.post_image_path, p.image_url),
          }));
          setPosts(converted.length ? converted : initialPosts);
        }
      })
      .catch((err) => {
        console.warn("Could not load posts", err);
      });

    setPostText("");
    setSelectedImage("");
    setSelectedImageFile(null);
  } catch (err) {
    console.error("Post error:", err);
    alert(err.message || "Failed to create post");
  }
};

useEffect(() => {
    const t = setInterval(() => setTick((s) => s + 1), 60000);
    return () => clearInterval(t);
  }, []);

  // initialize user and fetch posts from server
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (u) setUser(u);
    postsAPI.list()
      .then((data) => {
        if (Array.isArray(data)) {
          const converted = data.map((p) => ({
            id: p.post_id,
            name: p.name,
            year: p.year ? `Class of ${p.year}` : "",
            createdAt: new Date(p.created_at).getTime(),
            text: p.post_description || "",
            image: getImageUrl(p.post_image_path, p.image_url),
          }));
          setPosts(converted.length ? converted : initialPosts);
        }
      })
      .catch((err) => {
        console.warn("Could not load posts", err);
      });
  }, []);


  const timeAgo = (ts) => {
    if (!ts) return '';
    const now = Date.now();
    const diff = Math.floor((now - ts) / 1000);
    if (diff < 60) return 'Just now';
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return new Date(ts).toLocaleDateString();
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6879e3 0%, #5a6fd6 50%, #4a60cc 100%)",
        py: { xs: 3, md: 5 },
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.03) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 }, position: "relative", zIndex: 1 }}>
        {/* PAGE TITLE AND SUBTITLE */}
        <Box mb={5}>
          <Typography
            variant="h3"
            fontWeight={800}
            mb={1.5}
            sx={{ color: '#ffffff', letterSpacing: '-0.5px', fontSize: { xs: '28px', md: '36px' } }}
          >
            Home Feed
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', fontWeight: 500, maxWidth: 500 }}
          >
            Share your story with the alumni community and stay connected
          </Typography>
        </Box>


        {/* CREATE POST CARD */}
        <Paper
          sx={(theme) => ({
            p: { xs: 2.5, md: 3.5 },
            borderRadius: 3,
            mb: 5,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            backgroundColor: '#ffffff',
            border: "1px solid #e8eaf6",
            color:'black',
          })}
        >
          <Typography fontWeight={700} mb={3} sx={{ fontSize: '16px', color: '#1a1a1a' }}>
            ✨ Create Post
          </Typography>


          <Box display="flex" gap={3} alignItems="flex-start">
            <Avatar
              sx={{
                width: 52,
                height: 52,
                backgroundColor: '#6879e3',
                color: 'white',
                fontWeight: 700,
                fontSize: '18px'
              }}
            >
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
                    backgroundColor: "rgba(104, 121, 227, 0.02)",
                    borderRadius: 2.5,
                    border: "1.5px solid rgba(104, 121, 227, 0.15)",
                    transition: "all 0.2s ease",
                    fontSize: '15px',
                    "&:hover": {
                      border: "1.5px solid rgba(104, 121, 227, 0.25)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "rgba(104, 121, 227, 0.05)",
                      border: "1.5px solid #6879e3",
                      boxShadow: "0 0 0 3px rgba(104, 121, 227, 0.1)",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "#1a1a1a",
                    fontWeight: 500,
                    "&::placeholder": {
                      color: "#999",
                      opacity: 1,
                    },
                  },
                }}
              />


              {selectedImage && (
                <Box
                  component="img"
                  src={selectedImage}
                  alt="preview"
                  sx={{
                    mt: 2.5,
                    width: '100%',
                    maxHeight: 380,
                    objectFit: 'cover',
                    borderRadius: 3,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  }}
                />
              )}
            </Box>
          </Box>


          <Box
            mt={3.5}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexDirection={{ xs: 'column', sm: 'row' }}
            gap={2}
          >
            <Box display="flex" gap={2} flexWrap="wrap" sx={{ flex: 1 }}>
              <Button
                variant="outlined"
                startIcon={<PhotoCameraOutlinedIcon />}
                onClick={() => setOpenPhotoDialog(true)}
                sx={{
                  borderRadius: 2.5,
                  borderColor: "rgba(104, 121, 227, 0.4)",
                  color: "#6879e3",
                  fontWeight: 600,
                  fontSize: '14px',
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(104, 121, 227, 0.08)",
                    borderColor: "#6879e3",
                  },
                }}
              >
                Add Photo
              </Button>
              <Button
                variant="outlined"
                startIcon={<LinkOutlinedIcon />}
                onClick={() => setOpenLinkDialog(true)}
                sx={{
                  borderRadius: 2.5,
                  borderColor: "rgba(104, 121, 227, 0.4)",
                  color: "#6879e3",
                  fontWeight: 600,
                  fontSize: '14px',
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(104, 121, 227, 0.08)",
                    borderColor: "#6879e3",
                  },
                }}
              >
                Add Link
              </Button>
            </Box>


            <Box sx={{ ml: 'auto' }}>
              <Button
                variant="contained"
                onClick={handlePost}
                disabled={!postText && !selectedImage}
                sx={{
                  borderRadius: 2.5,
                  px: 4,
                  py: 1.2,
                  backgroundColor: '#6879e3',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '15px',
                  boxShadow: "0 8px 24px rgba(104, 121, 227, 0.35)",
                  transition: "all 0.3s ease",
                  '&:hover': {
                    backgroundColor: '#5a6fd6',
                    boxShadow: "0 12px 32px rgba(104, 121, 227, 0.45)",
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    backgroundColor: '#c0c8e0',
                    boxShadow: "none",
                  },
                }}
              >
                Post
              </Button>
            </Box>
          </Box>
        </Paper>


        {/* Photo Dialog */}
        <Dialog
          open={openPhotoDialog}
          onClose={() => { setOpenPhotoDialog(false); setPasteImageMode(false); }}
          PaperProps={{
            sx: {
              borderRadius: "16px",
              boxShadow: "0 20px 60px rgba(104, 121, 227, 0.2)",
              minWidth: { xs: "85vw", sm: "500px" }
            }
          }}
        >
          <DialogTitle sx={{
            fontWeight: 800,
            color: '#1a1a1a',
            fontSize: '22px',
            pb: 1.5,
            pt: 3,
            px: 3,
            borderBottom: "2px solid #f0f4ff",
            background: "#ffffff"
          }}>
            📸 Add Photo
          </DialogTitle>
          <DialogContent sx={{ pt: 3, px: 3, backgroundColor: "#ffffff" }}>
            {!pasteImageMode ? (
              <Stack spacing={2.5}>
                <Button
                  variant="contained"
                  onClick={() => fileInputRef.current.click()}
                  fullWidth
                  sx={{
                    backgroundColor: '#6879e3',
                    color: 'white',
                    fontWeight: 700,
                    py: 1.3,
                    fontSize: "15px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 15px rgba(104, 121, 227, 0.3)",
                    transition: "all 0.3s ease",
                    '&:hover': {
                      backgroundColor: '#5a6fd6',
                      boxShadow: "0 8px 20px rgba(104, 121, 227, 0.4)",
                      transform: "translateY(-2px)"
                    }
                  }}
                >
                  Upload from Computer
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setPasteImageMode(true)}
                  fullWidth
                  sx={{
                    borderColor: "#6879e3",
                    color: "#6879e3",
                    fontWeight: 700,
                    py: 1.3,
                    fontSize: "15px",
                    borderRadius: "10px",
                    border: "2px solid #6879e3",
                    backgroundColor: "#ffffff",
                    transition: "all 0.3s ease",
                    '&:hover': {
                      backgroundColor: "#f0f4ff",
                      borderColor: "#5a6fd6",
                      color: "#5a6fd6",
                    }
                  }}
                >
                  Paste Image URL
                </Button>
              </Stack>
            ) : (
              <Stack spacing={2.5}>
                <TextField
                  label="Image URL"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  fullWidth
                  placeholder="https://example.com/image.jpg"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      border: "1.5px solid #e8eaf6",
                      backgroundColor: "#f9faff",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "#d0d9f7",
                      },
                      "&.Mui-focused": {
                        borderColor: "#6879e3",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 0 0 3px rgba(104, 121, 227, 0.1)",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      color: "#1a1a1a",
                      fontWeight: 500,
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "#999",
                      opacity: 1,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddImageUrl}
                  disabled={!imageUrlInput}
                  fullWidth
                  sx={{
                    backgroundColor: '#6879e3',
                    color: 'white',
                    fontWeight: 700,
                    py: 1.3,
                    fontSize: "15px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 15px rgba(104, 121, 227, 0.3)",
                    transition: "all 0.3s ease",
                    '&:hover': {
                      backgroundColor: '#5a6fd6',
                      boxShadow: "0 8px 20px rgba(104, 121, 227, 0.4)",
                      transform: "translateY(-2px)"
                    },
                    '&:disabled': {
                      backgroundColor: "#d0d9f7",
                      boxShadow: "none",
                    }
                  }}
                >
                  Add Image URL
                </Button>
              </Stack>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileSelected} />
          </DialogContent>
          <DialogActions sx={{
            p: 2.5,
            backgroundColor: "#ffffff",
            borderTop: "1px solid #f0f4ff",
            gap: 1
          }}>
            <Button
              onClick={() => { setOpenPhotoDialog(false); setPasteImageMode(false); }}
              sx={{
                color: '#999',
                fontWeight: 700,
                transition: "all 0.2s ease",
                '&:hover': {
                  backgroundColor: "#f0f4ff",
                  color: "#6879e3",
                }
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>


        {/* Link Dialog */}
        <Dialog
          open={openLinkDialog}
          onClose={() => setOpenLinkDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: "16px",
              boxShadow: "0 20px 60px rgba(104, 121, 227, 0.2)",
              minWidth: { xs: "85vw", sm: "500px" }
            }
          }}
        >
          <DialogTitle sx={{
            fontWeight: 800,
            color: '#1a1a1a',
            fontSize: '22px',
            pb: 1.5,
            pt: 3,
            px: 3,
            borderBottom: "2px solid #f0f4ff",
            background: "#ffffff"
          }}>
            🔗 Add Link
          </DialogTitle>
          <DialogContent sx={{ pt: 3, px: 3, backgroundColor: "#ffffff" }}>
            <TextField
              label="Paste Link"
              value={linkUrlInput}
              onChange={(e) => setLinkUrlInput(e.target.value)}
              fullWidth
              placeholder="https://example.com"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  border: "1.5px solid #e8eaf6",
                  backgroundColor: "#f9faff",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#d0d9f7",
                  },
                  "&.Mui-focused": {
                    borderColor: "#6879e3",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 0 0 3px rgba(104, 121, 227, 0.1)",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  color: "#1a1a1a",
                  fontWeight: 500,
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#999",
                  opacity: 1,
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{
            p: 2.5,
            backgroundColor: "#ffffff",
            borderTop: "1px solid #f0f4ff",
            gap: 1
          }}>
            <Button
              onClick={() => setOpenLinkDialog(false)}
              sx={{
                color: '#999',
                fontWeight: 700,
                transition: "all 0.2s ease",
                '&:hover': {
                  backgroundColor: "#f0f4ff",
                  color: "#6879e3",
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddLink}
              disabled={!linkUrlInput}
              sx={{
                backgroundColor: '#6879e3',
                color: 'white',
                fontWeight: 700,
                px: 3,
                borderRadius: "8px",
                boxShadow: "0 4px 15px rgba(104, 121, 227, 0.3)",
                transition: "all 0.3s ease",
                '&:hover': {
                  backgroundColor: '#5a6fd6',
                  boxShadow: "0 8px 20px rgba(104, 121, 227, 0.4)",
                  transform: "translateY(-2px)"
                },
                '&:disabled': {
                  backgroundColor: "#d0d9f7",
                  boxShadow: "none",
                }
              }}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>


        {/* POSTS SECTION */}
        <Box>
          <Typography
            variant="h6"
            mb={3.5}
            sx={{ color: '#ffffff', fontWeight: 700, fontSize: '18px', letterSpacing: '0.5px' }}
          >
            📝 Recent Posts
          </Typography>
        </Box>


        {posts.map((post) => (
          <Paper
            key={post.id}
            sx={(theme) => ({
              p: { xs: 2.5, md: 3.5 },
              mb: 3,
              borderRadius: 3,
              boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
              backgroundColor: '#ffffff',
              border: "1px solid #e8eaf6",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                boxShadow: "0 20px 60px rgba(0,0,0,0.16)",
                transform: "translateY(-4px)",
              },
            })}
          >
            {/* POST HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2.5}>
              <Box display="flex" gap={2.5}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: '#6879e3',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '16px'
                  }}
                >
                  {post.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography
                    fontWeight={700}
                    sx={{ fontSize: '15px', color: '#1a1a1a' }}
                  >
                    {post.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: '#666', fontSize: '12px', fontWeight: 500 }}
                  >
                    {post.year ? `${post.year} • ${post.createdAt ? timeAgo(post.createdAt) : post.time}` : (post.createdAt ? timeAgo(post.createdAt) : post.time)}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                size="small"
                sx={{
                  color: '#bbb',
                  '&:hover': {
                    backgroundColor: '#f0f4ff',
                    color: '#6879e3',
                  }
                }}
              >
                <MoreHorizIcon sx={{ fontSize: '20px' }} />
              </IconButton>
            </Box>


            {/* DIVIDER */}
            <Box sx={{ height: '1px', backgroundColor: '#e8eaf6', my: 2.5 }} />


            {/* POST CONTENT */}
            <Box mt={2}>
              <Typography
                sx={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.7,
                  color: '#2d2d2d',
                  fontSize: '14.5px',
                  fontWeight: 500
                }}
              >
                {post.text}
              </Typography>
            </Box>


            {post.image && (
              <Box
                component="img"
                src={post.image}
                alt="post"
                sx={{
                  width: "100%",
                  borderRadius: 2.5,
                  mt: 2.5,
                  objectFit: 'cover',
                  maxHeight: 420,
                  display: 'block',
                  boxShadow: "inset 0 0 0 1px rgba(104, 121, 227, 0.1)",
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  "&:hover": {
                    boxShadow: "inset 0 0 0 1px rgba(104, 121, 227, 0.2), 0 4px 12px rgba(0,0,0,0.08)",
                  }
                }}
              />
            )}
          </Paper>
        ))}


        {/* EMPTY STATE */}
        {posts.length === 0 && (
          <Paper
            sx={(theme) => ({
              p: 6,
              borderRadius: 3,
              textAlign: 'center',
              backgroundColor: '#ffffff',
              border: "1px solid #e8eaf6",
            })}
          >
            <Typography sx={{ color: '#999', fontSize: '16px', fontWeight: 500 }}>
              No posts yet. Be the first to share! 🚀
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};


export default HomeFeed;
