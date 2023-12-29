import { Router } from "express";
import { getAllMaps } from "../../db/maps.js";

const router = Router();

/**
 * @api {get} /api/maps Request Maps Information
 * @apiName GetMaps
 * @apiGroup Maps
 * @apiDescription Gets the informations about maps
 *
 * @apiSuccess {JSONArray} result The maps infos
 * @apiSuccessExample Success Example
 * {
 *     "count": 2,
 *     "data": [
 *         {
 *             "id": 1,
 *             "name": "Aliabad Region",
 *             "mission_count": 26
 *         },
 *         {
 *             "id": 2,
 *             "name": "Altis",
 *             "mission_count": 112
 *         }
 *     ],
 *     "updated": "2021-03-27T13:48:52.257Z",
 *     "expires": "2021-03-27T14:48:52.257Z"
 * }
 */
router.get("/", async (req, res) => {
	try {
		const maps = await getAllMaps();
		res.status(200).json({
			count: maps.data.length,
			...maps,
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			url: req.originalUrl,
			error: error.message,
		});
	}
});

export default router;
