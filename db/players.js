const { app } = require('../app');
const { JSDOM } = require("jsdom");
const fetch = require('node-fetch');
const fs = require('fs');

const { getIntStatus } = require('../intstatus');

const fetchAllPlayers = async () => {
    const { document: doc } = new JSDOM(await (await fetch(`https://grecedecanards.fr/GDCStats/players`)).text(), {
        url: `https://grecedecanards.fr/GDCStats/players`
    }).window;

    const players = [];
    const table = doc.querySelector('#page-wrapper table:first-of-type tbody');
    if (table) {
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
    fs.writeFileSync('db/data/players.json', JSON.stringify({ players, updated: new Date() }));
};

const getAllPlayers = async () => {
    try {
        require('./data/players.json');
    } catch (error) {
        await fetchAllPlayers();
    }
    const playersJSON = require('./data/players.json');
    if (new Date(playersJSON.updated).getHours() < new Date().getHours()) {
        await fetchAllPlayers();
    }
    return playersJSON;
}

/*
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
*/

exports.getAllPlayers = getAllPlayers;