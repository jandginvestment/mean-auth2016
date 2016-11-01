var mongoose = require('mongoose');
var schema = mongoose.schema;

module.exports = mongoose.model('User', new mongoose.Schema({
    name: String,
    passWord: String,
    admin:Boolean
}));