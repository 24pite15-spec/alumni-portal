// ========================================
// CRITICAL FIX FOR INACTIVE TOGGLE
// ========================================
// The issue: Backend endpoint wasn't properly extracting the `action` parameter
// when it came in the request body. This fix ensures both status and action
// updates work correctly.
// ========================================

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import multer from "multer";
import fs from "fs";
import path from "path";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// mount modular routes if available (using dynamic import so ESM works)
try {
	const imported = await import("./api/homeFeed/index.js");
	const homeFeedRouter = imported.default || imported;
	if (homeFeedRouter && typeof homeFeedRouter === 'function') {
		app.use("/api/homefeed", homeFeedRouter);
	} else {
		console.warn("homeFeed router imported but did not export a router");
	}
} catch (e) {
	console.warn("Could not mount homeFeed router, continuing without it:", e.message);
}

/* ============================
	 Ensure uploads folder exists
============================ */
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir);
}

/* ============================
	 MySQL Connection Pool
============================ */
const db = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

db.getConnection((err, connection) => {
	if (err) {
		console.error("❌ MySQL connection failed:", err);
	} else {
		console.log("✅ Connected to MySQL database");

		// ensure posts table exists
		const createSql = `
		CREATE TABLE IF NOT EXISTS home_feed_posts (
		  post_id INT AUTO_INCREMENT PRIMARY KEY,
		  user_id INT NOT NULL,
		  post_description TEXT,
		  post_image_path VARCHAR(255),
		  image_link VARCHAR(255),
		  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		  INDEX (user_id)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
		`;
		connection.query(createSql, (err2) => {
			if (err2) {
				console.error("Error ensuring home_feed_posts table:", err2);
			} else {
				console.log("✅ home_feed_posts table ready");
			}
		});

		// ensure events table exists
		const createEventsSql = `
		CREATE TABLE IF NOT EXISTS events (
		  id INT AUTO_INCREMENT PRIMARY KEY,
		  event_name VARCHAR(255) NOT NULL,
		  event_description TEXT NOT NULL,
		  event_date DATE NOT NULL,
		  event_time TIME NOT NULL,
		  event_time_format VARCHAR(2) DEFAULT 'AM',
		  event_format VARCHAR(50) NOT NULL,
		  venue VARCHAR(255) NOT NULL,
		  organizer_name VARCHAR(255),
		  organizer_email VARCHAR(255),
		  invitation_image TEXT,
		  fee DECIMAL(10,2),
		  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		  INDEX (event_date)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
		`;
		connection.query(createEventsSql, (err3) => {
			if (err3) {
				console.error("Error ensuring events table:", err3);
			} else {
				console.log("✅ events table ready");
			}
		});

		connection.release();
	}
});

/* ============================
	 Multer Configuration
============================ */
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadsDir + path.sep);
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + "-" + file.originalname);
	},
});

const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
	fileFilter: (req, file, cb) => {
		if (file.mimetype && file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Only image files are allowed"), false);
		}
	},
});

// Multer error handler middleware
const handleMulterErrors = (err, req, res, next) => {
	if (err instanceof multer.MulterError) {
		console.error("❌ Multer error:", err.code, err.message);
		return res.status(400).json({ message: `File upload error: ${err.message}` });
	} else if (err) {
		console.error("❌ Custom file filter error:", err.message);
		return res.status(400).json({ message: err.message });
	}
	next();
};

app.use("/uploads", express.static(uploadsDir));

/* ============================
	 Basic Route
============================ */
app.get("/", (req, res) => {
	res.send("Alumni Server Running 🚀");
});

