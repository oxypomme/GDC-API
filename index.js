const express = require('express');
const { app } = require('./app');

require('./api/players');

app.use('/', express.static(__dirname + '/doc'));