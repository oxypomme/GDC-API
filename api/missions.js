const { app } = require('../app');
const { JSDOM } = require("jsdom");
const fetch = require('node-fetch');

/**
 * Convert a string status to a somewhat exploitable number
 * @param {string} status The string status extracted from DOM
 * @returns {number} The status' number
 */
const getIntStatus = (status) => {
    switch (status) {
        case "Vivant":
        case "SUCCES":
            return 1;
        case "Mort":
        case "ECHEC":
            return 2;
        default:
            return 0;
    }
}

/**
 * @api {get} /gdc/missions/:id Request Missions Information
 * @apiName GetMissions
 * @apiGroup Missions
 * @apiDescription Gets the informations about missions
 * 
 * @apiSuccess {JSONArray} result The missions infos
 * @apiSuccessExample Success Example
 * [
 *     {
 *         "id": "1617",
 *         "name": "CPC-CO[19]-Matinee_brumeuse-V6",
 *         "creation_date": "Podagorsk",
 *         "formation": "20/03/2021",
 *         "count_missions": "62",
 *         "last_mission": "Inconnu"
 *     },
 *     {
 *         "id": "1616",
 *         "name": "CPC-CO[04]-Piece_de_8-v2",
 *         "creation_date": "Stratis",
 *         "formation": "20/03/2021",
 *         "count_missions": "14",
 *         "last_mission": "ECHEC"
 *     },
 *     {
 *         "id": "1615",
 *         "name": "CPC-CO[20]-Veine_de_Cobra-v1",
 *         "creation_date": "Desert",
 *         "formation": "19/03/2021",
 *         "count_missions": "68",
 *         "last_mission": "SUCCES"
 *     }
 * ]
 */
app.get('/gdc/missions', async (req, res) => {
    const { max } = req.query;
    let fetchOtherPages = true;
    let page = 0;
    let players = [];

    while (fetchOtherPages) {
        page++;
        const { document: doc } = new JSDOM(await (await fetch(`https://grecedecanards.fr/GDCStats/${page}`)).text(), {
            url: `https://grecedecanards.fr/GDCStats${page}`
        }).window;
        const table = doc.querySelector('#page-wrapper table:first-of-type tbody');
        if (table) {
            for (const row of table.children) {
                players.push({
                    id: row.children[0].innerHTML,
                    name: row.children[1].children[0].innerHTML,
                    creation_date: row.children[2].innerHTML,
                    formation: row.children[3].innerHTML,
                    count_missions: row.children[4].innerHTML,
                    last_mission: row.children[5].innerHTML
                });
                if (players.length >= max) {
                    fetchOtherPages = false;
                    break;
                }
            }
            if (table.children[table.children.length - 1].children[0].innerHTML === "1") {
                break;
            }
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
