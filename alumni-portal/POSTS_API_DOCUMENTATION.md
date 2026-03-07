## HomeFeed Backend Setup & API Documentation

### 1. Database Table Creation

Before running the server, execute the following SQL query to create the `posts` table:

```sql
CREATE TABLE IF NOT EXISTS posts (
  post_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  post_description LONGTEXT,
  post_image_path VARCHAR(255),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES alumni_users(user_id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);
```

**Steps:**
1. Open your MySQL client (MySQL Workbench, phpMyAdmin, or terminal)
2. Connect to your `alumni_portal` database
3. Copy and paste the SQL from `CREATE_POSTS_TABLE.sql` and execute it

---

### 2. Backend API Endpoints

The following endpoints have been added to `server.js`:

#### **POST /posts/create**
Create a new post

**Request Body:**
```json
{
  "userId": 1,
  "postDescription": "Great to be back on campus for the alumni meet!",
  "postImagePath": "uploads/1703123456-image.jpg",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "message": "Post created successfully",
  "postId": 1,
  "post": {
    "post_id": 1,
    "user_id": 1,
    "post_description": "...",
    "post_image_path": "uploads/...",
    "image_url": "...",
    "created_at": "2024-12-21T10:30:00Z"
  }
}
```

---

#### **GET /posts**
Fetch all posts (ordered by newest first)

**Response:**
```json
[
  {
    "post_id": 1,
    "user_id": 1,
    "post_description": "Great to be back on campus!",
    "post_image_path": "uploads/1703123456-image.jpg",
    "image_url": null,
    "created_at": "2024-12-21T10:30:00Z",
    "name": "Amit Sharma",
    "year": "2010",
    "profile_photo": "uploads/avatar.jpg"
  }
]
```

---

#### **GET /posts/user/:userId**
Fetch posts from a specific user

**Example:** `/posts/user/1`

---

#### **DELETE /posts/:postId**
Delete a post (user can only delete their own posts)

**Request Body:**
```json
{
  "userId": 1
}
```

**Response:**
```json
{
  "message": "Post deleted successfully"
}
```

---

#### **POST /posts/upload-image**
Upload an image for a post

**Headers:**
```
Content-Type: multipart/form-data
```

**Form Data:**
- `image` (file) - the image file

**Response:**
```json
{
  "message": "Image uploaded successfully",
  "imagePath": "uploads/1703123456-filename.jpg"
}
```

---

### 3. Frontend Integration

Update `src/pages/Home/HomeFeed.jsx` to use backend endpoints:

```jsx
// Replace the handlePost function with:
const handlePost = async () => {
  if (!postText && !selectedImage) return;

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  if (!userId) {
    alert("User not logged in");
    return;
  }

  try {
    // Upload image if selected from file
    let uploadedImagePath = null;
    if (selectedImage && selectedImage.startsWith("blob:")) {
      const file = await fetch(selectedImage).then(r => r.blob());
      const formData = new FormData();
      formData.append("image", file);

      const uploadRes = await fetch("http://localhost:5000/posts/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Image upload failed");
      const uploadData = await uploadRes.json();
      uploadedImagePath = uploadData.imagePath;
    }

    // Create post
    const postRes = await fetch("http://localhost:5000/posts/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        postDescription: postText,
        postImagePath: uploadedImagePath,
        imageUrl: selectedImage?.startsWith("http") ? selectedImage : null,
      }),
    });

    if (!postRes.ok) throw new Error("Post creation failed");

    // Fetch fresh posts
    await fetchPosts();
    setPostText("");
    setSelectedImage("");
  } catch (error) {
    console.error("Error posting:", error);
    alert("Failed to create post");
  }
};

// Add useEffect to fetch posts on mount
useEffect(() => {
  fetchPosts();
}, []);

const fetchPosts = async () => {
  try {
    const res = await fetch("http://localhost:5000/posts");
    if (!res.ok) throw new Error("Failed to fetch posts");
    const data = await res.json();
    setPosts(data);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

// Add handler for delete (connect to the MoreHoriz menu)
const handleDeletePost = async (postId) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  if (!userId) {
    alert("User not logged in");
    return;
  }

  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const res = await fetch(`http://localhost:5000/posts/${postId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) throw new Error("Delete failed");
    await fetchPosts();
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("Failed to delete post");
  }
};
```

---

### 4. Environment Variables

Make sure your `.env` file includes:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=alumni_portal
PORT=5000
VITE_API_BASE_URL=http://localhost:5000
```

---

### 5. Key Features

✅ **User-to-Post relationship** - Posts are linked to users via `user_id`  
✅ **Image support** - Both file uploads and external URLs  
✅ **Authorization** - Users can only delete their own posts  
✅ **Timestamps** - Automatic creation and update timestamps  
✅ **Cascading delete** - Deleting a user deletes their posts  
✅ **Sorting** - Posts displayed newest first  

---

### 6. Testing with cURL

```bash
# Create a post
curl -X POST http://localhost:5000/posts/create \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"postDescription":"Test post!","postImagePath":null,"imageUrl":null}'

# Get all posts
curl http://localhost:5000/posts

# Get user's posts
curl http://localhost:5000/posts/user/1

# Delete a post
curl -X DELETE http://localhost:5000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"userId":1}'
```

---

### 7. Testing the API

1. Run the server: `npm run dev` or `node server.js`
2. Create a post via the frontend or test with cURL above
3. Check the `posts` table in your database
4. Posts should appear in the feed ordered by newest first

