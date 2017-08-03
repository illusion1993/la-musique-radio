var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var searchico = require('./searchico');

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
radioStationSchema.plugin(mongoosePaginate);

// Model for 'stations' collection in 'radio' db
var radioStationModel = dbConnection.model('stations', radioStationSchema);
module.exports = radioStationModel;


// Returns pagination object for given page number and pagination size
function get_stations_list (callback, page_number, pagination_size) {
    radioStationModel.paginate({}, { page: page_number, limit: pagination_size }, function(err, stations) {
        callback(stations);
    });
}
module.exports.stations_list = get_stations_list;


var search_box, built = false, pages_inserted = 0, total_pages = 1, batch_size = 50, total_rows = 0;
// Brings next page of objects, then inserts them into search
function insert_next_page () {
    if (pages_inserted === total_pages) {
        console.log('\n**Built Radio Search Index**');
        built = true;
        return;
    }

    get_stations_list(function (stations_page) {
        var stations = JSON.parse(JSON.stringify(stations_page.docs));
        search_box.add(stations);
        pages_inserted++;
        total_pages = parseInt(stations_page.pages);
        stations_page = undefined;
        total_rows += batch_size;

        console.log('Inserted ' + batch_size + ' more rows, total inserted: ' + total_rows);

        insert_next_page();
    }, pages_inserted + 1, batch_size);
}

module.exports.build_search_index = function (requested_batch_size) {
    if (built) return;
    search_box = searchico({ deep: false, keys: ['title', 'genre', 'location', 'language'], index_key: '_id' });
    if (requested_batch_size && parseInt(requested_batch_size) > 0) 
        batch_size = parseInt(requested_batch_size);
    insert_next_page();
};
 
function get_stations_from_ids (callback, ids, page_number, pagination_size) {
    radioStationModel.paginate({ _id: { $in: ids } }, { page: page_number, limit: pagination_size}, function(err, s) {
        if (err) console.log(err);
        callback(s);
    });
}

module.exports.search = function (callback, keyword, page_number, pagination_size) {
    var result_ids;
    if (keyword && keyword.length && keyword.trim().length) {
        result_ids = search_box.find(keyword);
    }
    get_stations_from_ids(callback, result_ids, page_number, pagination_size);
};