/* ============================
	 REGISTER
============================ */
app.post("/register", async (req, res) => {
	const { fullName, phone, department, year, dob, email: rawEmail, password } = req.body;
	const email = (rawEmail || "").trim();

	if (!fullName || !email || !password) {
		return res.status(400).json({ message: "Missing required fields" });
	}

	try {
		const hashed = await bcrypt.hash(password, 10);

		const sql = `
			INSERT INTO alumni_users 
			(full_name, phone_number, department, dob, year_of_passout, email, password, status, action) 
			VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', 'ACTIVE')
		`;

		db.query(sql, [fullName, phone, department, dob || null, year, email, hashed], (err) => {
			if (err) {
				if (err.code === "ER_DUP_ENTRY") {
					return res.status(409).json({ message: "Email already registered" });
				}
				console.error("Insert error:", err);
				return res.status(500).json({ message: "Database error", error: err.message });
			}

			return res.status(200).json({
				message: "Registration successful. Await admin approval.",
			});
		});
	} catch (err) {
		console.error("Hash error:", err);
		return res.status(500).json({ message: "Server error", error: err.message });
	}
});

/* ============================
	 LOGIN
============================ */
app.post("/login", (req, res) => {
	const { email: rawEmail, password } = req.body;
	const email = (rawEmail || "").trim();

	if (!email || !password) {
		return res.status(400).json({ message: "Email and password required" });
	}

	// Admin shortcut
	if (email === "24pite15@ldc.edu.in" && password === "QWERTY@123") {
		return res.status(200).json({
			message: "Admin login successful",
			role: "admin",
		});
	}

	const sql = "SELECT * FROM alumni_users WHERE email = ?";

	db.query(sql, [email], async (err, results) => {
		if (err) {
			console.error("DB error on login:", err);
			return res.status(500).json({ message: "Server error", error: err.message });
		}

		if (!results.length) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const user = results[0];

		try {
			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				return res.status(401).json({ message: "Invalid credentials" });
			}
		} catch (e) {
			console.error("bcrypt compare error:", e);
			return res.status(500).json({ message: "Server error", error: e.message });
		}

		// ✅ Check 1: Status must be APPROVED
		if (String(user.status).toUpperCase() !== "APPROVED") {
			return res.status(403).json({
				message: `Account not approved yet (status: ${user.status}).`,
			});
		}

		// ✅ Check 2: Action must be ACTIVE (not INACTIVE)
		const userAction = String(user.action || "ACTIVE").toUpperCase();
		if (userAction === "INACTIVE") {
			return res.status(403).json({
				message: `Your account is currently inactive. Contact admin to activate.`,
			});
		}

		return res.status(200).json({
			message: "User login successful",
			role: "user",
			userId: user.user_id,
			email: user.email,
			department: user.department,
			dob: user.dob,
			year: user.year_of_passout,
			status: user.status,
			action: user.action || "ACTIVE",
			fullName: user.full_name,
			profilePhoto: user.profile_photo || null,
		});
	});
});

/* ============================
	 ADMIN ROUTES
============================ */
app.get("/admin/users", (req, res) => {
	const sql = `
		SELECT user_id, full_name as name, phone_number,
					 department, year_of_passout, email, status, action, created_at
		FROM alumni_users
		ORDER BY created_at DESC
	`;

	db.query(sql, (err, results) => {
		if (err) {
			console.error("Error fetching users:", err);
			return res.status(500).json({ message: "Database error", error: err.message });
		}
		res.json(results);
	});
});

