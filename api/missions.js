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
 * @api {get} /missions/:id Request Missions Information
 * @apiName GetMissions
 * @apiGroup Missions
 * @apiDescription Gets the informations about missions
 * 
 * @apiSuccess {JSONArray} result The missions infos

 */
app.get('/gdc/missions', async (req, res) => {
    const { document: doc } = new JSDOM(await (await fetch(`https://grecedecanards.fr/GDCStats/missions`)).text(), {
        url: `https://grecedecanards.fr/GDCStats/missions`
    }).window;

    let players;
    const table = doc.querySelector('#page-wrapper table:first-of-type tbody');
    if (table) {
        players = [];
        for (const row of table.children) {
            players.push({
                id: row.children[0].innerHTML,
                name: row.children[1].children[0].innerHTML,
                creation_date: row.children[2].innerHTML,
                formation: row.children[3].innerHTML,
                count_missions: row.children[4].innerHTML,
                last_mission: row.children[5].innerHTML
            });
        }
    }

    res.status(200).json(players);
});

/**
 * @api {get} /players/:id Request Player Information
 * @apiName GetPlayersById
 * @apiGroup Players
 * @apiDescription Gets the informations about the player
 * TODO
 * @apiSuccess {JSONObject} result The player infos and missions
 */
app.get('/gdc/missions/:id', async (req, res) => {
    const { id } = req.params;
    const { document: doc } = new JSDOM(await (await fetch(`https://grecedecanards.fr/GDCStats/missions/${id}`)).text(), {
        url: `https://grecedecanards.fr/GDCStats/missions/${id}`
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
