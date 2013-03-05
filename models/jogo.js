// The Jogos model

var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var jogoSchema = new Schema({
    id: ObjectId,
	jogo: {type:String},    
    categoria: {type:String},
    titulo: {type:String},
    usuario: {type:String, default: "todos"},
    link:  {type:String},
	data: {type:Date, default: Date.now}    
});

module.exports = mongoose.model('Jogo', jogoSchema);