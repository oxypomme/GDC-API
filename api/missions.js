const { app } = require("../app");
const { JSDOM } = require("jsdom");
const fetch = require("node-fetch");

const { getAllMissions, getMission } = require("../db/missions");

const { getIntStatus } = require("../intstatus");

/**
 * @api {get} /gdc/missions Request Missions Information
 * @apiName GetMissions
 * @apiGroup Missions
 * @apiDescription Gets the informations about missions
 *
 * @apiSuccess {JSONArray} result The missions infos
 * @apiSuccessExample Success Example
 * {
 *     "missions": [
 *         {
 *             "id": 1625,
 *             "name": "CPC-CO[16]-Shapurville-V4",
 *             "map": "Shapur",
 *             "date": "27/03/2021",
 *             "duration": "63",
 *             "status": 0,
 *             "players": 14,
 *             "end_players": 1
 *         },
 *         {
 *             "id": 1624,
 *             "name": "CPC-CO[07]-Un_froid_mordant-V1",
 *             "map": "Thirsk Winter",
 *             "date": "27/03/2021",
 *             "duration": "53",
 *             "status": 1,
 *             "players": 5,
 *             "end_players": 4
 *         }
 *     ],
 *     "updated": "2021-03-27T23:03:25.488Z"
 * }
 */
app.get("/missions", async (req, res) => {
	res.status(200).json(await getAllMissions());
});

/**
 * @api {get} /gdc/missions/:id Request Mission Information
 * @apiName GetMissionById
 * @apiGroup Missions
 * @apiDescription Gets the informations about the mission
 *
 * @apiSuccess {JSONObject} result The player infos and missions
 * @apiSuccessExample Success Example
 * {
 *     "infos": {
 *         "id": 1617,
 *         "name": "CPC-CO[19]-Matinee_brumeuse-V6",
 *         "map": "Podagorsk",
 *         "date": "20/03/2021",
 *         "duration": "62",
 *         "status": 0,
 *         "players": 15,
 *         "end_players": 6
 *     },
 *     "missions": [
 *         {
 *             "id": 40,
 *             "name": "Sardo",
 *             "role": "Officier (148 + 117)",
 *             "status": "Mort"
 *         },
 *         {
 *             "id": 271,
 *             "name": "Thétard",
 *             "role": "Infirmier",
 *             "status": "Mort"
 *         }
 *     ],
 *     "updated": "2021-03-27T23:03:25.488Z"
 * }
 */
app.get("/missions/:id", async (req, res) => {
	const { id } = req.params;
	res.status(200).json(await getMission(id));
});
