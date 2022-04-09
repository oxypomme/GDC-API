import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import dayjs from "../dayjs.js";

import db from "./index.js";
import { getIntStatus } from "../intstatus.js";

const fetchAllMissions = async () => {
	let page = 0;

	while (true) {
		page++;
		const { document: doc } = new JSDOM(
			await (await fetch(`https://grecedecanards.fr/GDCStats/${page}`)).text(),
			{
				url: `https://grecedecanards.fr/GDCStats/${page}`,
			}
		).window;
		const table = doc.querySelector("#page-wrapper table:first-of-type tbody");
		if (table) {
			// Reset previous data
			if (page === 1) {
				db.data.missions.data = [];
			}
			for (const row of table.children) {
				if (!row.children[5].innerHTML.startsWith("@")) {
					db.data.missions.data.push({
						id: +row.children[0].innerHTML,
						name: row.children[1].children[0].innerHTML,
						map: row.children[2].innerHTML,
						date: dayjs(row.children[3].innerHTML, "DD/MM/YYYY").hour(12),
						duration: +row.children[4].innerHTML,
						status: getIntStatus(row.children[5].innerHTML),
						players: +row.children[6].innerHTML,
						end_players: +row.children[7].innerHTML,
					});
				}
			}
			if (
				table.children[table.children.length - 1].children[0].innerHTML === "1"
			) {
				break;
			}
		}
	}

	db.data.missions.updated = dayjs();
	db.data.missions.expires = db.data.missions.updated.add(1, "h");
	await db.write();

	return db.data.missions;
};

export const getAllMissions = async () => {
	const { missions } = db.data;
	// If cache is still valid, no need to fetch
	if (!missions.updated || dayjs().isAfter(missions.expires)) {
		await fetchAllMissions();
	}
	return db.data.missions;
};

const fetchMission = async (id) => {
	const { document: doc } = new JSDOM(
		await (
			await fetch(`https://grecedecanards.fr/GDCStats/missions/${id}`)
		).text(),
		{
			url: `https://grecedecanards.fr/GDCStats/missions/${id}`,
		}
	).window;

	let players;
	let infos;

	const mission = doc.querySelector("#page-wrapper table:first-of-type tbody")
		.children[0];
	if (mission) {
		infos = {
			id: +id,
			name: mission.children[1].children[0].innerHTML,
			map: mission.children[2].innerHTML,
			date: dayjs(mission.children[3].innerHTML, "DD/MM/YYYY").hour(12),
			duration: +mission.children[4].innerHTML,
			status: getIntStatus(mission.children[5].innerHTML),
			players: +mission.children[6].innerHTML,
			end_players: +mission.children[7].innerHTML,
		};
	}

	const table = doc.querySelector("#page-wrapper table:last-of-type tbody");
	if (table) {
		players = [];
		for (const row of table.children) {
			const match = /(.*\/)(.*)/.exec(row.children[0].children[0].href);
			players.push({
				id: parseInt(match[match.length - 1]),
				name: row.children[0].children[0].innerHTML,
				role: row.children[1].innerHTML,
				status: row.children[2].innerHTML,
			});
		}
	}

	const res = {
		data: {
			infos,
			players,
		},
		updated: dayjs(),
		expires: dayjs().add(1, "s"),
	};
	db.data.details.missions[id] = res;
	await db.write();

	return res;
};

export const getMission = async (id) => {
	const mission = db.data.details.missions[id];
	// If cache is still valid, no need to fetch
	if (!mission || dayjs().isAfter(mission.expires)) {
		await fetchMission(id);
	}
	return db.data.details.missions[id];
};
