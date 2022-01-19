import { Router } from "express";
import { getAllPlayers, getPlayer } from "../../db/players.js";

const router = Router();

/**
 * @api {get} /api/players Request Players Information
 * @apiName GetPlayers
 * @apiGroup Players
 * @apiDescription Gets the informations about players
 *
 * @apiSuccess {JSONArray} result The players infos
 * @apiSuccessExample Success Example
 * {
 * 	  "count": 3,
 *    "data": [
 *        {
 *            "id": 1,
 *            "name": "Mystery",
 *            "creation_date": "08/10/2016",
 *            "formation": "La Vieille",
 *            "count_missions": 588,
 *            "last_mission": "19/03/2021"
 *        },
 *        {
 *            "id": 2,
 *            "name": "CP Dranac",
 *            "creation_date": "08/10/2016",
 *            "formation": "Canard",
 *            "count_missions": 486,
 *            "last_mission": "06/12/2020"
 *        },
 *        {
 *            "id": 3,
 *            "name": "Goyahka",
 *            "creation_date": "08/10/2016",
 *            "formation": "Canard",
 *            "count_missions": 351,
 *            "last_mission": "12/03/2021"
 *        }
 *    ],
 *    "updated": "2021-03-27T22:09:45.170Z",
 * 		"expires": "2021-03-27T23:09:45.170Z"
 * }
 */
router.get("/", async (req, res) => {
	try {
		const players = await getAllPlayers();
		res.status(200).json({
			count: players.data.length,
			...players,
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
 * @api {get} /api/players/:id Request Player Information
 * @apiName GetPlayersById
 * @apiGroup Players
 * @apiDescription Gets the informations about the player
 *
 * @apiSuccess {JSONObject} result The player infos and missions
 * @apiSuccessExample Success Example
 * {
 *   "infos": {
 *     "id": 292,
 *     "name": "OxyTom",
 *     "formation": "",
 *     "count_missions": 101,
 *     "first_mission": "13/02/2021"
 *   },
 *   "missions": [
 *     {
 *       "id": 1814,
 *       "name": "CPC-CO[12]-Un_ocean_bruyant-V2",
 *       "map": "Tanoa",
 *       "date": "2021-12-18T11:00:00.000Z",
 *       "duration": 74,
 *       "mission_status": 2,
 *       "players": 9,
 *       "end_players": 3,
 *       "role": "Chef d'équipe@SEALS",
 *       "player_status": 2
 *     },
 *     {
 *       "id": 1813,
 *       "name": "CPC-CO[08]-La_derniere_heure-V6",
 *       "map": "Zargabad",
 *       "date": "2021-12-18T11:00:00.000Z",
 *       "duration": 78,
 *       "mission_status": 1,
 *       "players": 8,
 *       "end_players": 4,
 *       "role": "Chef d'équipe (M136 / ACOG)",
 *       "player_status": 1
 *     }
 *   ],
 *   "updated": "2022-01-19T09:02:17.526Z",
 *   "expires": "2022-01-19T10:02:17.526Z"
 * }
 */
router.get("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		res.status(200).json(await getPlayer(id));
	} catch (error) {
		res.status(500).json({
			status: "error",
			url: req.originalUrl,
			error: error.message,
		});
	}
});

export default router;
