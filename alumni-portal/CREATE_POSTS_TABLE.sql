/* ============================
   CREATE POSTS TABLE
   ============================== */

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

/* ============================
   SAMPLE DATA (Optional)
   ============================== */
-- INSERT INTO posts (user_id, post_description, created_at) 
-- VALUES 
-- (1, 'Great to be back on campus for the alumni meet!', NOW()),
-- (2, 'Excited to share that I joined a new company!', NOW()),
-- (3, 'Check out this article on leadership tips', NOW());
