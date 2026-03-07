const HomeFeedService = require('../../service/HomeFeedService');

module.exports = {
  /**
   * Get all posts
   */
  getAllPosts: async (req, res) => {
    try {
      const posts = await HomeFeedService.getAllPosts();
      return res.status(200).json({
        success: true,
        message: 'Posts retrieved successfully',
        data: posts,
      });
    } catch (error) {
      console.error('❌ Error fetching posts:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching posts',
        error: error.message,
      });
    }
  },

  /**
   * Get posts by user
   */
  getPostsByUser: async (req, res) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      const posts = await HomeFeedService.getPostsByUser(userId);
      return res.status(200).json({
        success: true,
        message: 'User posts retrieved successfully',
        data: posts,
      });
    } catch (error) {
      console.error('❌ Error fetching user posts:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching user posts',
        error: error.message,
      });
    }
  },

  /**
   * Create new post (handles image upload)
   */
  createPost: async (req, res) => {
    try {
      // support multiple possible field names coming from various frontend
      const {
        userId,
        postDescription,
        postText,
        imageLink,
        imageUrl,
      } = req.body;

      const textContent = postDescription || postText;
      const linkContent = imageLink || imageUrl;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      // Check if both text and image/link are empty
      if (!textContent && !req.file && !linkContent) {
        return res.status(400).json({
          success: false,
          message: 'Post must contain either text, image, or link',
        });
      }

      let postImagePath = null;
      if (req.file) {
        postImagePath = `uploads/${req.file.filename}`;
      }

      const postData = {
        userId,
        postDescription: textContent || null,
        postImagePath,
        imageLink: linkContent || null,
      };

      const newPost = await HomeFeedService.createPost(postData);

      // Fetch complete post data with user info
      const posts = await HomeFeedService.getPostsByUser(userId);
      const fullPost = posts.find(p => p.post_id === newPost.post_id);

      return res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: fullPost || newPost,
      });
    } catch (error) {
      console.error('❌ Error creating post:', error);
      return res.status(500).json({
        success: false,
        message: 'Error creating post',
        error: error.message,
      });
    }
  },

  /**
   * Update post
   */
  updatePost: async (req, res) => {
    try {
      const { postId } = req.params;
      const {
        userId,
        postDescription,
        postText,
        imageLink,
        imageUrl,
      } = req.body;

      const textContent = postDescription || postText;
      const linkContent = imageLink || imageUrl;

      if (!postId || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Post ID and User ID are required',
        });
      }

      let postImagePath = undefined;
      if (req.file) {
        postImagePath = `uploads/${req.file.filename}`;
      }

      const postData = {
        postId,
        userId,
        postDescription: textContent,
        postImagePath,
        imageLink: linkContent,
      };

      await HomeFeedService.updatePost(postData);

      return res.status(200).json({
        success: true,
        message: 'Post updated successfully',
      });
    } catch (error) {
      console.error('❌ Error updating post:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating post',
        error: error.message,
      });
    }
  },

  /**
   * Delete post
   */
  deletePost: async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId } = req.body;

      if (!postId || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Post ID and User ID are required',
        });
      }

      await HomeFeedService.deletePost(postId, userId);

      return res.status(200).json({
        success: true,
        message: 'Post deleted successfully',
      });
    } catch (error) {
      console.error('❌ Error deleting post:', error);
      return res.status(500).json({
        success: false,
        message: 'Error deleting post',
        error: error.message,
      });
    }
  },
};
