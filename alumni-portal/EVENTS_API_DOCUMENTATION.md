## Events Backend Setup & API Documentation

### 1. Database Table Creation

Before running the server, execute the following SQL query to create the `events` table:

```sql
-- see CREATE_EVENTS_TABLE.sql for full script
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_name VARCHAR(255) NOT NULL,
  event_description LONGTEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  event_format ENUM('online','offline') DEFAULT 'offline',
  venue VARCHAR(255),
  organizer_name VARCHAR(255),
  organizer_email VARCHAR(255),
  invitation_image VARCHAR(255),
  fee DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

(Optional sample row is included in `CREATE_EVENTS_TABLE.sql`.)

### 2. Backend API Endpoints

#### **POST /events**
Create a new event. Accepts a JSON payload with the following fields:

```json
{
  "event_name": "Alumni Reunion",
  "event_description": "Join us for a night of memories...",
  "event_date": "2026-07-20",
  "event_time": "18:30:00",
  "event_format": "offline",        // "online" or "offline"
  "venue": "Campus Auditorium",
  "organizer_name": "John Doe",
  "organizer_email": "john@example.com",
  "invitation_image": "uploads/170...]",  // path returned by image upload if used
  "fee": 200.00                   // optional numeric value (amount in Indian Rupees - INR)
}
```

Response:

```json
{
  "message": "Event created successfully",
  "id": 3,                // new record id
  ... (echoed request body)
}
```

#### **GET /events**
Fetch all events (sorted by date/time descending).

Response is an array of event records:

```json
[
  {
    "id": 3,
    "event_name": "Alumni Reunion",
    "event_description": "...",
    "event_date": "2026-07-20",
    "event_time": "18:30:00",
    "event_format": "offline",
    "venue": "Campus Auditorium",
    "organizer_name": "John Doe",
    "organizer_email": "john@example.com",
    "invitation_image": "uploads/170...]",
    "fee": 200.00,
    "created_at": "2026-03-05T12:00:00.000Z",
    "updated_at": "2026-03-05T12:00:00.000Z"
  }
]
```

### 3. Frontend Integration

The React frontend (see `src/pages/Home/Events.jsx`) already points at these endpoints via `eventsAPI`.
Make sure the `VITE_API_BASE_URL` environment variable is set to your server's URL (default `http://localhost:5000`).

---

> After adding the table, restart the server or re-run migrations so that `/events` endpoints become available.