/* ============================
	 UPDATE STATUS & ACTION ENDPOINT
	 ✅ FIXED: Properly extracts and handles both status and action parameters
============================ */
app.put("/admin/update-status", (req, res) => {
	// ✅ CRITICAL FIX: Properly extract parameters from request body
	const { email: rawEmail, status, action } = req.body || {};
	const email = (rawEmail || "").trim();

	console.log(`📥 PUT /admin/update-status received:`, {
		email,
		status,
		action,
		fullBody: req.body
	});

	if (!email) {
		console.error("❌ Missing email in request");
		return res.status(400).json({ message: "Missing email" });
	}

	if (!status && !action) {
		console.error("❌ Missing both status and action in request");
		return res.status(400).json({ message: "Missing status or action" });
	}

	db.query("SELECT status, action FROM alumni_users WHERE email = ?", [email], (err, rows) => {
		if (err) {
			console.error("Error checking user:", err);
			return res.status(500).json({ message: "Database error", error: err.message });
		}

		if (!rows.length) {
			console.error(`❌ User not found: ${email}`);
			return res.status(404).json({ message: "User not found" });
		}

		const currentStatus = String(rows[0].status).toUpperCase();
		const currentAction = String(rows[0].action || "ACTIVE").toUpperCase();

		console.log(`📊 Current state for ${email}:`, {
			currentStatus,
			currentAction,
		});

		let updateFields = [];
		let updateValues = [];

		// ========================================
		// CASE 1: Update Status (PENDING → APPROVED or REJECTED)
		// ========================================
		if (status) {
			const upperStatus = String(status).toUpperCase();
			console.log(`🔄 Processing status update: ${upperStatus}`);

			// If approving a PENDING user, also set action to ACTIVE
			if (upperStatus === "APPROVED" && currentStatus === "PENDING") {
				console.log(`✅ Approving user: Setting status=APPROVED, action=ACTIVE`);
				updateFields.push("status = ?", "action = ?");
				updateValues.push("APPROVED", "ACTIVE");
			}
			// If rejecting a PENDING user
			else if (upperStatus === "REJECTED" && currentStatus === "PENDING") {
				console.log(`❌ Rejecting user: Setting status=REJECTED`);
				updateFields.push("status = ?");
				updateValues.push("REJECTED");
			}
			// Cannot change status for already approved users
			else if (currentStatus === "APPROVED") {
				console.error(`❌ Cannot change status for APPROVED user`);
				return res.status(400).json({ 
					message: "Cannot change status once account is approved. Use action column to toggle Active/Inactive." 
				});
			}
			else {
				updateFields.push("status = ?");
				updateValues.push(upperStatus);
			}
		}

		// ========================================
		// CASE 2: Update Action (ACTIVE ↔ INACTIVE)
		// Only for APPROVED users
		// ========================================
		if (action) {
			const upperAction = String(action).toUpperCase();
			console.log(`🔄 Processing action update: ${upperAction}`);

			if (currentStatus !== "APPROVED") {
				console.error(`❌ Cannot change action for non-APPROVED user. Current status: ${currentStatus}`);
				return res.status(400).json({ 
					message: "Can only change action for APPROVED users" 
				});
			}

			if (upperAction === "ACTIVE" || upperAction === "INACTIVE") {
				console.log(`✅ Setting action=${upperAction}`);
				updateFields.push("action = ?");
				updateValues.push(upperAction);
			} else {
				console.error(`❌ Invalid action value: ${action}`);
				return res.status(400).json({ 
					message: "Invalid action. Use ACTIVE or INACTIVE" 
				});
			}
		}

		// If no valid updates
		if (updateFields.length === 0) {
			console.error(`❌ No valid update fields generated`);
			return res.status(400).json({ message: "No valid updates provided" });
		}

		// Build and execute update query
		updateValues.push(email);
		const updateSql = `UPDATE alumni_users SET ${updateFields.join(", ")} WHERE email = ?`;

		console.log(`📤 Executing SQL:`, updateSql);
		console.log(`📤 With values:`, updateValues);

		db.query(updateSql, updateValues, (err2) => {
			if (err2) {
				console.error("Error updating user:", err2);
				return res.status(500).json({ 
					message: "Database error", 
					error: err2.message 
				});
			}

			console.log(`✅ Successfully updated user: ${email}`);
			return res.status(200).json({ 
				message: "User updated successfully",
				updatedFields: updateFields,
				updatedValues: updateValues.slice(0, -1) // exclude email
			});
		});
	});
});

