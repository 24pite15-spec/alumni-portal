# Alumni Portal - NavBar with Profile Display Implementation

## Overview
This implementation enables the navbar to display the user's full name and profile picture by properly storing and retrieving user data from localStorage and the backend.

## Files Created/Modified

### 1. **api/config.js** (NEW)
Utility module for managing user session data in localStorage:
- `getStoredUser()` - Retrieves the logged-in user from localStorage
- `storeUser(userData)` - Stores user data after login
- `updateStoredUser(updates)` - Updates specific user fields
- `clearStoredUser()` - Clears user data on logout

**Usage in NavBar:**
```javascript
import { getStoredUser } from "../api/config";

const user = getStoredUser(); // Returns user object with fullName, profilePhoto, etc.
```

### 2. **Login.jsx** (NEW)
Frontend login component that:
- Accepts email and password
- Calls `/login` endpoint
- Stores complete user data (fullName, profilePhoto, userId, etc.) in localStorage
- Redirects to home page after successful login

**Key Features:**
- Form validation
- Error handling
- Loading state
- Redirect to register page for new users

### 3. **Register.jsx** (NEW)
Frontend registration component with:
- Full Name, Email, Password fields
- Phone and Department (optional)
- Graduation year selection
- Password confirmation validation
- Redirect to login after successful registration

### 4. **init-database.js** (UPDATED)
Comprehensive database initialization script that:
- Creates `alumni_users` table with all necessary columns
- Automatically adds missing columns to existing tables
- Creates `events` table for event management
- Includes all fields needed for NavBar display:
  - `full_name` - Displayed in NavBar
  - `profile_photo` - Displayed as Avatar
  - `email` - User identification
  - And all profile-related columns

## Backend Endpoints

### Login Endpoint: `POST /login`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User login successful",
  "role": "user",
  "userId": 1,
  "email": "user@example.com",
  "fullName": "John Doe",
  "profilePhoto": "uploads/1234567890-photo.jpg",
  "department": "CSE",
  "year": 2020,
  "status": "APPROVED",
  "dob": "1998-05-15"
}
```

### Register Endpoint: `POST /register`
**Request:**
```json
{
  "fullName": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "phone": "9876543210",
  "department": "CSE",
  "year": 2020
}
```

### Get Profile: `GET /profile/:email`
**Response:**
```json
{
  "fullName": "John Doe",
  "profilePhoto": "uploads/1234567890-photo.jpg",
  "email": "user@example.com",
  "phone": "9876543210",
  "dob": "1998-05-15",
  "linkedinProfile": "https://linkedin.com/in/johndoe",
  ...
}
```

### Save Profile: `POST /profile/save`
Saves all profile information to database

### Upload Photo: `POST /profile/upload-photo`
Uploads user profile photo and stores path in database

## Data Flow

### Login Flow:
1. User enters email/password in **Login.jsx**
2. Submit to `/login` endpoint
3. Backend returns user data including `fullName` and `profilePhoto`
4. **Login.jsx** calls `storeUser(userData)` to save in localStorage
5. Redirect to home page

### Profile Update Flow:
1. User edits profile in **AboutMe.jsx**
2. Uploads photo to `/profile/upload-photo` endpoint
3. Saves profile data to `/profile/save` endpoint
4. **AboutMe.jsx** updates localStorage with new fullName and profilePhoto
5. **NavBar** reads updated user data from localStorage via `getStoredUser()`
6. NavBar re-renders with new name and profile picture

## Navbar Integration

### Current NavBar Component (from user):
```javascript
import { getStoredUser } from "../api/config";

