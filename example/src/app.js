"use strict";

let express = require('express');
let app = express();
let http = require('http').Server(app);

app.use(express.static('./public/'));
app.use(express.static('./node_modules/'));
app.get('/', function (req, res) {
    res.sendfile("public/index.html");
});

/**
 * Server itself
 * @type {http.Server}
 */
let server = app.listen(8090, function () {
    //print few information about the server
    let host = server.address().address;
    let port = server.address().port;
    console.log("Server running and listening @ " + host + ":" + port);
});

/** list of plugins to be loaded */
let pluginsList = [
    {
        "name": "drinker",
        "mainFile": "drinker.component.js",
        "params": {
            "drinker": {
                "name": "Gwen",
                "quantity": 8,
                "email": "gwennael.buchet@gmail.com"
            },
            "platform": {
                "name": "AWS",
                "quantity": 8
            }
        },
    }
];

/**
 * Get a list of JSON for all registered plugins
 * @path /pluginsList
 * @HTTPMethod GET
 * @returns {string}
 */
app.get("/pluginsList", function (req, res) {
    res.send(pluginsList);
});



