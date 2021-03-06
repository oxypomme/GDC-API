const { app } = require('../app');
const { getAllMaps } = require('../db/maps');

/**
 * @api {get} /gdc/maps Request Maps Information
 * @apiName GetMaps
 * @apiGroup Maps
 * @apiDescription Gets the informations about maps
 * 
 * @apiSuccess {JSONArray} result The maps infos
 * @apiSuccessExample Success Example
 * {
 *     "maps": [
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
 *     "updated": "2021-03-27T13:48:52.257Z"
 * }
 */
app.get('/gdc/maps', async (req, res) => res.status(200).json(await getAllMaps()));