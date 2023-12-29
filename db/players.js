import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import fs from "fs";
import dayjs from "../dayjs.js";

import db from "./index.js";
import { getIntStatus } from "../intstatus.js";

const fetchAllPlayers = async () => {
	const { document: doc } = new JSDOM(
		await (await fetch(`https://grecedecanards.fr/GDCStats/players`)).text(),
		{
			url: `https://grecedecanards.fr/GDCStats/players`,
		}
	).window;

	const table = doc.querySelector("#page-wrapper table:first-of-type tbody");
	if (table) {
		// Reset previous data
		db.data.players.data = [];
		for (const row of table.children) {
			db.data.players.data.push({
				id: +row.children[0].innerHTML,
				name: row.children[1].children[0].innerHTML,
				formation: row.children[3].innerHTML,
				count_missions: +row.children[4].innerHTML,
				first_mission: dayjs(row.children[2].innerHTML, "DD/MM/YYYY").hour(12),
				last_mission: dayjs(row.children[5].innerHTML, "DD/MM/YYYY").hour(12),
			});
		}
	}

	db.data.players.updated = dayjs();
	db.data.players.expires = db.data.players.updated.add(1, "h");
	await db.write();

	return db.data.players;
};

export const getAllPlayers = async () => {
	const { players } = db.data;
	// If cache is still valid, no need to fetch
	if (!players.updated || dayjs().isAfter(players.expires)) {
		await fetchAllPlayers();
	}
	return db.data.players;
};

const fetchPlayer = async (id) => {
	const { document: doc } = new JSDOM(
		await (
			await fetch(`https://grecedecanards.fr/GDCStats/players/${id}`)
		).text(),
		{
			url: `https://grecedecanards.fr/GDCStats/players/${id}`,
		}
	).window;

	let missions;
	let infos;

	const player = doc.querySelector("#page-wrapper table:first-of-type tbody")
		.children[0];
	if (player) {
		infos = {
			id: +id,
			name: player.children[0].innerHTML,
			formation: player.children[2].innerHTML,
			count_missions: +player.children[3].innerHTML,
			first_mission: player.children[1].innerHTML,
		};
	}

	const table = doc.querySelector("#page-wrapper table:last-of-type tbody");
	if (table) {
		missions = [];
		for (const row of table.children) {
			if (!row.children[4].innerHTML.includes("EFFACER")) {
				const match = /(.*\/)(.*)/.exec(row.children[0].children[0].href);
				missions.push({
					id: +match[match.length - 1],
					name: row.children[0].children[0].innerHTML,
					map: row.children[1].innerHTML,
					date: dayjs(row.children[2].innerHTML, "DD/MM/YYYY").hour(12),
					duration: +row.children[3].innerHTML,
					mission_status: getIntStatus(row.children[4].innerHTML),
					players: +row.children[5].innerHTML,
					end_players: +row.children[6].innerHTML,
					role: row.children[7].innerHTML,
					player_status: getIntStatus(row.children[8].innerHTML),
				});
			}
		}
	}
	const res = {
		infos,
		missions,
		updated: dayjs(),
		expires: dayjs().add(1, "h"),
	};
	db.data.details.players[id] = res;
	await db.write();

	return res;
};

export const getPlayer = async (id) => {
	// If param is not an id, search for name
	if (!parseInt(id)) {
		const p = (await getAllPlayers()).data.find((p) => p.name === id);
		if (!p) {
			throw "No player with given name found";
		}
		id = p.id.toString();
	}

	const player = db.data.details.players[id];
	// If cache is still valid, no need to fetch
	if (!player || dayjs().isAfter(player.expires)) {
		await fetchPlayer(id);
	}
	return db.data.details.players[id];
};
