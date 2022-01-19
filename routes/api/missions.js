import { Router } from "express";
import { getAllMissions, getMission } from "../../db/missions.js";

const router = Router();

/**
 * @api {get} /api/missions Request Missions Information
 * @apiName GetMissions
 * @apiGroup Missions
 * @apiDescription Gets the informations about missions
 *
 * @apiSuccess {JSONArray} result The missions infos
 * @apiSuccessExample Success Example
 * {
 * 		 "count": 2,
 *     "data": [
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
 *     "updated": "2021-03-27T22:03:25.488Z",
 *     "expires": "2021-03-27T23:03:25.488Z"
 * }
 */
router.get("/", async (req, res) => {
	try {
		const missions = await getAllMissions();
		res.status(200).json({
			count: missions.data.length,
			...missions,
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			url: req.originalUrl,
			error: error.message,
		});
	}
});

/**
 * @api {get} /api/missions/:id Request Mission Information
 * @apiName GetMissionById
 * @apiGroup Missions
 * @apiDescription Gets the informations about the mission
 *
 * @apiSuccess {JSONObject} result The player infos and missions
 * @apiSuccessExample Success Example
 * {
 * 		 "data": {
 *     		"infos": {
 *     		    "id": 1617,
 *     		    "name": "CPC-CO[19]-Matinee_brumeuse-V6",
 *     		    "map": "Podagorsk",
 *     		    "date": "20/03/2021",
 *     		    "duration": "62",
 *     		    "status": 0,
 *     		    "players": 15,
 *     		    "end_players": 6
 *     		},
 *     		"players": [
 *     		    {
 *     		        "id": 40,
 *     		        "name": "Sardo",
 *     		        "role": "Officier (148 + 117)",
 *     		        "status": "Mort"
 *     		    },
 *     		    {
 *     		        "id": 271,
 *     		        "name": "Thétard",
 *     		        "role": "Infirmier",
 *     		        "status": "Mort"
 *     		    }
 *     		],
 * 		 }
 *     "updated": "2021-03-27T22:03:25.488Z",
 *     "expires": "2021-03-27T23:03:25.488Z"
 * }
 */
router.get("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		res.status(200).json(await getMission(id));
	} catch (error) {
		res.status(500).json({
			status: "error",
			url: req.originalUrl,
			error: error.message,
		});
	}
});

export default router;
