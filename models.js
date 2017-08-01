var mongoose = require('mongoose');

function getMongoURI(databaseName) {
    var mongoUser = encodeURIComponent(process.env.MONGO_USER);
    var mongoPassword = encodeURIComponent(process.env.MONGO_PASSWORD);
    var mongoPort = encodeURIComponent(process.env.MONGO_PORT);
    return 'mongodb://' + mongoUser + ':' + mongoPassword + '@127.0.0.1:' + mongoPort + '/' + databaseName + '?authSource=' + 'admin';
}

var dbConnection = mongoose.createConnection(getMongoURI('radio'));

// Schema for 'stations' collection in 'radio' db
var radioStationSchema = mongoose.Schema({
    title: { type: String },
    genre: { type: String },
    website: { type: String },
    stream: { type: String },
    location: { type: String },
    language: { type: String },
    protocol: { type: String }
});

// Model for 'stations' collection in 'radio' db
var radioStationModel = dbConnection.model('stations', radioStationSchema);

module.exports = radioStationModel;

module.exports.get_all_stations = function (callback) {
    radioStationModel.find(function (err, stations) {
        callback(err, stations);
    });
};