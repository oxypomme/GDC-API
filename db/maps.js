const { JSDOM } = require("jsdom");
const fetch = require('node-fetch');
const fs = require('fs');
const dayjs = require('dayjs');

const configMaps = require('../config/maps.json');

const fetchAllMaps = async () => {
    const { document: doc } = new JSDOM(await (await fetch(`https://grecedecanards.fr/GDCStats/maps`)).text(), {
        url: `https://grecedecanards.fr/GDCStats/maps`
    }).window;

    let maps;
    const table = doc.querySelector('#page-wrapper table:first-of-type tbody');
    if (table) {
        maps = [];
        for (let id = 1; id < table.children.length + 1; id++) {
            const row = table.children[id - 1];
            if (configMaps.includes(row.children[0].innerHTML))
                maps.push({
                    id,
                    name: row.children[0].innerHTML,
                    mission_count: parseInt(row.children[1].innerHTML),
                });
        }
    }

    fs.writeFileSync('db/data/maps.json', JSON.stringify({ maps, updated: new Date() }));
};

const getAllMaps = async () => {
    try {
        require('./data/maps.json');
    } catch (error) {
        await fetchAllMaps();
    }
    const mapsJSON = require('./data/maps.json');
    if (dayjs().isAfter(dayjs(mapsJSON.updated).add(1, 'h'))) {
        await fetchAllMaps();
    }
    return mapsJSON;
}

exports.getAllMaps = getAllMaps;