/* ============================
	 PROFILE SAVE (JSON)
============================ */
app.post("/profile/save", (req, res) => {
	const data = req.body || {};
	console.log("/profile/save called with:", data);

	const email = (data.email || "").trim();
	app.use("/uploads", express.static(uploadsDir));
	if (!email) return res.status(400).json({ message: "Email is required to save profile" });

	db.query("SELECT status FROM alumni_users WHERE email = ?", [email], (err, rows) => {
		if (err) {
			console.error("Status check error:", err);
			return res.status(500).json({ message: "Database error", error: err.message });
		}
		if (!rows.length) {
			return res.status(404).json({ message: "User not found" });
		}
		if (String(rows[0].status).toUpperCase() !== "APPROVED") {
			return res.status(403).json({ message: "Profile cannot be updated until account is approved" });
		}

		const allowed = {
			full_name: data.fullName,
			phone_number: data.phone,
			dob: data.dob || null,
			linkedin_profile: data.linkedinProfile,
			current_address: data.currentAddress,
			company_name: data.companyName,
			job_role: data.jobRole,
			work_location: data.workLocation,
			study_level: data.studyLevel,
			study_level_other: data.studyLevelOther,
			course_name: data.courseName,
			institution: data.institution,
			institution_location: data.institutionLocation,
			other_text: data.otherText,
			prefer_not_to_say: data.preferNotToSay === true ? 1 : undefined,
			achievements: data.achievements,
			profile_photo: data.profilePhoto,
			profile_status: data.status,
		};

		const keys = Object.keys(allowed).filter((k) => allowed[k] !== undefined && allowed[k] !== null && String(allowed[k]).length > 0);
		if (keys.length === 0) return res.status(400).json({ message: "No fields to update" });

		const setClause = keys.map((k) => `${k} = ?`).join(", ");
		const values = keys.map((k) => allowed[k]);
		values.push(email);

		const sql = `UPDATE alumni_users SET ${setClause} WHERE email = ?`;

		db.query(sql, values, (err, result) => {
			if (err) {
				if (err.message && err.message.includes("Unknown column 'profile_status'")) {
					console.warn('profile_status column not found, retrying without it');
					const filteredKeys = keys.filter(k => k !== 'profile_status');
					const fallbackSet = filteredKeys.map(k => `${k} = ?`).join(', ');
					const fallbackValues = filteredKeys.map(k => allowed[k]);
					fallbackValues.push(email);
					const fallbackSql = `UPDATE alumni_users SET ${fallbackSet} WHERE email = ?`;
					return db.query(fallbackSql, fallbackValues, (err2, res2) => {
						if (err2) {
							console.error("Profile save retry error:", err2);
							return res.status(500).json({ message: "Database error", error: err2.message });
						}
						return res.status(200).json({ message: "Profile saved successfully" });
					});
				}

				console.error("Profile save error:", err);
				return res.status(500).json({ message: "Database error", error: err.message });
			}

			db.query("SELECT * FROM alumni_users WHERE email = ?", [email], (err2, rows2) => {
				if (err2) {
					console.error("Fetch after update error:", err2);
					return res.status(500).json({ message: "Database error", error: err2.message });
				}

				const row = rows2[0];

				const payload = {
					fullName: row.full_name,
					email: row.email,
					phone: row.phone_number,
					dob: row.dob,
					linkedinProfile: row.linkedin_profile,
					batchYear: row.year_of_passout,
					profilePhoto: row.profile_photo,
					currentAddress: row.current_address,
					status: row.profile_status || row.status,
					companyName: row.company_name,
					jobRole: row.job_role,
					workLocation: row.work_location,
					studyLevel: row.study_level,
					studyLevelOther: row.study_level_other,
					courseName: row.course_name,
					institution: row.institution,
					institutionLocation: row.institution_location,
					otherText: row.other_text,
					preferNotToSay: row.prefer_not_to_say ? true : false,
					achievements: row.achievements,
				};

				return res.status(200).json(payload);
			});
		});
	});
});

