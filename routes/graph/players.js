import { Router } from "express";
import { readFileSync } from "fs";
import dayjs from "../../dayjs.js";

import { getPlayer } from "../../db/players.js";
import { labelStatus } from "../../intstatus.js";

const roles = JSON.parse(readFileSync("config/roles.json", "utf8"));

const router = Router();

const toLowerWOAccent = (str) =>
	str
		.toLowerCase()
		.trim()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");

/**
 * @api {get} /graph/players/:id Request Player Stats
 * @apiName GetPlayersStatsById
 * @apiGroup Players
 * @apiDescription Gets the prepared stats about the player. Usefull for graphs.
 *
 * @apiSuccess {JSONObject} result The player infos and missions
 * @apiSuccessExample Success Example
 * {
 *     "id": 292,
 *     "name": "OxyTom",
 *     "formation": "",
 *     "count_missions": 24,
 *     "first_mission": { SEE /api/missions },
 *     "last_mission": { SEE /api/missions },
 *     "total_player_status": {
 *         "Vivant": 9,
 *         "Mort": 14
 *     },
 *     "total_mission_status": {
 *         "SUCCES": 14,
 *         "ECHEC": 7,
 *         "PVP": 0
 *     },
 *     "total_player_mission_status": {
 *         "SUCCES_Vivant": 7,
 *         "SUCCES_Mort": 7,
 *         "ECHEC_Vivant": 2,
 *         "ECHEC_Mort": 5,
 *         "PVP_Vivant": 0,
 *         "PVP_Mort": 0
 *     },
 *     "roles": {
 *         "roles_count": {
 *             "Inconnu": 0
 *         },
 *         "roles_errors": [
 *             {
 *                 "mission": 1200,
 *                 "role": "Efreitor"
 *             }
 *         ]
 *     },
 *     "months": {
 *         "Mar 2021": 14,
 *         "Feb 2021": 9
 *     },
 *     "days": {
 *         "3": {
 *             "count": 5,
 *             "Vivant": 3,
 *             "Mort": 2,
 *             "Inconnu": 0,
 *             "SUCCES": 4,
 *             "ECHEC": 1,
 *             "PVP": 0
 *         }
 *     },
 *     "updated": "2021-03-27T22:09:45.170Z",
 *     "updated": "2021-03-27T23:09:45.170Z"
 * }
 */
router.get("/:id", async (req, res) => {
	const { id } = req.params;
	let player = {};
	try {
		player = await getPlayer(id);
	} catch (error) {
		return res.status(500).json({
			status: "error",
			url: req.originalUrl,
			error: error.message,
		});
	}

	// Gets totals
	const total_player_status = {};
	const total_mission_status = {};
	const total_player_mission_status = {};
	for (let j = 0; j <= 3; j++) {
		total_mission_status[labelStatus[j][1]] = player.missions.filter(
			(m) => m.mission_status === j
		).length;
		for (let i = 0; i < 3; i++) {
			total_player_status[labelStatus[i][0]] = player.missions.filter(
				(m) => m.player_status === i
			).length;
			total_player_mission_status[`${labelStatus[j][1]}_${labelStatus[i][0]}`] =
				player.missions.filter(
					(m) => m.player_status === i && m.mission_status === j
				).length;
		}
	}

	// Gets Roles + MonthStats
	const rolesErrors = new Array(0);
	const rolesCount = { Inconnu: player.missions.length };
	const months = {};
	const days = {};
	const streak = {
		mort: {
			max: 0,
			count: 0,
			current: false,
		},
		vivant: {
			max: 0,
			count: 0,
			current: false,
		},
	};

	// Using a copy of the array for side-effect reasons
	for (const miss of [...player.missions].reverse()) {
		{
			// Month
			const date = dayjs(miss.date);
			const dateKey = date.format("MMM YYYY");
			if (months[dateKey]) {
				months[dateKey]++;
			} else {
				months[dateKey] = 1;
			}
		}
		{
			// Day
			const rawdate = dayjs(miss.date).day();
			const date = rawdate == 0 ? 7 : rawdate; // Sunday is the last day of the week. Change my mind.
			if (days[date]) {
				days[date].count++;
				// Player Status
				for (let i = 0; i < 3; i++) {
					days[date][labelStatus[i][0]] +=
						miss.player_status + 1 === i + 1 ? 1 : 0;
				}
				// Mission Status
				for (let i = 0; i <= 3; i++) {
					days[date][labelStatus[i][1]] += miss.mission_status === i ? 1 : 0;
				}
			} else {
				days[date] = { count: 1 };
				// Player Status
				for (let i = 0; i < 3; i++) {
					days[date][labelStatus[i][0]] = miss.player_status === i ? 1 : 0;
				}
				// Mission Status
				for (let i = 0; i <= 3; i++) {
					days[date][labelStatus[i][1]] = miss.mission_status === i ? 1 : 0;
				}
			}
		}
		{
			// Roles
			let isMissionDone = false;
			for (let i = 0; i < Object.values(roles).length; i++) {
				const roleConfigKey = Object.keys(roles)[i];
				for (const roleConfigVal of Object.values(roles)[i].map(
					(roleConfigVal) => toLowerWOAccent(roleConfigVal)
				)) {
					if (toLowerWOAccent(miss.role).includes(roleConfigVal)) {
						isMissionDone = true;
						if (isNaN(rolesCount[roleConfigKey])) {
							rolesCount[roleConfigKey] = 1;
						} else {
							rolesCount[roleConfigKey]++;
						}
						rolesCount.Inconnu--;
						break;
					}
				}
				if (isMissionDone) {
					break;
				}
			}
			if (!isMissionDone) {
				rolesErrors.push({ mission: miss.id, role: miss.role });
			}
		}
		{
			// Streak
			if (miss.player_status === 1) {
				if (streak.vivant.current) {
					streak.vivant.count++;
				} else {
					streak.mort.current = false;
					streak.vivant.current = true;
					if (streak.vivant.count > streak.vivant.max) {
						streak.vivant.max = streak.vivant.count;
					}
					streak.vivant.count = 1;
				}
			} else if (miss.player_status === 2) {
				if (streak.mort.current) {
					streak.mort.count++;
				} else {
					streak.mort.current = true;
					streak.vivant.current = false;
					if (streak.mort.count > streak.mort.max) {
						streak.mort.max = streak.mort.count;
					}
					streak.mort.count = 1;
				}
			}
		}
	}

	res.status(200).json({
		...player.infos,
		first_mission: player.missions[player.missions.length - 1],
		last_mission: player.missions[0],
		total_player_status,
		total_mission_status,
		total_player_mission_status,
		streak,
		roles: {
			roles_count: rolesCount,
			roles_errors: rolesErrors,
		},
		months,
		days,
		updated: player.updated,
		expires: player.expires,
	});
});

export default router;
