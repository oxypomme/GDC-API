const { app } = require("../app");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
require("dayjs/locale/fr");
dayjs.extend(customParseFormat);
dayjs.locale("fr");

const roles = require("../config/roles");

const { getAllPlayers, getPlayer } = require("../db/players");
const { labelStatus } = require("../intstatus");

const toLowerWOAccent = (str) =>
	str
		.toLowerCase()
		.trim()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");

/**
 * @api {get} /gdc/players Request Players Information
 * @apiName GetPlayers
 * @apiGroup Players
 * @apiDescription Gets the informations about players
 *
 * @apiSuccess {JSONArray} result The players infos
 * @apiSuccessExample Success Example
 * {
 *      [
 *          {
 *              "id": 1,
 *              "name": "Mystery",
 *              "creation_date": "08/10/2016",
 *              "formation": "La Vieille",
 *              "count_missions": 588,
 *              "last_mission": "19/03/2021"
 *          },
 *          {
 *              "id": 2,
 *              "name": "CP Dranac",
 *              "creation_date": "08/10/2016",
 *              "formation": "Canard",
 *              "count_missions": 486,
 *              "last_mission": "06/12/2020"
 *          },
 *          {
 *              "id": 3,
 *              "name": "Goyahka",
 *              "creation_date": "08/10/2016",
 *              "formation": "Canard",
 *              "count_missions": 351,
 *              "last_mission": "12/03/2021"
 *          }
 *      ],
 *      "updated": "2021-03-27T22:09:45.170Z"
 * }
 */
app.get("/players", async (req, res) =>
	res.status(200).json(await getAllPlayers())
);

/**
 * @api {get} /gdc/players/:id Request Player Information
 * @apiName GetPlayersById
 * @apiGroup Players
 * @apiDescription Gets the informations about the player
 *
 * @apiSuccess {JSONObject} result The player infos and missions
 * @apiSuccessExample Success Example
 * {
 *     "id": 292,
 *     "name": "OxyTom",
 *     "creation_date": "13/02/2021",
 *     "formation": "",
 *     "count_missions": 24,
 *     "last_mission": { SEE /gdc/missions },
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
 *     "updated": "2021-03-27T22:09:45.170Z"
 * }
 */
app.get("/players/:id", async (req, res) => {
	const { id } = req.params;
	const player = await getPlayer(id);

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
	for (const miss of player.missions) {
		{
			// Month
			const date = dayjs(miss.date, "DD/MM/YYYY");
			const dateKey = date.format("MMM YYYY");
			if (months[dateKey]) {
				months[dateKey]++;
			} else {
				months[dateKey] = 1;
			}
		}
		{
			// Day
			const rawdate = dayjs(miss.date, "DD/MM/YYYY").day();
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
	}

	res.status(200).json({
		...player.infos,
		last_mission: player.missions[0],
		total_player_status,
		total_mission_status,
		total_player_mission_status,
		roles: {
			roles_count: rolesCount,
			roles_errors: rolesErrors,
		},
		months,
		days,
		updated: player.updated,
	});
});