/* ============================
	 PROFILE PHOTO UPLOAD
============================ */
app.post("/profile/upload-photo", (req, res, next) => {
	upload.single("photo")(req, res, (err) => {
		if (err) {
			console.error("❌ Upload middleware error:", err);
			return handleMulterErrors(err, req, res, next);
		}

		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		const email = (req.body.email || "").trim();

		if (!email) {
			return res.status(400).json({ message: "Email missing" });
		}

		const photoPath = `uploads/${req.file.filename}`;

		const sql = "UPDATE alumni_users SET profile_photo = ? WHERE email = ?";

		db.query(sql, [photoPath, email], (err, result) => {
			if (err) {
				console.error("❌ Photo update error:", err);
				return res.status(500).json({ message: "Database error", error: err.message });
			}

			if (result.affectedRows === 0) {
				return res.status(404).json({ message: "User not found" });
			}

			res.status(200).json({
				message: "Photo uploaded successfully",
				photoPath,
			});
		});
	});
});

// return the counts of approved alumni grouped by batch year
app.get("/alumni/batch-counts", (req, res) => {
	let sql = `
		SELECT year_of_passout AS year,
			   COUNT(*) AS count
		FROM alumni_users
	`;
	const params = [];
	if (req.query.approved === 'true') {
		sql += " WHERE status = 'APPROVED' AND action = 'ACTIVE'";
	}
	sql += `
		GROUP BY year_of_passout
		ORDER BY year_of_passout DESC
	`;

	db.query(sql, (err, results) => {
		if (err) {
			console.error("Batch count error:", err);
			return res.status(500).json({ message: "Database error", error: err.message });
		}
		res.json(results);
	});
});

// list alumni with filtering
app.get("/alumni", (req, res) => {
	const { year, role, location, department, name } = req.query;

	let sql = `
		SELECT
			user_id,
			full_name,
			department,
			year_of_passout AS year,
			email,
			phone_number,
			dob,
			linkedin_profile,
			profile_photo,
			current_address,
			COALESCE(profile_status, '') AS status,
			company_name,
			job_role,
			work_location,
			study_level,
			study_level_other,
			course_name,
			institution,
			institution_location,
			other_text,
			achievements,
			prefer_not_to_say
		FROM alumni_users
		WHERE status = 'APPROVED' AND action = 'ACTIVE'
	`;

	const params = [];

	if (year) {
		sql += " AND year_of_passout = ?";
		params.push(parseInt(year));
	}

	if (role) {
		sql += " AND job_role LIKE ?";
		params.push(`%${role}%`);
	}

	if (department) {
		sql += " AND department LIKE ?";
		params.push(`%${department}%`);
	}

	if (location) {
		sql += " AND work_location LIKE ?";
		params.push(`%${location}%`);
	}

	if (name) {
		sql += " AND full_name LIKE ?";
		params.push(`%${name}%`);
	}

	sql += " ORDER BY year_of_passout DESC, full_name ASC";

	db.query(sql, params, (err, results) => {
		if (err) {
			console.error("Alumni list error:", err);
			return res.status(500).json({
				success: false,
				message: "Database error",
				error: err.message,
			});
		}
		res.json({ success: true, data: results });
	});
});

// single alumnus by id (user_id)
app.get("/alumni/:id", (req, res) => {
	const id = req.params.id;
	if (!id) return res.status(400).json({ success: false, message: 'ID required' });

	const sql = `
		SELECT 
			user_id,
			full_name,
			email,
			phone_number,
			department,
			dob,
			year_of_passout AS year,
			year_of_passout AS batchYear,
			profile_photo,
			linkedin_profile,
			current_address,
			company_name,
			job_role,
			work_location,
			study_level,
			study_level_other,
			course_name,
			institution,
			institution_location,
			other_text,
			achievements,
			prefer_not_to_say,
			COALESCE(profile_status, '') AS status
		FROM alumni_users 
		WHERE user_id = ? AND status = 'APPROVED' AND action = 'ACTIVE'
	`;
	db.query(sql, [id], (err, rows) => {
		if (err) {
			console.error('Alumni fetch error:', err);
			return res.status(500).json({ success: false, message: 'Database error', error: err.message });
		}
		if (!rows.length) return res.status(404).json({ success: false, message: 'Alumni not found' });
		res.json({ success: true, data: rows[0] });
	});
});

