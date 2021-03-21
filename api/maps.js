const { app } = require('../app');
const { JSDOM } = require("jsdom");
const fetch = require('node-fetch');

/**
 * @api {get} /maps/:id Request Maps Information
 * @apiName GetMaps
 * @apiGroup Maps
 * @apiDescription Gets the informations about maps
 * 
 * @apiSuccess {JSONArray} result The maps infos

 */
app.get('/gdc/maps', async (req, res) => {
    const { document: doc } = new JSDOM(await (await fetch(`https://grecedecanards.fr/GDCStats/maps`)).text(), {
        url: `https://grecedecanards.fr/GDCStats/maps`
    }).window;

    let maps;
    const table = doc.querySelector('#page-wrapper table:first-of-type tbody');
    if (table) {
        maps = [];
        for (let id = 1; id < table.children.length; id++) {
            const row = table.children[id - 1];
            maps.push({
                id,
                name: row.children[0].innerHTML,
                mission_count: row.children[1].innerHTML,
            });
        }
    }

    res.status(200).json(maps);
});