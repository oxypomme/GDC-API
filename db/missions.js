const { app } = require('../app');
const { JSDOM } = require("jsdom");
const fetch = require('node-fetch');

const { getIntStatus } = require('../intstatus');

/**
 * @api {get} /gdc/missions Request Missions Information
 * @apiName GetMissions
 * @apiGroup Missions
 * @apiDescription Gets the informations about missions
 * 
 * @apiSuccess {JSONArray} result The missions infos
 * @apiSuccessExample Success Example
 * [
 *     {
 *         "id": 1624,
 *         "name": "CPC-CO[07]-Un_froid_mordant-V1",
 *         "map": "Thirsk Winter",
 *         "date": "27/03/2021",
 *         "duration": "53",
 *         "status": 1,
 *         "players": 5,
 *         "end_players": 4
 *     },
 *     {
 *         "id": 1623,
 *         "name": "CPC-CO[12]-places_gratuites-V2",
 *         "map": "Isla Duala v3.9",
 *         "date": "26/03/2021",
 *         "duration": "66",
 *         "status": 2,
 *         "players": 12,
 *         "end_players": 0
 *     }
 * ]
 */
app.get('/gdc/missions', async (req, res) => {
    const { max } = req.query;
    let fetchOtherPages = true;
    let page = 0;
    let missions = [];

    while (fetchOtherPages) {
        page++;
        const { document: doc } = new JSDOM(await (await fetch(`https://grecedecanards.fr/GDCStats/${page}`)).text(), {
            url: `https://grecedecanards.fr/GDCStats/${page}`
        }).window;
        const table = doc.querySelector('#page-wrapper table:first-of-type tbody');
        if (table) {
            for (const row of table.children) {
                if (row.children[5].innerHTML !== "@EFFACER") {
                    missions.push({
                        id: parseInt(row.children[0].innerHTML),
                        name: row.children[1].children[0].innerHTML,
                        map: row.children[2].innerHTML,
                        date: row.children[3].innerHTML,
                        duration: row.children[4].innerHTML,
                        status: getIntStatus(row.children[5].innerHTML),
                        players: parseInt(row.children[6].innerHTML),
                        end_players: parseInt(row.children[7].innerHTML)
                    });
                    if (missions.length >= max) {
                        fetchOtherPages = false;
                        break;
                    }
                }
            }
            if (table.children[table.children.length - 1].children[0].innerHTML === "1") {
                break;
            }
        }
    }

    res.status(200).json(missions);
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

    let players;
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
        players = [];
        for (const row of table.children) {
            const match = /(.*\/)(.*)/.exec(row.children[0].children[0].href);
            players.push({
                id: parseInt(match[match.length - 1]),
                name: row.children[0].children[0].innerHTML,
                role: row.children[1].innerHTML,
                status: row.children[2].innerHTML
            });
        }
    }

    res.status(200).json({
        infos,
        missions: players
    });
})