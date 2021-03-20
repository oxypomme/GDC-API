const express = require('express');
const { app } = require('./express');

require('./api/players');

app.use('/', express.static(__dirname + '/doc'));