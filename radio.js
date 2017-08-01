var express = require('express');
var bodyParser = require('body-parser');
var controllers = require('./controllers');
var cors = require('cors');
app.use(cors({origin: 'http://178.33.122.217:8000'}));

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/build', controllers.build_search_index);
app.get('/stations', controllers.stations_list);
app.get('/search', controllers.search);

console.log('App running on port 8001');
app.listen(8001);