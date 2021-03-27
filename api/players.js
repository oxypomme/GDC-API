const { app } = require('../app');
const { JSDOM } = require("jsdom");
const fetch = require('node-fetch');

const { getIntStatus } = require('../intstatus');

/**
 * @api {get} /gdc/players/:id Request Players Information
 * @apiName GetPlayers
 * @apiGroup Players
 * @apiDescription Gets the informations about players
 * 
 * @apiSuccess {JSONArray} result The players infos
 * @apiSuccessExample Success Example
 * [
 *     {
 *         "id": 1,
 *         "name": "Mystery",
 *         "creation_date": "08/10/2016",
 *         "formation": "La Vieille",
 *         "count_missions": 588,
 *         "last_mission": "19/03/2021"
 *     },
 *     {
 *         "id": 2,
 *         "name": "CP Dranac",
 *         "creation_date": "08/10/2016",
 *         "formation": "Canard",
 *         "count_missions": 486,
 *         "last_mission": "06/12/2020"
 *     },
 *     {
 *         "id": 3,
 *         "name": "Goyahka",
 *         "creation_date": "08/10/2016",
 *         "formation": "Canard",
 *         "count_missions": 351,
 *         "last_mission": "12/03/2021"
 *     }
 * ]
 */
app.get('/gdc/players', async (req, res) => {
    const { document: doc } = new JSDOM(await (await fetch(`https://grecedecanards.fr/GDCStats/players`)).text(), {
        url: `https://grecedecanards.fr/GDCStats/players`
    }).window;

    let players;
    const table = doc.querySelector('#page-wrapper table:first-of-type tbody');
    if (table) {
        players = [];
        for (const row of table.children) {
            players.push({
                id: parseInt(row.children[0].innerHTML),
                name: row.children[1].children[0].innerHTML,
                creation_date: row.children[2].innerHTML,
                formation: row.children[3].innerHTML,
                count_missions: parseInt(row.children[4].innerHTML),
                last_mission: row.children[5].innerHTML
            });
        }
    }

    res.status(200).json(players);
});

/**
 * @api {get} /gdc/players/:id Request Player Information
 * @apiName GetPlayersById
 * @apiGroup Players
 * @apiDescription Gets the informations about the player
 * 
 * @apiSuccess {JSONObject} result The player infos and missions
 * @apiSuccessExample Success Example
 * {
 *  "infos": {
 *         "id": 292,
 *         "name": "OxyTom",
 *         "creation_date": "13/02/2021",
 *         "formation": "",
 *         "count_missions": 19
 *     },
 *     "missions": [
 *         {
 *             "id": 1617,
 *             "name": "CPC-CO[19]-Matinee_brumeuse-V6",
 *             "map": "Podagorsk",
 *             "date": "20/03/2021",
 *             "duration": 62,
 *             "mission_status": 0,
 *             "players": 15,
 *             "end_players": 6,
 *             "role": "Mitrailleur assistant",
 *             "player_status": 2
 *         },
 *         {
 *             "id": 1615,
 *             "name": "CPC-CO[20]-Veine_de_Cobra-v1",
 *             "map": "Desert",
 *             "date": "19/03/2021",
 *             "duration": 68,
 *             "mission_status": 1,
 *             "players": 18,
 *             "end_players": 17,
 *             "role": "Rifleman M136-AT",
 *             "player_status": 1
 *         }
 *     ]
 * }
 */
app.get('/gdc/players/:id', async (req, res) => {
    const { id } = req.params;
    const { document: doc } = new JSDOM(await (await fetch(`https://grecedecanards.fr/GDCStats/players/${id}`)).text(), {
        url: `https://grecedecanards.fr/GDCStats/players/${id}`
    }).window;

    let missions;
    let infos;

    const player = doc.querySelector("#page-wrapper table:first-of-type tbody").children[0];
    if (player) {
        infos = {
            id: parseInt(id),
            name: player.children[0].innerHTML,
            creation_date: player.children[1].innerHTML,
            formation: player.children[2].innerHTML,
            count_missions: parseInt(player.children[3].innerHTML)
        };
    }

    const table = doc.querySelector("#page-wrapper table:last-of-type tbody");
    if (table) {
        missions = [];
        for (const row of table.children) {
            if (row.children[4].innerHTML !== "@EFFACER") {
                const match = /(.*\/)(.*)/.exec(row.children[0].children[0].href);
                missions.push({
                    id: parseInt(match[match.length - 1]),
                    name: row.children[0].children[0].innerHTML,
                    map: row.children[1].innerHTML,
                    date: row.children[2].innerHTML,
                    duration: parseInt(row.children[3].innerHTML),
                    mission_status: getIntStatus(row.children[4].innerHTML),
                    players: parseInt(row.children[5].innerHTML),
                    end_players: parseInt(row.children[6].innerHTML),
                    role: row.children[7].innerHTML,
                    player_status: getIntStatus(row.children[8].innerHTML),
                });
            }
        }
    }

    res.status(200).json({
        infos,
        missions
    });
});

/**
 * @api {get} /gdc/players/name/:name Request Player Id
 * @apiName GetPlayerIdByName
 * @apiGroup Players
 * @apiDescription Gets the id of the player
 * 
 * @apiSuccess {JSONObject} result The player id
 * @apiSuccessExample Success Example
 * {
 *  "id": 292
 * }
 * @apiErrorExample Error Example
 * {
 *  "id": null
 * }
 */
app.get('/gdc/players/name/:name', async (req, res) => {
    const { name } = req.params;
    const { document: doc } = new JSDOM(await (await fetch(`https://grecedecanards.fr/GDCStats/players`)).text(), {
        url: `https://grecedecanards.fr/GDCStats/players`
    }).window;

    let id = null;

    const table = doc.querySelector('#page-wrapper table:first-of-type tbody');
    if (table) {
        for (const row of table.children) {
            if (row.children[1].children[0].innerHTML === name) {
                id = parseInt(row.children[0].innerHTML);
                break;
            }
        }
    }

    res.status(200).json({
        id
    })
});

/**
 * @api {get} /gdc/players/id/:id Request Player Name
 * @apiName GetPlayerNameById
 * @apiGroup Players
 * @apiDescription Gets the name of the player
 * 
 * @apiSuccess {JSONObject} result The player name
 * @apiSuccessExample Success Example
 * {
 *  "name": 292
 * }
 * @apiErrorExample Error Example
 * {
 *  "name": null
 * }
 */
app.get('/gdc/players/id/:id', async (req, res) => {
    const { id } = req.params;
    const { document: doc } = new JSDOM(await (await fetch(`https://grecedecanards.fr/GDCStats/players/${id}`)).text(), {
        url: `https://grecedecanards.fr/GDCStats/players/${id}`
    }).window;

    let name = null;

    const row = doc.querySelector('#page-wrapper table:first-of-type tbody').children[0];
    if (row) {
        name = row.children[0].innerHTML;
    }

    res.status(200).json({
        name
    })
});