app.get("/profile/:email", (req, res) => {
	const email = (req.params.email || "").trim();

	if (!email) {
		return res.status(400).json({ message: "Email required" });
	}

	const sql = "SELECT * FROM alumni_users WHERE email = ?";

	db.query(sql, [email], (err, results) => {
		if (err) {
			console.error("Profile fetch error:", err);
			return res.status(500).json({ message: "Database error", error: err.message });
		}

		if (!results.length) {
			return res.status(404).json({ message: "User not found" });
		}

		const row = results[0];

		if (String(row.status).toUpperCase() !== "APPROVED") {
			return res.status(403).json({ message: "Profile not available until account is approved" });
		}

		const payload = {
			fullName: row.full_name,
			email: row.email,
			phone: row.phone_number,
			dob: row.dob,
			linkedinProfile: row.linkedin_profile,
			batchYear: row.year_of_passout,
			profilePhoto: row.profile_photo,
			currentAddress: row.current_address,
			status: row.profile_status || row.status,
			companyName: row.company_name,
			jobRole: row.job_role,
			workLocation: row.work_location,
			studyLevel: row.study_level,
			studyLevelOther: row.study_level_other,
			courseName: row.course_name,
			institution: row.institution,
			institutionLocation: row.institution_location,
			otherText: row.other_text,
			preferNotToSay: row.prefer_not_to_say ? true : false,
			achievements: row.achievements,
		};

		res.status(200).json(payload);
	});
});


/* ============================
   EVENTS ROUTES
============================ */

app.get("/events", (req, res) => {
	const sql = "SELECT * FROM events ORDER BY event_date DESC, event_time DESC";
	db.query(sql, (err, results) => {
		if (err) {
			console.error("Events list error:", err);
			return res.status(500).json({ success: false, message: "Database error", error: err.message });
		}
		res.json(results);
	});
});

app.post("/events/upload-image", (req, res, next) => {
	upload.single("image")(req, res, (err) => {
		if (err) {
			console.error("❌ Event image upload error:", err);
			return handleMulterErrors(err, req, res, next);
		}

		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		const imagePath = `uploads/${req.file.filename}`;
		res.status(200).json({
			message: "Image uploaded successfully",
			imagePath,
		});
	});
});

// ----------------------------------------------------------------
// Home‑feed post image upload (was missing earlier, causing 404s)
// ----------------------------------------------------------------
app.post("/posts/upload-image", (req, res, next) => {
	upload.single("image")(req, res, (err) => {
		if (err) {
			console.error("❌ Post image upload error:", err);
			return handleMulterErrors(err, req, res, next);
		}

		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		const imagePath = `uploads/${req.file.filename}`;
		res.status(200).json({
			message: "Image uploaded successfully",
			imagePath,
		});
	});
});

app.post("/events", (req, res) => {
	const {
		event_name,
		event_description,
		event_date,
		event_time,
		event_time_format,
		event_format,
		venue,
		organizer_name,
		organizer_email,
		invitation_image,
		fee,
	} = req.body;

	if (
		!event_name ||
		!event_description ||
		!event_date ||
		!event_time ||
		!event_format ||
		!venue
	) {
		return res.status(400).json({ success: false, message: "Missing required fields" });
	}

	const sql = `
		INSERT INTO events (
			event_name,
			event_description,
			event_date,
			event_time,
			event_time_format,
			event_format,
			venue,
			organizer_name,
			organizer_email,
			invitation_image,
			fee,
			created_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
	`;

	console.log("Creating event with invitation_image:", invitation_image);

	db.query(
		sql,
		[
			event_name,
			event_description,
			event_date,
			event_time,
			event_time_format || 'AM',
			event_format,
			venue,
			organizer_name || null,
			organizer_email || null,
			invitation_image || null,
			fee != null ? fee : null,
		],
		(err, result) => {
			if (err) {
				console.error("Event create error:", err);
				return res.status(500).json({ success: false, message: "Database error", error: err.message });
			}
			const newEvent = {
				id: result.insertId,
				event_name,
				event_description,
				event_date,
				event_time,
				event_time_format: event_time_format || 'AM',
				event_format,
				venue,
				organizer_name: organizer_name || null,
				organizer_email: organizer_email || null,
				invitation_image: invitation_image || null,
				fee: fee != null ? Number(fee) : null,
				created_at: new Date(),
			};
			res.status(201).json(newEvent);
		}
	);
});

