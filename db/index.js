import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use JSON file for storage
const file = join(__dirname, "data", "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

// Read data from JSON file, this will set db.data content
await db.read();

// If file.json doesn't exist, db.data will be null
// Set default data
db.data = db.data || {
	maps: { data: [] },
	missions: { data: [] },
	players: { data: [] },
	details: {
		missions: {},
		players: {},
	},
};

// Write db.data content to db.json
await db.write();

export default db;
