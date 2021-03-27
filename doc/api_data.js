define({ "api": [
  {
    "type": "get",
    "url": "/gdc/maps",
    "title": "Request Maps Information",
    "name": "GetMaps",
    "group": "Maps",
    "description": "<p>Gets the informations about maps</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSONArray",
            "optional": false,
            "field": "result",
            "description": "<p>The maps infos</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Example",
          "content": "[\n    {\n        \"id\": 1,\n        \"name\": \"Aliabad Region\",\n        \"mission_count\": \"26\"\n    },\n    {\n        \"id\": 2,\n        \"name\": \"Altis\",\n        \"mission_count\": \"112\"\n    },\n    {\n        \"id\": 3,\n        \"name\": \"Bukovina\",\n        \"mission_count\": \"8\"\n    }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/maps.js",
    "groupTitle": "Maps"
  },
  {
    "type": "get",
    "url": "/gdc/missions",
    "title": "Request Missions Information",
    "name": "GetMissions",
    "group": "Missions",
    "description": "<p>Gets the informations about missions</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSONArray",
            "optional": false,
            "field": "result",
            "description": "<p>The missions infos</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Example",
          "content": "[\n    {\n        \"id\": 1624,\n        \"name\": \"CPC-CO[07]-Un_froid_mordant-V1\",\n        \"map\": \"Thirsk Winter\",\n        \"date\": \"27/03/2021\",\n        \"duration\": \"53\",\n        \"status\": 1,\n        \"players\": 5,\n        \"end_players\": 4\n    },\n    {\n        \"id\": 1623,\n        \"name\": \"CPC-CO[12]-places_gratuites-V2\",\n        \"map\": \"Isla Duala v3.9\",\n        \"date\": \"26/03/2021\",\n        \"duration\": \"66\",\n        \"status\": 2,\n        \"players\": 12,\n        \"end_players\": 0\n    }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/missions.js",
    "groupTitle": "Missions"
  },
  {
    "type": "get",
    "url": "/gdc/players/:id",
    "title": "Request Mission Information",
    "name": "GetMissionById",
    "group": "Players",
    "description": "<p>Gets the informations about the mission</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSONObject",
            "optional": false,
            "field": "result",
            "description": "<p>The player infos and missions</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Example",
          "content": "{\n    \"infos\": {\n        \"id\": 1617,\n        \"name\": \"CPC-CO[19]-Matinee_brumeuse-V6\",\n        \"map\": \"Podagorsk\",\n        \"date\": \"20/03/2021\",\n        \"duration\": \"62\",\n        \"status\": 0,\n        \"players\": 15,\n        \"end_players\": 6\n    },\n    \"missions\": [\n        {\n            \"id\": 40,\n            \"name\": \"Sardo\",\n            \"role\": \"Officier (148 + 117)\",\n            \"status\": \"Mort\"\n        },\n        {\n            \"id\": 271,\n            \"name\": \"Thétard\",\n            \"role\": \"Infirmier\",\n            \"status\": \"Mort\"\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/missions.js",
    "groupTitle": "Players"
  },
  {
    "type": "get",
    "url": "/gdc/players/name/:name",
    "title": "Request Player Id",
    "name": "GetPlayerIdByName",
    "group": "Players",
    "description": "<p>Gets the id of the player</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSONObject",
            "optional": false,
            "field": "result",
            "description": "<p>The player id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Example",
          "content": "{\n \"id\": 292\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Example",
          "content": "{\n \"id\": null\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/players.js",
    "groupTitle": "Players"
  },
  {
    "type": "get",
    "url": "/gdc/players/id/:id",
    "title": "Request Player Name",
    "name": "GetPlayerNameById",
    "group": "Players",
    "description": "<p>Gets the name of the player</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSONObject",
            "optional": false,
            "field": "result",
            "description": "<p>The player name</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Example",
          "content": "{\n \"name\": 292\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Example",
          "content": "{\n \"name\": null\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/players.js",
    "groupTitle": "Players"
  },
  {
    "type": "get",
    "url": "/gdc/players/:id",
    "title": "Request Players Information",
    "name": "GetPlayers",
    "group": "Players",
    "description": "<p>Gets the informations about players</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSONArray",
            "optional": false,
            "field": "result",
            "description": "<p>The players infos</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Example",
          "content": "[\n    {\n        \"id\": 1,\n        \"name\": \"Mystery\",\n        \"creation_date\": \"08/10/2016\",\n        \"formation\": \"La Vieille\",\n        \"count_missions\": 588,\n        \"last_mission\": \"19/03/2021\"\n    },\n    {\n        \"id\": 2,\n        \"name\": \"CP Dranac\",\n        \"creation_date\": \"08/10/2016\",\n        \"formation\": \"Canard\",\n        \"count_missions\": 486,\n        \"last_mission\": \"06/12/2020\"\n    },\n    {\n        \"id\": 3,\n        \"name\": \"Goyahka\",\n        \"creation_date\": \"08/10/2016\",\n        \"formation\": \"Canard\",\n        \"count_missions\": 351,\n        \"last_mission\": \"12/03/2021\"\n    }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/players.js",
    "groupTitle": "Players"
  },
  {
    "type": "get",
    "url": "/gdc/players/:id",
    "title": "Request Player Information",
    "name": "GetPlayersById",
    "group": "Players",
    "description": "<p>Gets the informations about the player</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSONObject",
            "optional": false,
            "field": "result",
            "description": "<p>The player infos and missions</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Example",
          "content": "{\n \"infos\": {\n        \"id\": 292,\n        \"name\": \"OxyTom\",\n        \"creation_date\": \"13/02/2021\",\n        \"formation\": \"\",\n        \"count_missions\": 19\n    },\n    \"missions\": [\n        {\n            \"id\": 1617,\n            \"name\": \"CPC-CO[19]-Matinee_brumeuse-V6\",\n            \"map\": \"Podagorsk\",\n            \"date\": \"20/03/2021\",\n            \"duration\": 62,\n            \"mission_status\": 0,\n            \"players\": 15,\n            \"end_players\": 6,\n            \"role\": \"Mitrailleur assistant\",\n            \"player_status\": 2\n        },\n        {\n            \"id\": 1615,\n            \"name\": \"CPC-CO[20]-Veine_de_Cobra-v1\",\n            \"map\": \"Desert\",\n            \"date\": \"19/03/2021\",\n            \"duration\": 68,\n            \"mission_status\": 1,\n            \"players\": 18,\n            \"end_players\": 17,\n            \"role\": \"Rifleman M136-AT\",\n            \"player_status\": 1\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/players.js",
    "groupTitle": "Players"
  }
] });