app.get("/api/events", (req, res) => {
	const sql = "SELECT * FROM events ORDER BY event_date DESC, event_time DESC";
	db.query(sql, (err, results) => {
		if (err) {
			console.error("Events list error (api):", err);
			return res.status(500).json({ success: false, message: "Database error", error: err.message });
		}
		res.json(results);
	});
});

app.post("/api/events/upload-image", (req, res, next) => {
	upload.single("image")(req, res, (err) => {
		if (err) {
			console.error("❌ Event image upload error (api):", err);
			return handleMulterErrors(err, req, res, next);
		}
		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}
		const imagePath = `uploads/${req.file.filename}`;
		res.status(200).json({ message: "Image uploaded successfully", imagePath });
	});
});

app.post("/api/events", (req, res) => {
	const {
		event_name,
		event_description,
		event_date,
		event_time,
		event_time_format,
		event_format,
		venue,
		organizer_name,
		organizer_email,
		invitation_image,
		fee,
	} = req.body;
	if (
		!event_name ||
		!event_description ||
		!event_date ||
		!event_time ||
		!event_format ||
		!venue
	) {
		return res.status(400).json({ success: false, message: "Missing required fields" });
	}
	console.log("Creating event with invitation_image (api):", invitation_image);
	const sql = `
		INSERT INTO events (
			event_name,
			event_description,
			event_date,
			event_time,
			event_time_format,
			event_format,
			venue,
			organizer_name,
			organizer_email,
			invitation_image,
			fee,
			created_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
	`;
	db.query(
		sql,
		[
			event_name,
			event_description,
			event_date,
			event_time,
			event_time_format || 'AM',
			event_format,
			venue,
			organizer_name || null,
			organizer_email || null,
			invitation_image || null,
			fee != null ? fee : null,
		],
		(err, result) => {
			if (err) {
				console.error("Event create error (api):", err);
				return res.status(500).json({ success: false, message: "Database error", error: err.message });
			}
			const newEvent = {
				id: result.insertId,
				event_name,
				event_description,
				event_date,
				event_time,
				event_time_format: event_time_format || 'AM',
				event_format,
				venue,
				organizer_name: organizer_name || null,
				organizer_email: organizer_email || null,
				invitation_image: invitation_image || null,
				fee: fee != null ? Number(fee) : null,
				created_at: new Date(),
			};
			res.status(201).json(newEvent);
		}
	);
});

/* ============================
	 JOB POSTINGS API
============================ */

const handleCreateJob = (req, res) => {
	const {
		userId,
		fullName,
		email,
		jobCategory,
		skills,
		preferredLocation,
		contactNumber,
		jobDescription,
	} = req.body || {};

	if (
		!userId || !fullName || !email ||
		!jobCategory || !skills || !preferredLocation ||
		!contactNumber || !jobDescription
	) {
		return res.status(400).json({ message: "All fields are required" });
	}

	const sql = `
		INSERT INTO job_seeker_posts
		(user_id, full_name, email, job_category, skills, preferred_location, contact_number, job_description, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
	`;

	db.query(
		sql,
		[userId, fullName, email, jobCategory, skills, preferredLocation, contactNumber, jobDescription],
		(err, result) => {
			if (err) {
				console.error("Job insert error:", err);
				return res.status(500).json({ message: "Database error", error: err.message });
			}

			const jobPostId = result.insertId;

			const feedSql = `
				INSERT INTO home_feed_posts (user_id, post_description, created_at)
				VALUES (?, ?, NOW())
			`;

			const feedDescription = `📢 Job :
Name: ${fullName}
Category: ${jobCategory}
Location: ${preferredLocation}
Description: ${jobDescription}`;

			db.query(feedSql, [userId, feedDescription], (feedErr) => {
				if (feedErr) {
					console.error("Home feed insert error:", feedErr);
				}
			});

			res.status(201).json({
				message: "Job posted successfully",
				postId: jobPostId
			});
		}
	);
};

