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

exports.getAllPlayers = getAllPlayers;