var Thread = require('../models/thread.js');
var Post = require('../models/post.js');
var Login = require('../models/login.js');
var Cadastro = require('../models/cadastro.js');
var Recorde = require('../models/recorde.js');
var criptografia = require('../models/criptografia.js');
var Jogo = require('../models/jogo.js');
var Log = require('../models/log.js');
var hostUrl = "http://nin.jit.su/";
var nodemailer = require("nodemailer");

//********************** area publica *************************//
exports.index = function(req, res){ 
//  if (req.loggedIn === false)
      //res.redirect('/auth/twitter');
  if(req.app.settings.env=='development'){
	 hostUrl = "http://localhost/";
  }
  
  res.render('index.jade', {layout:"layout.jade", title: 'Nin.Jit.Su Games' })
};

//********************** area segura *************************//
exports.sair = function(req, res){
  req.session.destroy();
  req.method = 'get';
  res.redirect(hostUrl);
};

exports.home = function(req, res){
  if(!req.session.login){
    req.method = 'get';
    res.redirect(hostUrl);
  }else{
    res.render('home.jade',{ layout: "layout_home.jade", title: 'Nin.Jit.Su Games', login: req.session.login});
  }
};

//********************** cadastro *************************//
exports.homecadastro = function(req, res){
  req.session.destroy();
  res.render('cadastro.jade',{ layout: "layout_cadastro.jade", title: 'Nin.Jit.Su Games Cadastro'});
};

exports.cadastro = function(req, res) {
  //db.Cadastro.ensureIndex({email:1},{unique:true});
  var senhaCripto = criptografia.Encripta(req.body.senha);
  new Cadastro({nome: req.body.nome, email: req.body.email, nascimento: req.body.nascimento, sexo: req.body.sexo, usuario: req.body.usuario, senha:senhaCripto}).save(function(err2, cad_saved){
    if(err2){
      new Log({acao: "erro de cadastro", usuario: req.body.usuario}).save(); 
      res.contentType('json');
      res.send({dados: JSON.stringify({erro:err2,retorno:null}) });
    }
    else{
      //dados salvos com sucesso
      //console.log("cadastrado");
      //registra o log
      new Log({acao: "cadastro", usuario: req.body.usuario}).save(); 

      //retorna todos os cadastros
      Cadastro.find(function(err, cadastros) {
      //console.log("erro: " + err);
        res.contentType('json');
        res.send({dados: JSON.stringify({erro:err,retorno:cadastros}) });
      });
    }
  });
}

//********************** login *************************//
exports.login = function(req, res) {
  var senhaCripto = criptografia.Encripta(req.body.senha);
  Cadastro.findOne({usuario:req.body.usuario, senha:senhaCripto}, function(err, cad) {
      if(cad!=null){
        if (req.session){
          //login com sucesso, cria a sessão do usuário
          //console.log(req.session);
          //console.log(sessao.login.nome);
          var sessao = req.session;
              sessao.login = cad;
          //log
          new Log({acao: "login", usuario: req.body.usuario}).save();               
        }
      }else{
        req.session.destroy();
        //log
        new Log({acao: "erro de login", usuario: req.body.usuario}).save();               
      }      
      res.contentType('json');
      res.send({dados: JSON.stringify({erro:err,retorno:cad}) });   
      //console.log("erro: " + err);
      //console.log("cadastro: " + cad);
  });
}

//********************** jogos *************************//
exports.recorde = function(req, res){  
  if(!req.session.login){
    req.method = 'get';
    res.redirect(hostUrl);
  }
  else{
	var _jogo = new Object();
	if(req.body.jogoid){
	  _jogo.jogoid = req.body.jogoid;
	};
    new Recorde({jogoid: req.body.jogoid, usuario: req.session.login.usuario, pontos: req.body.pontos, data: req.body.datadorecorde}).save(
      function(err2, recorde_saved){
        if(err2){
          new Log({acao: "erro no recorde", usuario: req.session.login.usuario}).save(); 
          res.contentType('json');
          res.send({dados: JSON.stringify({erro:err2,retorno:null}) });
        }
        else{
          new Log({acao: "recorde", usuario: req.session.login.usuario}).save(); 
 
		  //retorna os recordes
      //console.log(_jogo);
      Recorde.find({jogoid:_jogo.jogoid})
            .sort({pontos: -1, data: 1})
            .limit(10)
            .select('usuario pontos')
            .exec(  function(err, recordes){
      				        res.contentType('json');
      				        res.send({dados: JSON.stringify({erro:err,retorno:recordes})});
                    }
                  )
        }
      }
    )
  }
};

exports.jogos = function(req, res){  
  //console.log(req.query);
  if(!req.session.login || !req.query.jogo){
    req.method = 'get';
    res.redirect(hostUrl);
  }else{
    var jogopage = 'jogos_'+req.query.jogo+'.jade';
    var titulo = req.query.titulo;
    var layout = 'jogos_'+req.query.layout+'_layout.jade';

    new Log({acao: "jogando "+jogopage, usuario: req.body.usuario}).save(); 
    res.render(jogopage, {layout: layout, title: titulo})
  }
};

exports.listajogosquebracabeca = function(req, res){  
    var _jogo = new Object();
    if(req.query.categoria){
      _jogo.categoria = req.query.categoria;
    };
    if(req.query.objid){
      _jogo._id = req.query.objid;
    };

    //console.log(req);

    Jogo.find().sort('-categoria').exec(
  		function(err, jogos){
        //console.log('jogos:'+jogos);
  			res.contentType('json');
  			res.send({dados: JSON.stringify({erro:err,retorno:jogos})});
  		}
    );
};