app.post("/jobs", handleCreateJob);
app.post("/job-posts", handleCreateJob);

const handleFetchJobs = (req, res) => {
	const sql = `SELECT * FROM job_seeker_posts ORDER BY created_at DESC`;
	
	db.query(sql, (err, results) => {
		if (err) {
			console.error("Job fetch error:", err);
			return res.status(500).json({ message: "Database error", error: err.message });
		}
		res.json(results);
	});
};

app.get("/jobs", handleFetchJobs);
app.get("/job-posts", handleFetchJobs);

const handleFetchJobsByUser = (req, res) => {
	const userId = req.params.userId;
	if (!userId) {
		return res.status(400).json({ message: "User ID required" });
	}
	const sql = `SELECT * FROM job_seeker_posts WHERE user_id = ? ORDER BY created_at DESC`;
	
	db.query(sql, [userId], (err, results) => {
		if (err) {
			console.error("Job fetch by user error:", err);
			return res.status(500).json({ message: "Database error", error: err.message });
		}
		res.json(results);
	});
};

app.get("/jobs/user/:userId", handleFetchJobsByUser);
app.get("/job-posts/user/:userId", handleFetchJobsByUser);


app.get("/posts", (req, res) => {
	console.log("/posts listing requested");
	const sql = `
		SELECT 
			hfp.post_id,
			hfp.user_id,
			hfp.post_image_path,
			hfp.image_link AS image_url,
			hfp.post_description,
			hfp.created_at,
			au.full_name as name,
			au.year_of_passout as year,
			au.profile_photo as profile_photo
		FROM home_feed_posts hfp
		LEFT JOIN alumni_users au ON hfp.user_id = au.user_id
		ORDER BY hfp.created_at DESC
	`;

	db.query(sql, (err, results) => {
		if (err) {
			console.error("Error fetching posts:", err);
			return res.status(500).json({ success: false, message: "Database error", error: err.message });
		}
		res.json(results || []);
	});
});

app.post("/posts/create", (req, res) => {
	console.log("/posts/create called with body", req.body);
	const {
		userId,
		fullName,
		year,
		postDescription,
		postText,
		imageUrl,
		postImagePath,
	} = req.body || {};

	if (!userId) {
		return res.status(400).json({ success: false, message: "User ID is required" });
	}

	const textContent = postDescription || postText;
	
	if (!textContent && !imageUrl && !postImagePath) {
		return res.status(400).json({ success: false, message: "Post must contain text or an image/link" });
	}

	const sql = `
		INSERT INTO home_feed_posts
		(user_id, post_description, post_image_path, image_link, created_at)
		VALUES (?, ?, ?, ?, NOW())
	`;

	const values = [
		userId,
		textContent || null,
		postImagePath || null,
		imageUrl || null,
	];

	db.query(sql, values, (err, result) => {
		if (err) {
			console.error("Error inserting post:", err);
			return res.status(500).json({ success: false, message: "Database error", error: err.message });
		}

		const insertedId = result.insertId;
		const fetchSql = `
			SELECT hfp.*, au.full_name as name, au.year_of_passout as year, au.profile_photo as profile_photo
			FROM home_feed_posts hfp
			LEFT JOIN alumni_users au ON hfp.user_id = au.user_id
			WHERE hfp.post_id = ?
		`;
		db.query(fetchSql, [insertedId], (err2, rows) => {
			if (err2) {
				console.error("Error fetching new post:", err2);
				return res.status(201).json({ success: true, postId: insertedId });
			}
			return res.status(201).json({ success: true, data: rows[0] || { post_id: insertedId } });
		});
	});
});


/* ============================
	 Start Server
============================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
});
