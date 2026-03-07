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
// allow larger payloads since event objects may include base64 images
app.use(express.json({ limit: '10mb' }));

// safe global handlers so the server won't exit on unexpected errors
process.on('uncaughtException', (err) => {
	console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (reason) => {
	console.error('Unhandled promise rejection:', reason);
});

// simple logger for each incoming request (helps track 404s)
app.use((req, res, next) => {
	console.log(`⇨ ${req.method} ${req.path}`);
	next();
});

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
let dbReady = false;
let db;

// if credentials are missing, provide a stubbed interface so the server can
// start without a real database. this avoids crashes during early setup.
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
	console.warn('Database credentials not provided, running in limited mode');
	db = {
		query: (sql, params, cb) => {
			// always return empty results
			console.warn('db.query called while DB disabled');
			return cb(null, []);
		},
		getConnection: (cb) => cb(new Error('DB disabled'), null),
		on: () => {},
	};
} else {
	db = mysql.createPool({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		waitForConnections: true,
		connectionLimit: 10,
		queueLimit: 0,
	});

	db.on('error', (err) => {
		console.error('MySQL pool error:', err);
	});

	db.getConnection((err, connection) => {
		if (err) {
			console.error("❌ MySQL connection failed:", err);
		} else {
			dbReady = true;
			console.log("✅ Connected to MySQL database");
			connection.release();
		}
	});
}


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
	 REGISTER (unchanged behavior)
