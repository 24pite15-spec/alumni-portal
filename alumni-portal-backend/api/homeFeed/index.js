const express = require('express');
const router = express.Router();
const homeFeedController = require('./homeFeed.controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer configuration for post images
const uploadsDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `post_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Error handler for multer
const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('❌ Multer error:', err.code, err.message);
    return res.status(400).json({ 
      success: false, 
      message: `File upload error: ${err.message}` 
    });
  } else if (err) {
    console.error('❌ File filter error:', err.message);
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
  next();
};

/**
 * Get all posts
 * GET /api/homefeed/posts
 */
router.get('/posts', homeFeedController.getAllPosts);

/**
 * Get posts by user
 * GET /api/homefeed/posts/user/:userId
 */
router.get('/posts/user/:userId', homeFeedController.getPostsByUser);

/**
 * Create new post with optional image upload
 * POST /api/homefeed/posts
 * Body: { userId, postDescription, imageLink }
 * File: optional image file
 */
router.post('/posts', (req, res, next) => {
  upload.single('postImage')(req, res, (err) => {
    if (err) {
      return handleMulterErrors(err, req, res, next);
    }
    next();
  });
}, homeFeedController.createPost);

/**
 * Update post
 * PUT /api/homefeed/posts/:postId
 */
router.put('/posts/:postId', (req, res, next) => {
  upload.single('postImage')(req, res, (err) => {
    if (err) {
      return handleMulterErrors(err, req, res, next);
    }
    next();
  });
}, homeFeedController.updatePost);

/**
 * Delete post
 * DELETE /api/homefeed/posts/:postId
 */
router.delete('/posts/:postId', homeFeedController.deletePost);

module.exports = router;
