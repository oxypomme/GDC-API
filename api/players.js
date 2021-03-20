const { app } = require('../app');
const { JSDOM } = require("jsdom");
const fetch = require('node-fetch');

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
 * @api {get} /
 */
app.get('/players/:id', async (req, res) => {
    const { id } = req.params;
    const table = new JSDOM(await (await fetch(`https://grecedecanards.fr/GDCStats/players/${id}`)).text(), {
        url: `https://grecedecanards.fr/GDCStats/players/${id}`
    }).window.document.querySelector("#page-wrapper table:last-of-type tbody");
    const missions = [];
    if (table)
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

    res.status(200).json(missions);
})