exports.formaddjogo = function(req, res){
  if(!req.session.login){
    req.method = 'get';
    res.redirect(hostUrl);
  }else{
    res.render('form_addjogo.jade',{ layout: "layout_addjogo.jade", title: 'Nin.Jit.Su Games - Novo Jogo', login: req.session.login});
  }
};

exports.addjogo = function(req, res){
  new Jogo({jogo: req.body.jogo, categoria: req.body.categoria, titulo: req.body.titulo, usuario: req.body.usuario, link: req.body.link, data:req.body.data}).save(function(err2, jogo_saved){
    if(err2){
      new Log({acao: "erro ao adicionar jogo", usuario: req.body.usuario}).save(); 
      res.contentType('json');
      res.send({dados: JSON.stringify({erro:err2,retorno:null}) });
    }
    else{
      new Log({acao: "jogo adicionado", usuario: req.body.usuario}).save(); 
      res.contentType('json');
      res.send({dados: JSON.stringify({erro:null,retorno:jogo_saved})});
    }
  });
};

exports.posicaorank = function(req, res) {
	var _jogo = new Object();
	if(req.body.jogoid){
		_jogo.jogoid = req.body.jogoid;
	};
	//console.log('ok');
	//console.log(req);
	//console.log(req.body);
	Recorde.find({jogoid:_jogo.jogoid}).select('pontos').where('pontos').gte(req.body.pontos).exec(function(err, posicao) {
		//console.log(err);
		//console.log(posicao);
		var arrPos = JSON.stringify({data:posicao});
		var arrPos2 = JSON.parse(arrPos);
		//console.log(arrPos2.data.length);
		
		res.contentType('json');
		res.send({dados: JSON.stringify({erro:err,retorno:arrPos2.data.length})});
	});
  
  /*
  
  	Recorde.count({id:req.body.jogoid}).where('pontos').lte(req.body.pontos).exec(function(err, posicao) {
		console.log(posicao);
		res.contentType('json');
		res.send({dados: JSON.stringify({erro:null,retorno:posicao})});
	});
  
  Recorde.find(_jogo,
    ['usuario','pontos','data'], //colunas de retorno
    { 
		sort:{pontos: -1, data: 1} //Sort by Date Added DESC
    },
    function(err, recordes) {
		var posRank = 1;
		console.log(recordes);
		for(i=0;i<recordes.length;i++){
			if(recordes[i].usuario == req.body.usuario 
				&& recordes[i].pontos == req.body.pontos 
					&& recordes[i].pontos == req.body.datadorecorde){
						posRank = i+1;
						break;
					}
		}
		
      res.contentType('json');
      res.send({dados: JSON.stringify({erro:null,retorno:posRank})});
  });
  */
}

exports.listarecorde = function(req, res) {
  var _jogo = new Object();
  if(req.query.jogoid){
      _jogo.jogoid = req.query.jogoid;
  };
  
  Recorde.find(
      {jogoid:_jogo.jogoid},
      {skip:0, limit:10}
    )
    .limit(10)
    .sort({pontos: -1, data: 1})
    .select('usuario pontos') 
    .exec(
      function(err, recordes) {
        res.contentType('json');
        res.send({dados: JSON.stringify({erro:null,retorno:recordes})});
      }
    );
}

//********************** testes *************************//
exports.list = function(req, res) {
  Thread.find(function(err, threads) {
    res.send(threads);
  });
}

// first locates a thread by title, then locates the replies by thread ID.
exports.esquecisenha = (function(req, res) {
    Cadastro.findOne({email: req.body.email}, function(error, cadastro) {
        //console.log(cadastro);
        //console.log(error);
        if(error){
            res.contentType('json');
            res.send({dados: JSON.stringify({erro:error,retorno:null})});        
        }
        if(cadastro == null){
            res.contentType('json');
            res.send({dados: JSON.stringify({erro:"Email inexistente!",retorno:null})});        
        }else{
        
            var mailOptions = {
                from: "Nin.Jit.Su ✔ <ninjitsujogos@gmail.com>", // sender address
                to: req.body.email, // list of receivers
                subject: "Nin.Jit.Su veja sua senha", // Subject line
                text: "Olá " + cadastro.nome + 
                      "Segue abaixo seus dados para acesso:" +
                      "Usuário: " + cadastro.nome + 
                      "Senha: " + criptografia.Descripta(cadastro.senha) +
                      "Acesse agora http://nin.jit.su/", // text body
                html: "<b>Olá " + cadastro.nome + 
                      "</b><br/> <p>Segue abaixo seus dados para acesso:</p> <p>Usuário: " + cadastro.nome + 
                      "<br>Senha: " + criptografia.Descripta(cadastro.senha) + "</p>" +
                      "<p>Acesse agora <a href='http://nin.jit.su'>http://nin.jit.su</a></p>" // html body
            }

            new Log({acao: "esquecisenha", usuario: req.body.email}).save();
            
            // send mail with defined transport object
            smtpTransport.sendMail(mailOptions, function(error, response){
                if(error){
                    //console.log(error);
                    res.send({dados: JSON.stringify({erro:error,retorno:null})});                
                }else{
                    //console.log("Message sent: " + response.message);
                    res.contentType('json');
                    res.send({dados: JSON.stringify({erro:null,retorno:response.message})});
                }
                // if you don't want to use this transport object anymore, uncomment following line
                smtpTransport.close(); // shut down the connection pool, no more messages
            });
        }
    })
});


// envio de email
// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "ninjitsujogos@gmail.com",
        pass: "guga0680"
    }
});

// setup e-mail data with unicode symbols
exports.show = (function(req, res) {
    Thread.findOne({title: req.params.title}, function(error, thread) {
        var posts = Post.find({thread: thread._id}, function(error, posts) {
          res.send([{thread: thread, posts: posts}]);
        });
    })
});