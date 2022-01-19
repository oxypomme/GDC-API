import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import dayjs from "../dayjs.js";
import db from "./index.js";

const fetchAllMaps = async () => {
	const { document: doc } = new JSDOM(
		await (await fetch(`https://grecedecanards.fr/GDCStats/maps`)).text(),
		{
			url: `https://grecedecanards.fr/GDCStats/maps`,
		}
	).window;

	const table = doc.querySelector("#page-wrapper table:first-of-type tbody");
	if (table) {
		// Reset previous data
		db.data.maps.data = [];
		for (let id = 1; id < table.children.length + 1; id++) {
			const row = table.children[id - 1];
			db.data.maps.data.push({
				id,
				name: row.children[0].innerHTML,
				mission_count: parseInt(row.children[1].innerHTML),
			});
		}
	}

	db.data.maps.updated = dayjs();
	db.data.maps.expires = db.data.maps.updated.add(1, "h");
	await db.write();

	return db.data.maps;
};

export const getAllMaps = async () => {
	const { maps } = db.data;
	// If cache is still valid, no need to fetch
	if (!maps.updated || dayjs().isAfter(maps.expires)) {
		await fetchAllMaps();
	}
	return db.data.maps;
};
