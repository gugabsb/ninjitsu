// The Login model

var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var loginSchema = new Schema({
    login: ObjectId,
    username: {type: String, default: 'Visitante'},
    password: String
});

module.exports = mongoose.model('Login', loginSchema);