// The Cadastro model

var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var cadastroSchema = new Schema({
    id: ObjectId,
    nome: String,
    email: String,
    nascimento: {type: Date, default: Date.now},
    sexo: String,
    usuario: {type:String, unique:true},
    senha: String,
    data: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Cadastro', cadastroSchema);