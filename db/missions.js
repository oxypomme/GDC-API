const { JSDOM } = require("jsdom");
const fetch = require('node-fetch');
const fs = require('fs');

const { getIntStatus } = require('../intstatus');

const fetchAllMissions = async () => {
    let page = 0;
    let missions = [];

    while (true) {
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
                }
            }
            if (table.children[table.children.length - 1].children[0].innerHTML === "1") {
                break;
            }
        }
    }
    fs.writeFileSync('db/data/missions.json', JSON.stringify({ missions, updated: new Date() }));
};

const getAllMissions = async () => {
    try {
        require('./data/missions.json');
    } catch (error) {
        await fetchAllMissions();
    }
    const missionsJSON = require('./data/missions.json');
    if (new Date(missionsJSON.updated).getHours() < new Date().getHours()) {
        await fetchAllMissions();
    }
    return missionsJSON;
}

const fetchMission = async (id) => {
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
    const res = {
        infos,
        players,
        updated: new Date()
    };
    try {
        const playerJSON = require('./data/mission.json');
        fs.writeFileSync('db/data/mission.json', JSON.stringify({
            ...playerJSON,
            [id]: res
        }));
    } catch (error) {
        fs.writeFileSync('db/data/mission.json', JSON.stringify({
            [id]: res
        }));
    }
    return res;
}

const getMission = async (id) => {
    let mission = {};
    try {
        const missionJSON = require('./data/mission.json');
        mission = missionJSON[id];
        if (!mission || new Date(mission.updated).getHours() < new Date().getHours()) {
            mission = await fetchMission(id);
        }
    } catch (error) {
        mission = await fetchMission(id);
    }
    return mission;
}

exports.getAllMissions = getAllMissions;
exports.getMission = getMission;