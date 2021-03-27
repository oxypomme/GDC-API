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
          "content": "{\n    \"maps\": [\n        {\n            \"id\": 1,\n            \"name\": \"Aliabad Region\",\n            \"mission_count\": 26\n        },\n        {\n            \"id\": 2,\n            \"name\": \"Altis\",\n            \"mission_count\": 112\n        }\n    ],\n    \"updated\": \"2021-03-27T13:48:52.257Z\"\n}",
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
    "url": "/gdc/missions/:id",
    "title": "Request Mission Information",
    "name": "GetMissionById",
    "group": "Missions",
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
          "content": "{\n    \"infos\": {\n        \"id\": 1617,\n        \"name\": \"CPC-CO[19]-Matinee_brumeuse-V6\",\n        \"map\": \"Podagorsk\",\n        \"date\": \"20/03/2021\",\n        \"duration\": \"62\",\n        \"status\": 0,\n        \"players\": 15,\n        \"end_players\": 6\n    },\n    \"missions\": [\n        {\n            \"id\": 40,\n            \"name\": \"Sardo\",\n            \"role\": \"Officier (148 + 117)\",\n            \"status\": \"Mort\"\n        },\n        {\n            \"id\": 271,\n            \"name\": \"Thétard\",\n            \"role\": \"Infirmier\",\n            \"status\": \"Mort\"\n        }\n    ],\n    \"updated\": \"2021-03-27T23:03:25.488Z\"\n}",
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
          "content": "{\n    \"missions\": [\n        {\n            \"id\": 1625,\n            \"name\": \"CPC-CO[16]-Shapurville-V4\",\n            \"map\": \"Shapur\",\n            \"date\": \"27/03/2021\",\n            \"duration\": \"63\",\n            \"status\": 0,\n            \"players\": 14,\n            \"end_players\": 1\n        },\n        {\n            \"id\": 1624,\n            \"name\": \"CPC-CO[07]-Un_froid_mordant-V1\",\n            \"map\": \"Thirsk Winter\",\n            \"date\": \"27/03/2021\",\n            \"duration\": \"53\",\n            \"status\": 1,\n            \"players\": 5,\n            \"end_players\": 4\n        }\n    ],\n    \"updated\": \"2021-03-27T23:03:25.488Z\"\n}",
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
          "content": "{\n    \"id\": 292,\n    \"name\": \"OxyTom\",\n    \"creation_date\": \"13/02/2021\",\n    \"formation\": \"\",\n    \"count_missions\": 24,\n    \"last_mission\": { SEE /gdc/missions },\n    \"total_player_status\": {\n        \"Vivant\": 9,\n        \"Mort\": 14\n    },\n    \"total_mission_status\": {\n        \"SUCCES\": 14,\n        \"ECHEC\": 7,\n        \"PVP\": 0\n    },\n    \"total_player_mission_status\": {\n        \"SUCCES_Vivant\": 7,\n        \"SUCCES_Mort\": 7,\n        \"ECHEC_Vivant\": 2,\n        \"ECHEC_Mort\": 5,\n        \"PVP_Vivant\": 0,\n        \"PVP_Mort\": 0\n    },\n    \"roles\": {\n        \"roles_count\": {\n            \"Inconnu\": 0\n        },\n        \"roles_errors\": [\n            {\n                \"mission\": 1200,\n                \"role\": \"Efreitor\"\n            }\n        ]\n    },\n    \"months\": {\n        \"Mar 2021\": 14,\n        \"Feb 2021\": 9\n    },\n    \"days\": {\n        \"3\": {\n            \"count\": 5,\n            \"Vivant\": 4,\n            \"Mort\": 5,\n            \"Inconnu\": 4,\n            \"SUCCES\": 4,\n            \"ECHEC\": 5,\n            \"PVP\": 4\n        }\n    },\n    \"updated\": \"2021-03-27T22:09:45.170Z\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/players.js",
    "groupTitle": "Players"
  }
] });
