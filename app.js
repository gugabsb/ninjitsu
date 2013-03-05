
/**
 * Module dependencies.
 */

var express = require('express')
  , partials = require('express-partials')
  , mongoose = require('mongoose')
  , routes = require('./routes');

var app = module.exports = express();


// Configuration Basica
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "gugabsb@gmail.com" }));
  app.use(partials());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  //app.use(app.everyauth.middleware());
});


app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  //Database
  mongoose.connect('mongodb://gugabsb:123456@localhost/nodejitsudb863525707992');
});

app.configure('production', function(){
  app.use(express.errorHandler());
  //Database
  mongoose.connect('mongodb://nodejitsu:f9cfe9da6bc07ff3595e67c572a0ca27@staff.mongohq.com:10079/nodejitsudb863525707992');
});

// Routes
app.get('/', routes.index);
app.get('/home', routes.home);
app.get('/cadastro', routes.homecadastro);
app.get('/formaddjogo', routes.formaddjogo);
app.get('/jogos', routes.jogos);
app.get('/listajogosquebracabeca', routes.listajogosquebracabeca);
app.get('/sair', routes.sair);
app.get('/listarecorde', routes.listarecorde);

//post
app.post('/login', routes.login);
app.post('/cadastro', routes.cadastro);
app.post('/addjogo', routes.addjogo);
app.post('/recorde', routes.recorde);
app.post('/posicaorank', routes.posicaorank);
app.post('/esquecisenha', routes.esquecisenha);

//iniciar o server na porta xx
app.listen(process.env.VCAP_APP_PORT || 80, function(){
  console.log("Express server listening on port %d in %s mode", process.env.VCAP_APP_PORT, app.settings.env);
});