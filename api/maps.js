const { app } = require('../app');
const { JSDOM } = require("jsdom");
const fetch = require('node-fetch');

const configMaps = require('../config/maps.json');

/**
 * @api {get} /gdc/maps Request Maps Information
 * @apiName GetMaps
 * @apiGroup Maps
 * @apiDescription Gets the informations about maps
 * 
 * @apiSuccess {JSONArray} result The maps infos
 * @apiSuccessExample Success Example
 * [
 *     {
 *         "id": 1,
 *         "name": "Aliabad Region",
 *         "mission_count": "26"
 *     },
 *     {
 *         "id": 2,
 *         "name": "Altis",
 *         "mission_count": "112"
 *     },
 *     {
 *         "id": 3,
 *         "name": "Bukovina",
 *         "mission_count": "8"
 *     }
 * ]
 */
app.get('/gdc/maps', async (req, res) => {
    const { document: doc } = new JSDOM(await (await fetch(`https://grecedecanards.fr/GDCStats/maps`)).text(), {
        url: `https://grecedecanards.fr/GDCStats/maps`
    }).window;

    let maps;
    const table = doc.querySelector('#page-wrapper table:first-of-type tbody');
    if (table) {
        maps = [];
        for (let id = 1; id < table.children.length + 1; id++) {
            const row = table.children[id - 1];
            if (configMaps.includes(row.children[0].innerHTML))
                maps.push({
                    id,
                    name: row.children[0].innerHTML,
                    mission_count: parseInt(row.children[1].innerHTML),
                });
        }
    }

    res.status(200).json(maps);
});