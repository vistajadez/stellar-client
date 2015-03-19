/**
 * Dev Server
 */

var express = require('express');
var app = express();

// serve static files
app.use(express.static(__dirname + '/public'));

// catch-all: route everything else through webapp/index.html
app.get('*', function(req, res) {
	res.sendFile('index.html', {root: './public'});
});

module.exports = app;
