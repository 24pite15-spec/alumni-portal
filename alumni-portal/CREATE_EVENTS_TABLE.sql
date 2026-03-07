/* ============================
   CREATE EVENTS TABLE
   ============================== */

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

/* ============================
   SAMPLE DATA (Optional)
   ============================== */
-- INSERT INTO events (event_name, event_description, event_date, event_time, event_format, venue)
-- VALUES ('Alumni Meetup', 'Yearly gathering for alumni', '2025-08-15', '18:00:00', 'offline', 'Campus Auditorium');
