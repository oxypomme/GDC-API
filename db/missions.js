const { JSDOM } = require("jsdom");
const fetch = require('node-fetch');

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

exports.getAllMissions = getAllMissions;