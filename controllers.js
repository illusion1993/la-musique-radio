var radioStationModel = require('./models');
var searchico = require('searchico');

var search_box, built = false;

module.exports.build_search_index = function (req, res) {
    radioStationModel.get_all_stations(function (err, stations) {
        if (err)
            console.log(err);
        else {
            if (!built) {
                search_box = searchico(stations, { deep: false, keys: ['title', 'genre', 'location', 'language'] });
                console.log('\n**Built Radio Search Index**');
            }
            res.send('Building Radio Search Index');
            built = true;
        }
    });
};

module.exports.stations_list = function (req, res) {
    radioStationModel.get_all_stations(function (err, stations) {
        if (err)
            console.log(err);
        else
            res.json(stations);
    });
};

module.exports.search = function (req, res) {
    if (req.query && req.query.keyword && req.query.keyword.trim()) {
        res.json(search_box.find(req.query.keyword));
    }
    else res.json([]);
};