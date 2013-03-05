// The Recorde model

var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var recordeSchema = new Schema({
    id: ObjectId,
    jogoid: {type:String},
    usuario: {type:String},
    pontos: {type:Number, default: 0},
	data: {type:Date, default: Date.now}
});

module.exports = mongoose.model('Recorde', recordeSchema);