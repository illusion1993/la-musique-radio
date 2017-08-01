var express = require('express');
var bodyParser = require('body-parser');
var controllers = require('./controllers');
var cors = require('cors');
app.use(cors({origin: 'http://178.33.122.217:8000'}));

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/radio/build', controllers.build_search_index);
app.get('/radio/stations', controllers.stations_list);
app.get('/radio/search', controllers.search);

console.log('App running on port 8001');
app.listen(8001);