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
    if (dayjs().isAfter(dayjs(playersJSON.updated).add(1, "h"))) {
        await fetchAllPlayers();
    }
    return playersJSON;
}

const fetchPlayer = async (id) => {
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
            if (!row.children[4].innerHTML.contains("EFFACER")) {
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
    const res = {
        infos,
        missions,
        updated: new Date()
    };
    try {
        const playerJSON = require('./data/player.json');
        fs.writeFileSync('db/data/player.json', JSON.stringify({
            ...playerJSON,
            [id]: res
        }));
    } catch (error) {
        fs.writeFileSync('db/data/player.json', JSON.stringify({
            [id]: res
        }));
    }
    return res;
}

const getPlayer = async (id) => {
    if (!parseInt(id)) {
        id = (await getAllPlayers()).players.find((p) => p.name === id).id.toString();
    }
    let player = {};
    try {
        const playerJSON = require('./data/player.json');
        player = playerJSON[id];
        if (!player || dayjs().isAfter(dayjs(player.updated).add(1, 'h'))) {
            player = await fetchPlayer(id);
        }
    } catch (error) {
        player = await fetchPlayer(id);
    }
    return player;
}

exports.getAllPlayers = getAllPlayers;
exports.getPlayer = getPlayer;