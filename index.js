const express = require('express');
const { app } = require('./app');

require('./api/players');

app.use('/gdc/', express.static(__dirname + '/doc'));