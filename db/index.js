import { join, dirname } from "path";
import { JSONFilePreset } from "lowdb/node";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const defaultData = {
	maps: { data: [] },
	missions: { data: [] },
	players: { data: [] },
	details: {
		missions: {},
		players: {},
	},
}

// Use JSON file for storage
const file = join(__dirname, "data", "db.json");
const db = await JSONFilePreset(file, defaultData);

// Read data from JSON file, this will set db.data content
await db.read();

// Write db.data content to db.json
await db.write();

export default db;
