const express = require('express');
const { app } = require('./app');

require('./api/players');
require('./api/missions');
require('./api/maps');

app.use('/gdc/', express.static(__dirname + '/doc'));