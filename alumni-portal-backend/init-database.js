import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

db.connect((err) => {
	if (err) {
		console.error("❌ MySQL connection failed:", err);
		process.exit(1);
	} else {
		console.log("✅ Connected to MySQL database");
	}
});

/* ============================
   Create alumni_users table if it doesn't exist
============================ */
const ensureAlumniUsersTable = () => {
	const createTableSql = `
		CREATE TABLE IF NOT EXISTS alumni_users (
			user_id INT AUTO_INCREMENT PRIMARY KEY,
			full_name VARCHAR(255),
			email VARCHAR(255) UNIQUE NOT NULL,
			password VARCHAR(255) NOT NULL,
			phone_number VARCHAR(20),
			department VARCHAR(100),
			dob DATE,
			year_of_passout INT,
			status VARCHAR(50) DEFAULT 'PENDING',
			profile_photo VARCHAR(255),
			linkedin_profile VARCHAR(500),
			current_address TEXT,
			company_name VARCHAR(255),
			job_role VARCHAR(255),
			work_location VARCHAR(255),
			study_level VARCHAR(100),
			study_level_other VARCHAR(255),
			course_name VARCHAR(255),
			institution VARCHAR(255),
			institution_location VARCHAR(255),
			other_text TEXT,
			prefer_not_to_say BOOLEAN DEFAULT FALSE,
			achievements TEXT,
			profile_status VARCHAR(50),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			INDEX (email),
			INDEX (status),
			INDEX (year_of_passout)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	`;

	db.query(createTableSql, (err) => {
		if (err) {
			console.error("❌ Error creating alumni_users table:", err);
		} else {
			console.log("✅ alumni_users table ready");
		}
		checkAndAddMissingColumns();
	});
};

/* ============================
   Add missing columns if they don't exist
============================ */
const checkAndAddMissingColumns = () => {
	const columnsToAdd = [
		{ name: 'profile_photo', definition: 'VARCHAR(255) DEFAULT NULL' },
		{ name: 'linkedin_profile', definition: 'VARCHAR(500) DEFAULT NULL' },
		{ name: 'current_address', definition: 'TEXT DEFAULT NULL' },
		{ name: 'company_name', definition: 'VARCHAR(255) DEFAULT NULL' },
		{ name: 'job_role', definition: 'VARCHAR(255) DEFAULT NULL' },
		{ name: 'work_location', definition: 'VARCHAR(255) DEFAULT NULL' },
		{ name: 'study_level', definition: 'VARCHAR(100) DEFAULT NULL' },
		{ name: 'study_level_other', definition: 'VARCHAR(255) DEFAULT NULL' },
		{ name: 'course_name', definition: 'VARCHAR(255) DEFAULT NULL' },
		{ name: 'institution', definition: 'VARCHAR(255) DEFAULT NULL' },
		{ name: 'institution_location', definition: 'VARCHAR(255) DEFAULT NULL' },
		{ name: 'other_text', definition: 'TEXT DEFAULT NULL' },
		{ name: 'prefer_not_to_say', definition: 'BOOLEAN DEFAULT FALSE' },
		{ name: 'achievements', definition: 'TEXT DEFAULT NULL' },
		{ name: 'profile_status', definition: 'VARCHAR(50) DEFAULT NULL' },
	];

	let columnsAdded = 0;
	const addNextColumn = (index) => {
		if (index >= columnsToAdd.length) {
			console.log(`✅ All ${columnsAdded} missing column(s) processed`);
			ensureEventsTable();
			return;
		}

		const column = columnsToAdd[index];
		const checkSql = `
			SELECT COLUMN_NAME 
			FROM INFORMATION_SCHEMA.COLUMNS 
			WHERE TABLE_NAME = 'alumni_users' 
			AND COLUMN_NAME = '${column.name}'
			AND TABLE_SCHEMA = DATABASE()
		`;

		db.query(checkSql, (err, results) => {
			if (err) {
				console.error(`❌ Error checking column ${column.name}:`, err);
				addNextColumn(index + 1);
				return;
			}

			if (results.length === 0) {
				console.log(`📝 Adding ${column.name} column...`);
				const addSql = `ALTER TABLE alumni_users ADD COLUMN ${column.name} ${column.definition}`;

				db.query(addSql, (err) => {
					if (err) {
						console.error(`❌ Error adding ${column.name}:`, err);
					} else {
						console.log(`✅ ${column.name} column added successfully`);
						columnsAdded++;
					}
					addNextColumn(index + 1);
				});
			} else {
				console.log(`✅ ${column.name} column already exists`);
				addNextColumn(index + 1);
			}
		});
	};

	addNextColumn(0);
};

/* ============================
   Create events table if it doesn't exist
============================ */
const ensureEventsTable = () => {
	const createEventsSql = `
		CREATE TABLE IF NOT EXISTS events (
		  id INT AUTO_INCREMENT PRIMARY KEY,
		  event_name VARCHAR(255) NOT NULL,
		  event_description TEXT NOT NULL,
		  event_date DATE NOT NULL,
		  event_time TIME NOT NULL,
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

	db.query(createEventsSql, (err) => {
		if (err) {
			console.error("❌ Error ensuring events table:", err);
		} else {
			console.log("✅ events table ready");
			// make sure column exists in case table existed from before feature
			checkEventColumnExists('invitation_image', 'TEXT');
		}
		db.end();
	});
};

// helper to add missing column to events table
const checkEventColumnExists = (colName, definition) => {
	const checkSql = `
		SELECT COLUMN_NAME
		FROM INFORMATION_SCHEMA.COLUMNS
		WHERE TABLE_NAME = 'events'
		AND COLUMN_NAME = ?
		AND TABLE_SCHEMA = DATABASE()
	`;
	db.query(checkSql, [colName], (err, results) => {
		if (err) {
			console.error(`❌ Error checking events column ${colName}:`, err);
			return;
		}
		if (results.length === 0) {
			console.log(`📝 Adding events.${colName} column...`);
			const alterSql = `ALTER TABLE events ADD COLUMN ${colName} ${definition}`;
			db.query(alterSql, (err2) => {
				if (err2) {
					console.error(`❌ Error adding events.${colName}:`, err2);
				} else {
					console.log(`✅ events.${colName} column added`);
				}
			});
		} else {
			console.log(`✅ events.${colName} column already exists`);
		}
	});
};

// Start the initialization
ensureAlumniUsersTable();