============================ */
app.post("/register", async (req, res) => {
	const { fullName, phone, department, year, email: rawEmail, password } = req.body;
	const email = (rawEmail || "").trim();

	if (!fullName || !email || !password) {
		return res.status(400).json({ message: "Missing required fields" });
	}

	try {
		const hashed = await bcrypt.hash(password, 10);

		const sql = `
			INSERT INTO alumni_users 
			(full_name, phone_number, department, year_of_passout, email, password, status, action) 
			VALUES (?, ?, ?, ?, ?, ?, 'PENDING', 'ACTIVE')
		`;
		db.query(sql, [fullName, phone, department, year, email, hashed], (err) => {
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
	 LOGIN - ✅ BLOCKS PENDING USERS
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

		// ✅ BLOCK LOGIN IF STATUS IS NOT APPROVED
		if (String(user.status).toUpperCase() !== "APPROVED") {
			return res.status(403).json({
				message: `Your account is ${String(user.status).toLowerCase()}. Please wait for admin approval.`,
				isApproved: false,
				status: user.status,
			});
		}

		// ✅ BLOCK LOGIN IF ACTION IS INACTIVE
		const userAction = String(user.action || "ACTIVE").toUpperCase();
		if (userAction === "INACTIVE") {
			return res.status(403).json({
				message: "Your account is currently inactive. Contact admin to activate.",
				isApproved: true,
				status: user.status,
				action: userAction,
			});
		}

		// ✅ LOGIN SUCCESSFUL FOR APPROVED + ACTIVE USERS
		return res.status(200).json({ 
			message: "User login successful", 
			role: "user", 
			userId: user.user_id, 
			email: user.email,
			department: user.department,
			dob: user.dob,
			year: user.year_of_passout,
			isApproved: true,
			status: user.status,
			action: userAction,
			fullName: user.full_name,
			profilePhoto: user.profile_photo || null,
		});
	});
});

/* ============================
	 ADMIN ROUTES
============================ */

// Public API: batch counts for alumni directory
app.get("/alumni/batch-counts", (req, res) => {
	if (!dbReady) {
		console.warn("DB not ready, returning default batch list");
		return res.json([]);
	}

	const sql = `
		SELECT year_of_passout AS year, COUNT(*) AS count
		FROM alumni_users
		WHERE status = 'APPROVED' AND action = 'ACTIVE'
		GROUP BY year_of_passout
	`;
	db.query(sql, (err, results) => {
		if (err) {
			console.error("Error fetching batch counts:", err);
			return res.status(500).json({ message: "Database error", error: err.message });
		}
		// results is array of { year, count }
		res.json(results);
	});
});

// Public API: list approved alumni with optional filters
app.get("/alumni", (req, res) => {
	const { year, role, department, name } = req.query;
	let sql = `
		SELECT user_id, full_name, email, department, year_of_passout,
			profile_photo, company_name, job_role, work_location
		FROM alumni_users
		WHERE status = 'APPROVED' AND action = 'ACTIVE'
	`;
	const params = [];
	if (year) {
		sql += " AND year_of_passout = ?";
		params.push(year);
	}
	if (role) {
		sql += " AND job_role = ?";
		params.push(role);
	}
	if (department) {
		sql += " AND department = ?";
		params.push(department);
	}
	if (name) {
		sql += " AND full_name LIKE ?";
		params.push(`%${name}%`);
	}

	db.query(sql, params, (err, results) => {
		if (err) {
			console.error("Error fetching alumni listing:", err);
			return res.status(500).json({ message: "Database error", error: err.message });
		}
		res.json(results);
	});
});

// fetch single alumni by id (used by AlumniDetails.jsx)
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
app.get("/admin/users", (req, res) => {
	// if database connection not ready, return an empty list instead of
	// failing – this makes development easier when the environment isn't
	// fully configured (e.g. no .env or MySQL server yet).
	if (!dbReady) {
		console.warn("DB not ready, returning empty user list");
		return res.json([]);
	}

	const sql = `
		SELECT user_id, full_name as name, phone_number,
				 department, year_of_passout, email, status, action
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

app.put("/admin/update-status", (req, res) => {
	const { email: rawEmail, status, action } = req.body || {};
	const email = (rawEmail || "").trim();

	console.log(`📥 PUT /admin/update-status received:`, { email, status, action, fullBody: req.body });

	if (!email) {
		return res.status(400).json({ message: "Missing email" });
	}

	if (!status && !action) {
		return res.status(400).json({ message: "Missing status or action" });
	}

	db.query("SELECT status, action FROM alumni_users WHERE email = ?", [email], (err, rows) => {
		if (err) {
			console.error("Error checking user:", err);
			return res.status(500).json({ message: "Database error", error: err.message });
		}

		if (!rows.length) {
			return res.status(404).json({ message: "User not found" });
		}

		const currentStatus = String(rows[0].status).toUpperCase();
		const currentAction = String(rows[0].action || "ACTIVE").toUpperCase();

		let updateFields = [];
		let updateValues = [];

		// update status logic
		if (status) {
			const upperStatus = String(status).toUpperCase();
			if (upperStatus === "APPROVED" && currentStatus === "PENDING") {
				updateFields.push("status = ?", "action = ?");
				updateValues.push("APPROVED", "ACTIVE");
			} else if (upperStatus === "REJECTED" && currentStatus === "PENDING") {
				updateFields.push("status = ?");
				updateValues.push("REJECTED");
			} else if (currentStatus === "APPROVED") {
				return res.status(400).json({ message: "Cannot change status once account is approved. Use action column to toggle Active/Inactive." });
			} else {
				updateFields.push("status = ?");
				updateValues.push(upperStatus);
			}
		}

		// update action logic
		if (action) {
			const upperAction = String(action).toUpperCase();
			if (currentStatus !== "APPROVED") {
				return res.status(400).json({ message: "Can only change action for APPROVED users" });
			}
			if (upperAction === "ACTIVE" || upperAction === "INACTIVE") {
				updateFields.push("action = ?");
				updateValues.push(upperAction);
			} else {
				return res.status(400).json({ message: "Invalid action. Use ACTIVE or INACTIVE" });
			}
		}

		if (updateFields.length === 0) {
			return res.status(400).json({ message: "No valid updates provided" });
		}

		updateValues.push(email);
		const updateSql = `UPDATE alumni_users SET ${updateFields.join(", ")} WHERE email = ?`;

		db.query(updateSql, updateValues, (err2) => {
			if (err2) {
				console.error("Error updating user:", err2);
				return res.status(500).json({ message: "Database error", error: err2.message });
			}
			return res.status(200).json({ message: "User updated successfully" });
		});
	});
});

/* ============================
	 GET APPROVED ALUMNI FOR PROFILE PAGE
============================ */
app.get("/admin/approved-alumni", (req, res) => {
	const sql = `
		SELECT user_id, full_name, email, year_of_passout, department, status
		FROM alumni_users
		WHERE status = 'APPROVED' AND action = 'ACTIVE'
		ORDER BY year_of_passout DESC, full_name ASC
	`;

	db.query(sql, (err, results) => {
		if (err) {
			console.error("Error fetching approved alumni:", err);
			return res.status(500).json({ message: "Database error", error: err.message });
		}

		// Group alumni by batch year and count
		const groupedByYear = {};
		results.forEach((alumni) => {
			const year = alumni.year_of_passout;
			if (!groupedByYear[year]) {
				groupedByYear[year] = {
					year: year,
					count: 0,
					alumni: [],
				};
			}
			groupedByYear[year].count++;
			groupedByYear[year].alumni.push({
				id: alumni.user_id,
				name: alumni.full_name,
				email: alumni.email,
				department: alumni.department,
			});
		});

		// Convert to sorted array
		const batches = Object.values(groupedByYear).sort((a, b) => b.year - a.year);

		return res.status(200).json({ 
			message: "Approved alumni retrieved successfully",
			batches: batches,
		});
	});
});

/* ============================
	 PROFILE SAVE (JSON)
	 - Accepts JSON `form` from frontend and updates user by email
	 - Returns clear DB error message when one occurs
============================ */
app.post("/profile/save", (req, res) => {
	const data = req.body || {};
	console.log("/profile/save called with:", data);

	const email = (data.email || "").trim();
	app.use("/uploads", express.static(uploadsDir));
	if (!email) return res.status(400).json({ message: "Email is required to save profile" });

	// if frontend accidentally sends a file object instead of a path, ignore it
	if (data.profilePhoto && typeof data.profilePhoto !== 'string') {
		console.warn("/profile/save received non-string profilePhoto, ignoring");
		data.profilePhoto = undefined;
	}

	const allowed = {
		full_name: data.fullName,
		phone_number: data.phone,
		date_of_birth: data.dob,
		linkedin_profile: data.linkedinProfile,
		current_address: data.currentAddress,
		status: data.status,
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
	};

	const keys = Object.keys(allowed).filter((k) => allowed[k] !== undefined && allowed[k] !== null && String(allowed[k]).length > 0);
	if (keys.length === 0) return res.status(400).json({ message: "No fields to update" });

	const setClause = keys.map((k) => `${k} = ?`).join(", ");
	const values = keys.map((k) => allowed[k]);
	values.push(email);

	const sql = `UPDATE alumni_users SET ${setClause} WHERE email = ?`;

	db.query(sql, values, (err, result) => {
		if (err) {
			console.error("Profile save error:", err);
			return res.status(500).json({ message: "Database error", error: err.message });
		}

		return res.status(200).json({ message: "Profile saved successfully" });
	});
});

/* ============================
	 PROFILE PHOTO UPLOAD
	 - Improved logging and returns `error: err.message` for debugging
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

/* ============================
	 GET PROFILE BY EMAIL - ✅ ENFORCES APPROVAL STATUS
============================ */
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

    const user = results[0];
    
    // ✅ CHECK APPROVAL STATUS BEFORE RETURNING PROFILE
    if (String(user.status).toUpperCase() !== "APPROVED") {
      return res.status(403).json({ 
        message: `Access denied. Account status: ${user.status}` 
      });
    }
    
    // ✅ RETURN PROFILE ONLY FOR APPROVED USERS
    const sql2 = "SELECT * FROM alumni_details WHERE email = ?";
    
    db.query(sql2, [email], (err, details) => {
      if (err) {
        console.error("Profile details fetch error:", err);
        return res.status(500).json({ message: "Database error", error: err.message });
      }
      
      const profileData = details.length ? details[0] : {};
      
      res.status(200).json({
        ...profileData,
        year: user.year_of_passout,
        status: user.status,
        isApproved: true,
      });
    });
  });
});

/* ============================
	 POSTS ROUTES
============================ */

/* CREATE NEW POST */
app.post("/posts/create", (req, res) => {
	const { userId, postDescription, postImagePath, imageUrl } = req.body;

	if (!userId) {
		return res.status(400).json({ message: "User ID is required" });
	}

	if (!postDescription && !postImagePath && !imageUrl) {
		return res.status(400).json({ message: "Post must contain text or image" });
	}

	const sql = `
		INSERT INTO posts (user_id, post_description, post_image_path, image_url) 
		VALUES (?, ?, ?, ?)
	`;

	db.query(sql, [userId, postDescription || null, postImagePath || null, imageUrl || null], (err, result) => {
		if (err) {
			console.error("❌ Error creating post:", err);
			return res.status(500).json({ message: "Database error", error: err.message });
		}

		res.status(201).json({
			message: "Post created successfully",
			postId: result.insertId,
			post: {
				post_id: result.insertId,
				user_id: userId,
				post_description: postDescription,
				post_image_path: postImagePath,
				image_url: imageUrl,
				created_at: new Date().toISOString(),
			},
		});
	});
});

/* GET ALL POSTS (with user info) */
app.get("/posts", (req, res) => {
	const sql = `
		SELECT 
			p.post_id,
			p.user_id,
			p.post_description,
			p.post_image_path,
			p.image_url,
			p.created_at,
			u.full_name as name,
			u.year_of_passout as year,
			u.profile_photo
		FROM posts p
		JOIN alumni_users u ON p.user_id = u.user_id
		ORDER BY p.created_at DESC
	`;

	db.query(sql, (err, results) => {
		if (err) {
			console.error("❌ Error fetching posts:", err);
			return res.status(500).json({ message: "Database error", error: err.message });
		}

		res.status(200).json(results);
	});
});

/* GET USER'S POSTS */
app.get("/posts/user/:userId", (req, res) => {
	const userId = req.params.userId;

	const sql = `
		SELECT 
			p.post_id,
			p.user_id,
			p.post_description,
			p.post_image_path,
			p.image_url,
			p.created_at,
			u.full_name as name,
			u.year_of_passout as year,
			u.profile_photo
		FROM posts p
		JOIN alumni_users u ON p.user_id = u.user_id
		WHERE p.user_id = ?
		ORDER BY p.created_at DESC
	`;

	db.query(sql, [userId], (err, results) => {
		if (err) {
			console.error("❌ Error fetching user posts:", err);
			return res.status(500).json({ message: "Database error", error: err.message });
		}

		res.status(200).json(results);
	});
});

/* DELETE A POST */
app.delete("/posts/:postId", (req, res) => {
	const postId = req.params.postId;
	const { userId } = req.body;

	if (!userId) {
		return res.status(400).json({ message: "User ID is required for authorization" });
	}

	// Verify that the post belongs to the user
	const verifySql = "SELECT user_id, post_image_path FROM posts WHERE post_id = ?";

	db.query(verifySql, [postId], (err, results) => {
		if (err) {
			console.error("❌ Error verifying post:", err);
			return res.status(500).json({ message: "Database error", error: err.message });
		}

		if (!results.length) {
			return res.status(404).json({ message: "Post not found" });
		}

		const post = results[0];

		// Check authorization
		if (post.user_id !== parseInt(userId)) {
			return res.status(403).json({ message: "You can only delete your own posts" });
		}

		// Delete post from database
		const deleteSql = "DELETE FROM posts WHERE post_id = ?";

		db.query(deleteSql, [postId], (err) => {
			if (err) {
				console.error("❌ Error deleting post:", err);
				return res.status(500).json({ message: "Database error", error: err.message });
			}

			// Optionally delete associated image file if it exists
			if (post.post_image_path) {
				const imagePath = path.join(uploadsDir, path.basename(post.post_image_path));
				fs.unlink(imagePath, (err) => {
					if (err) console.warn("⚠️ Could not delete image file:", err);
				});
			}

			res.status(200).json({ message: "Post deleted successfully" });
		});
	});
});

/* UPLOAD POST IMAGE */
app.post("/posts/upload-image", (req, res, next) => {
	upload.single("image")(req, res, (err) => {
		if (err) {
			console.error("❌ Upload middleware error:", err);
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

/* ============================
	 EVENTS ROUTES
============================ */

// Upload event invitation image
app.post("/events/upload-image", (req, res, next) => {
	upload.single("image")(req, res, (err) => {
		if (err) {
			console.error("❌ Event image upload middleware error:", err);
			return handleMulterErrors(err, req, res, next);
		}

		if (!req.file) {
			return res.status(400).json({ message: "No image file provided" });
		}

		const imagePath = `uploads/${req.file.filename}`;
		console.log("✅ Event image uploaded successfully:", imagePath);

		res.status(200).json({
			message: "Event image uploaded successfully",
			imagePath,
		});
	});
});

// Create a new event
app.post("/events", (req, res) => {
	let {
		event_name,
		event_description,
		event_date,
		event_time,
		event_format,
		venue,
		organizer_name,
		organizer_email,
		invitation_image,
		fee,
	} = req.body;

	// basic validation
	if (!event_name || !event_date) {
		return res.status(400).json({ message: "Event name and date are required" });
	}

	// Safety check: reject data URLs - images must be pre-uploaded via /events/upload-image
	if (typeof invitation_image === 'string' && invitation_image.startsWith('data:')) {
		console.warn('⚠️  Event creation rejected data URL image - must use /events/upload-image endpoint first');
		return res.status(400).json({ message: "Image must be uploaded via /events/upload-image endpoint before creating event" });
	}

	const sql = `
		INSERT INTO events (
			event_name,
			event_description,
			event_date,
			event_time,
			event_format,
			venue,
			organizer_name,
			organizer_email,
			invitation_image,
			fee
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`;

	db.query(
		sql,
		[
			event_name,
			event_description || null,
			event_date,
			event_time || null,
			event_format || null,
			venue || null,
			organizer_name || null,
			organizer_email || null,
			invitation_image || null,
			fee != null ? fee : null,
		],
		(err, result) => {
			if (err) {
				console.error("❌ Error creating event:", err);
				return res.status(500).json({ message: "Database error", error: err.message });
			}

			console.log("✅ Event created successfully with ID:", result.insertId);

			res.status(201).json({
				message: "Event created successfully",
				id: result.insertId,
				...req.body,
			});
		}
	);
});

// Fetch all events
app.get("/events", (req, res) => {
	const sql = `
		SELECT *
		FROM events
		ORDER BY event_date DESC, event_time DESC
	`;

	db.query(sql, (err, results) => {
		if (err) {
			console.error("❌ Error fetching events:", err);
			return res.status(500).json({ message: "Database error", error: err.message });
		}

		res.status(200).json(results);
	});
});

/* ============================
	 Start Server
============================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
});
