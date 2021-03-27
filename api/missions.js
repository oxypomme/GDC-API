const { app } = require('../app');
const { JSDOM } = require("jsdom");
const fetch = require('node-fetch');

const { getAllMissions } = require('../db/missions');

const { getIntStatus } = require('../intstatus');

/**
 * @api {get} /gdc/missions Request Missions Information
 * @apiName GetMissions
 * @apiGroup Missions
 * @apiDescription Gets the informations about missions
 * 
 * @apiSuccess {JSONArray} result The missions infos
 * @apiSuccessExample Success Example
 * TODO
 */
app.get('/gdc/missions', async (req, res) => {
    res.status(200).json(await getAllMissions());
});

/**
 * @api {get} /gdc/players/:id Request Mission Information
 * @apiName GetMissionById
 * @apiGroup Players
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
 *     ]
 * }
 */
app.get('/gdc/missions/:id', async (req, res) => {
    const { id } = req.params;
    const { document: doc } = new JSDOM(await (await fetch(`https://grecedecanards.fr/GDCStats/missions/${id}`)).text(), {
        url: `https://grecedecanards.fr/GDCStats/missions/${id}`
    }).window;

    let missions;
    let infos;

    const mission = doc.querySelector("#page-wrapper table:first-of-type tbody").children[0];
    if (mission) {
        infos = {
            id: parseInt(id),
            name: mission.children[1].children[0].innerHTML,
            map: mission.children[2].innerHTML,
            date: mission.children[3].innerHTML,
            duration: mission.children[4].innerHTML,
            status: getIntStatus(mission.children[5].innerHTML),
            players: parseInt(mission.children[6].innerHTML),
            end_players: parseInt(mission.children[7].innerHTML)
        };
    }

    const table = doc.querySelector("#page-wrapper table:last-of-type tbody");
    if (table) {
        missions = [];
        for (const row of table.children) {
            const match = /(.*\/)(.*)/.exec(row.children[0].children[0].href);
            missions.push({
                id: parseInt(match[match.length - 1]),
                name: row.children[0].children[0].innerHTML,
                role: row.children[1].innerHTML,
                status: row.children[2].innerHTML
            });
        }
    }

    res.status(200).json({
        infos,
        missions
    });
})
