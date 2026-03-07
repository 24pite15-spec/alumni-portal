# HomeFeed Backend Setup Checklist

## ✅ Setup Steps

### Step 1: Create Database Table
- [ ] Open MySQL client (Workbench, phpMyAdmin, or terminal)
- [ ] Connect to `alumni_portal` database
- [ ] Execute SQL from `CREATE_POSTS_TABLE.sql`
- [ ] Verify table created: `SHOW TABLES;` and `DESC posts;`

### Step 2: Verify Backend Endpoints
- [ ] Open `server.js`
- [ ] Confirm new endpoints added (search for `/* ====== POSTS ROUTES ======`)
- [ ] Endpoints should include:
  - `POST /posts/create`
  - `GET /posts`
  - `GET /posts/user/:userId`
  - `DELETE /posts/:postId`
  - `POST /posts/upload-image`

### Step 3: Update Frontend Component
- [ ] Open `src/pages/Home/HomeFeed.jsx`
- [ ] Replace with code from `HomeFeed_BACKEND_INTEGRATION.jsx`
- OR manually update:
  - `handlePost()` function to call `POST /posts/create`
  - Add `useEffect` to call `fetchPosts()` on mount
  - Add `fetchPosts()` function to fetch from `GET /posts`
  - Add `handleDeletePost()` function for deletions
  - Update post render to use `post.post_id`, `post.post_description`, etc.

### Step 4: Test Backend Endpoints
```bash
# Start server
npm run dev

# In another terminal, test endpoints:

# Create post
curl -X POST http://localhost:5000/posts/create \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"postDescription":"Test post!","postImagePath":null,"imageUrl":null}'

# Get all posts
curl http://localhost:5000/posts

# Get user posts
curl http://localhost:5000/posts/user/1

# Delete post
curl -X DELETE http://localhost:5000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"userId":1}'
```

### Step 5: Test Frontend
- [ ] Start dev server: `npm run dev`
- [ ] Login as alumni user
- [ ] Navigate to Home/Feed
- [ ] Try creating a post with text
- [ ] Try creating a post with image (upload)
- [ ] Try creating a post with image URL (paste)
- [ ] Verify posts appear in feed
- [ ] Try deleting own post (should work)
- [ ] Try deleting another user's post (should fail with error)

### Step 6: Database Verification
```sql
-- Check posts table has data
SELECT * FROM posts;

-- Check post count
SELECT COUNT(*) FROM posts;

-- Check with user info
SELECT p.*, u.full_name 
FROM posts p 
JOIN alumni_users u ON p.user_id = u.user_id
ORDER BY p.created_at DESC;
```

---

## 📋 Database Schema

```sql
posts table:
- post_id (INT, Primary Key, Auto Increment)
- user_id (INT, Foreign Key → alumni_users)
- post_description (LONGTEXT)
- post_image_path (VARCHAR 255) - local file uploads
- image_url (VARCHAR 500) - external image URLs
- created_at (TIMESTAMP, default current_timestamp)
- updated_at (TIMESTAMP, auto-update)
```

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Body | Auth |
|--------|----------|------|------|
| POST | `/posts/create` | userId, postDescription, postImagePath, imageUrl | userId |
| GET | `/posts` | None | None |
| GET | `/posts/user/:userId` | URL param | None |
| DELETE | `/posts/:postId` | userId (in body) | userId must match |
| POST | `/posts/upload-image` | image (file) | None |

---

## 🐛 Troubleshooting

### Posts not appearing?
- [ ] Check MySQL database for `posts` table
- [ ] Verify `alumni_users` table exists
- [ ] Check server console for errors
- [ ] Ensure userId is being sent correctly

### Image upload failing?
- [ ] Verify `uploads` folder exists in project root
- [ ] Check file size < 5MB
- [ ] Ensure file is an image type
- [ ] Check `post_image_path` column is VARCHAR(255) or larger

### Delete not working?
- [ ] Verify userId in request matches `post.user_id`
- [ ] Check server logs for authorization errors
- [ ] Ensure user is logged in with correct userId

### Frontend not fetching posts?
- [ ] Verify API_BASE_URL is correct
- [ ] Check network tab in browser DevTools
- [ ] Ensure server is running
- [ ] Check CORS is enabled in server.js

---

## 📝 Key Code Changes

### Before (localStorage only):
```jsx
const [posts, setPosts] = useState(initialPosts);

const handlePost = () => {
  const newPost = { id: Date.now(), name: "Alumni User", ...form };
  setPosts((p) => [newPost, ...p]);
  localStorage.setItem('home_feed_posts', JSON.stringify(updated));
};
```

### After (with backend):
```jsx
const [posts, setPosts] = useState([]);

useEffect(() => {
  fetchPosts();
}, []);

const fetchPosts = async () => {
  const res = await fetch(`${API_BASE_URL}/posts`);
  const data = await res.json();
  setPosts(data);
};

const handlePost = async () => {
  const res = await fetch(`${API_BASE_URL}/posts/create`, {
    method: "POST",
    body: JSON.stringify({ userId, postDescription, ... })
  });
  await fetchPosts();
};
```

---

## ✨ Features Now Available

✅ Posts persist in database  
✅ User authorization for deletions  
✅ Image file uploads  
✅ External image URLs  
✅ Automatic timestamps  
✅ User profile integration  
✅ Cascading delete (delete user → delete posts)  
✅ Proper error handling  

---

## 📚 Additional Resources

- See `POSTS_API_DOCUMENTATION.md` for full API details
- See `HomeFeed_BACKEND_INTEGRATION.jsx` for complete component code
- See `CREATE_POSTS_TABLE.sql` for database setup

