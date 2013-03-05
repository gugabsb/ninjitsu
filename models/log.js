// The Log model

var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var logSchema = new Schema({
    id: ObjectId,
    usuario: String,
    data: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Log', logSchema);