const Navbar = () => {
  const [user, setUser] = React.useState(getStoredUser() || {});
  
  // Listen for localStorage changes
  React.useEffect(() => {
    const handler = () => {
      setUser(getStoredUser() || {});
    };
    window.addEventListener('userUpdated', handler);
    return () => window.removeEventListener('userUpdated', handler);
  }, []);

  const displayName = user.fullName || user.email || "Alumni User";
  const avatarSrc = user.profilePhoto || "";
  
  // Display in NavBar...
}
```

## localStorage Structure

After login, user data is stored as:
```javascript
{
  userId: 1,
  email: "user@example.com",
  fullName: "John Doe",
  profilePhoto: "uploads/1234567890-photo.jpg",
  department: "CSE",
  year: 2020,
  status: "APPROVED",
  role: "user",
  dob: "1998-05-15"
}
```

## Setup Instructions

### 1. Initialize Database
```bash
npm run init:db
# or
node init-database.js
```

This will:
- Create `alumni_users` table with all required columns
- Create `events` table
- Add any missing columns to existing tables

### 2. Update package.json
Add to scripts:
```json
{
  "scripts": {
    "init:db": "node init-database.js",
    "start": "node server.js"
  }
}
```

### 3. Update Router (Frontend)
Ensure your React Router includes:
```javascript
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/about-me" element={<AboutMe />} />
<Route path="/alumni/:id" element={<AlumniProfile />} />
```

## Database Schema

### alumni_users Table Columns:
| Column | Type | Purpose |
|--------|------|---------|
| user_id | INT | Primary key |
| full_name | VARCHAR(255) | Displayed in NavBar |
| email | VARCHAR(255) | User login |
| password | VARCHAR(255) | Hashed password |
| profile_photo | VARCHAR(255) | Avatar image path |
| phone_number | VARCHAR(20) | Contact info |
| department | VARCHAR(100) | User department |
| dob | DATE | Date of birth |
| year_of_passout | INT | Graduation year |
| status | VARCHAR(50) | Account approval (APPROVED/PENDING/REJECTED) |
| linkedin_profile | VARCHAR(500) | Social profile |
| current_address | TEXT | Address |
| company_name | VARCHAR(255) | Current employer |
| job_role | VARCHAR(255) | Job title |
| work_location | VARCHAR(255) | Work location |
| study_level | VARCHAR(100) | Education level |
| course_name | VARCHAR(255) | Course name |
| institution | VARCHAR(255) | School/University |
| achievements | TEXT | User achievements |
| profile_status | VARCHAR(50) | Personal status (working/studying/other) |

## Testing

### Test login flow:
1. Navigate to `/login`
2. Enter valid credentials
3. Verify user data stored in localStorage: `JSON.parse(localStorage.getItem('user'))`
4. Check NavBar displays fullName and profilePhoto

### Test profile update:
1. Navigate to `/about-me`
2. Update full name and upload profile photo
3. Save changes
4. Verify localStorage updated
5. Check NavBar reflects changes

## Troubleshooting

### NavBar not showing name/photo:
1. Check localStorage: `localStorage.getItem('user')`
2. Verify login endpoint returns `fullName` and `profilePhoto`
3. Check browser console for errors
4. Verify `getStoredUser()` is being called

### Profile photo not uploading:
1. Check `/uploads` folder exists and is writable
2. Verify photo file size < 5MB
3. Check backend logs for multer errors
4. Verify profile_photo column exists in database

### Database connection issues:
1. Verify .env file has correct DB credentials
2. Run `node init-database.js` to initialize schema
3. Check MySQL service is running
4. Verify database exists

## Security Considerations

1. **Password**: Hashed with bcrypt before storing
2. **Profile Photo**: Stored in `/uploads` directory, served as static files
3. **localStorage**: Client-side storage, not sensitive data
4. **Email**: Used as unique identifier, validated on registration
5. **Admin account**: Hardcoded email/password - should be changed in production

## Performance Notes

- `getStoredUser()` is synchronous (fast, no API call)
- NavBar updates on user login/logout events
- AboutMe component updates propagate to NavBar via localStorage events
- No repeated API calls needed for user data in NavBar

## Future Enhancements

1. Add photo cropping before upload
2. Implement automatic profile photo refresh
3. Add profile completeness indicator
4. Add social media profile links preview
5. Implement profile photo caching
