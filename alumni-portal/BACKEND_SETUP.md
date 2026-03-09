# Alumni Portal - Backend Setup Guide

## Server Configuration

The backend API server has been provided in your user request. Here's what you need to do:

### 1. Backend Setup (Node.js/Express)

**Required Modules:**
```bash
npm install express cors mysql2 bcryptjs dotenv
```

**Create a `.env` file in your backend directory:**
```env
# If you don't have a running MySQL instance handy you can still start
# the server; it will run in "limited mode" and return empty results for
# DB-backed endpoints.  Errors will be logged but the process won't crash.
# To enable a real database, supply the following values:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=alumni_portal
PORT=5000
```

**Database Setup:**
Run the provided SQL schema to create the `alumni_users` table:
```sql
CREATE TABLE alumni_users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone_number VARCHAR(15) NOT NULL,
    department VARCHAR(100) NOT NULL,
    year_of_passout YEAR NOT NULL,
    password VARCHAR(255) NOT NULL,
    status ENUM('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
    current_status ENUM('STUDYING','WORKING','OTHER') NOT NULL,
    date_of_birth DATE NULL,
    linkedin_profile_url VARCHAR(255) NULL,
    profile_photo VARCHAR(255) NULL,
    current_address TEXT NULL,
    achievements TEXT NULL,
    description TEXT NULL,
    level_of_study VARCHAR(100) NULL,
    course_or_major VARCHAR(150) NULL,
    institution_name VARCHAR(150) NULL,
    institution_location VARCHAR(150) NULL,
    company_name VARCHAR(150) NULL,
    job_title VARCHAR(150) NULL,
    work_location VARCHAR(150) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Start the server:**
```bash
node server.js
```

The server will run on `http://localhost:5000`

### 2. Frontend Configuration

The frontend has been updated with:
- ✅ Environment variable support for API base URL
- ✅ Proper userId storage in localStorage
- ✅ Fixed year dropdown in signup form
- ✅ API configuration module in `src/api/config.js`

**Frontend Environment File (.env.local):**
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 3. API Endpoints Overview

#### Authentication
- **POST /register** - User signup
  - Fields: fullName, phone, department, year, email, password
  - Response: { message: "Registration successful. Await admin approval." }

- **POST /login** - User/Admin login
  - Fields: email, password
  - Response: { role: "admin|user", userId: 123, message: "Login successful" }
  - Admin credentials: email: `24pite15@ldc.edu.in`, password: `QWERTY@123`

#### User Profile
- **PUT /aboutme/:id** - Update user profile
  - All profile fields: current_status, date_of_birth, linkedin_profile_url, etc.

#### Admin
- **GET /admin/users** - Get all users
- **PUT /admin/update-status** - Modify a user's state. Accepts JSON
  payload with `email` plus one of:
  - `status` (APPROVED/REJECTED) to move a pending account through approval
  - `action` (ACTIVE/INACTIVE) to toggle an approved account's active state
  The server will return 400 if neither field is provided or if the
  transition is invalid.
### 4. Frontend Workflow

**Login Page:**
- Accepts email and password
- Validates input (6+ char password, valid email format)
- Stores user data in localStorage
- Redirects to /admin for admin role, /home for users

**Signup Page:**
- Accepts: fullName, phone, department, year, email, password
- Validates password: 8+ chars, 1 uppercase, 1 number, 1 special char
- Shows success message and redirects to login
- Users start with PENDING status - must be approved by admin

### 5. Testing the Integration

1. Start the backend server (Node.js)
2. Ensure MySQL is running with the alumni_users table created
3. Start the frontend with `npm run dev`
4. Test signup flow - create a new account
5. Login as admin with provided credentials
6. Approve the user in admin dashboard
7. Login as the approved user

### 6. Security Notes

- Admin credentials are hardcoded for this college project (as noted)
- Passwords are hashed with bcryptjs (10 salt rounds)
- For production, implement proper authentication (JWT tokens, refresh tokens)
- Update admin authentication mechanism
- Use HTTPS/SSL in production
- Add input validation on the backend
