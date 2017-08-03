var radioStationModel = require('./models');
var utils = require('./utils');

module.exports.build_search_index = function (req, res) {
    radioStationModel.build_search_index(req.query.batch_size);
    res.send('Building Radio Search Index');
};

module.exports.stations_list = function (req, res) {
    radioStationModel.stations_list(utils.give_response(res), utils.get_page_number(req), utils.get_limit(req));
};

module.exports.search = function (req, res) {
    radioStationModel.search(utils.give_response(res), req.query.keyword, utils.get_page_number(req), utils.get_limit(req));
};