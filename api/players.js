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
 * @api {get} /players/:id Request Player Information
 * @apiName GetPlayersById
 * @apiGroup Players
 * @apiDescription Gets the informations about the player
 * 
 * @apiSuccess {JSONObject} result The player infos and missions
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
app.get('/players/:id', async (req, res) => {
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

    res.status(200).json({
        infos,
        missions
    });
})
