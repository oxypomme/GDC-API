const express = require("express");
const { app } = require("./app");

require("./api/players");
require("./api/missions");
require("./api/maps");

app.use("/", express.static(__dirname + "/doc"));
