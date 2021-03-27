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
 * TODO
 */
app.get('/gdc/maps', async (req, res) => res.status(200).json(await getAllMaps()));