// JavaScript Document
//Quebra cabeça
//var host = "http://localhost";
var host = "http://nin.jit.su";
var hostpublic = "http://publicnin.jit.su";
var porta;
var idQuebraCabeca;
var tituloQuebraCabeca;
var temaQuebraCabeca;
var imagemQuebraCabeca;

/*
classe para contador de tempo
*/
var tempo = {
	s:0,
	m:0,
	timer_is_on:0,
	t:0,
	f:0,
	totalSegundos:0,

	iniciarCronometro: function(){
		if (!tempo.timer_is_on) {
		  tempo.timer_is_on=1;
		  tempo.totalSegundos=0;
		  tempo.s=0;
		  tempo.m=0;
		  tempo.cronometro();
		}
	},

	cronometro:function(){
		if(tempo.s==60){
			tempo.m++;
			tempo.s=0;	
		}
		tempo.f=(tempo.m<10)?'0'+tempo.m+':':tempo.m+':';
		tempo.f+=(tempo.s<10)?'0'+tempo.s:tempo.s;
		$('#tempo span').html(tempo.f);
		tempo.s++;
		tempo.totalSegundos++;
		tempo.t=setTimeout(tempo.cronometro,1000);
	},
	
	pausaCronometro:function(){
		clearTimeout(tempo.t);
		tempo.timer_is_on=0;
	}

};

function QuebraCabeca(host_p,porta_p,tema,imagem,linhas,colunas,quadrado,multiplayer,titulo,jogoid){

host = (host_p)?host_p:"http://nin.jit.su";
porta = (porta_p)?porta_p:80;

if(multiplayer){
	var socket = io.connect(server);
	// Ao conectar com servidor...
	
	socket.on('connect', function(){
		// Enviando mensagem ao servidor apenas para alertar o servidor.
		socket.send("Ola Servidor do Quebra Cabeca");
	
		// id do Cliente
		cliente_id = this.socket.sessionid;
		
		// recebe a mensagem de um novo cliente conectado
		socket.on('conectado', function(dados){
			console.log("conectado: "+ dados.cliente_id);
			//fnEscreveMsg("<p><i>"+ dados.cliente_id + " se conectou... </i></p>");
		});
	
		// rece uma mensagem de que o usuário se desconectou
		socket.on('usuario_desconectado', function(obj){
			console.log(obj);
		});

		// recebe o movimento dos objetos
		socket.on('move_objeto', function(dados){
			if(!clone){
				document.getElementById('drag').appendChild(document.getElementById(dados.dados.id)); 
				clone = true;
			}
			//console.log(dados);
			fnMoveObjeto(dados);
			//fnEscreveMsg("Seja bem vindo: "+ dados.cliente_id);
		});
		// recebe quando o outro acerta
		socket.on('drop_acerto', function(dados){
			document.getElementById(dados.dados.drop_id_acerto).appendChild(document.getElementById(dados.dados.id));
			colocadosBlocos++;
			 $( "#acertos" ).html(colocadosBlocos);
		});
	
		// recebe quando o outro erra
		socket.on('drop_erro', function(dados){
			document.getElementById(dados.dados.drop_id_erro).classList.add('boxErro');
			console.log(dados.dados.id);
			document.getElementById('repositorio').appendChild(document.getElementById(dados.dados.id));			
			errosBlocos++;
			$( "#erros" ).html(errosBlocos);
		});
	
	});
}

//atributos
//var imgSrc = (localStorage.getItem('imagemQuebraCabeca')!= null)?localStorage.getItem('imagemQuebraCabeca'):"img/ben10/ben10bkg.jpg";
var clone = false;
var imageObj = new Image();
var imgTema = tema;
var imgSrc = imagem?imagem:hostpublic+"images/img/ben10/ben10bkg.jpg";
var tamanhoQuadrado = quadrado?quadrado:100;
var qtdLinhas = linhas?linhas:5;
var qtdColunas = colunas?colunas:6;
var totalBlocos = qtdLinhas * qtdColunas;
var wBox = qtdColunas * tamanhoQuadrado;
var hBox = qtdLinhas * tamanhoQuadrado;
var gap = 0;

//placar
var errosBlocos = 0;
var colocadosBlocos = 0;
$( "#erros" ).html(errosBlocos);
$( "#acertos" ).html(colocadosBlocos);
$( "#tempo span" ).html("00:00");
$( "#listaRecordes" ).html("");

// box main
var wBoxMain = "" + wBox + "px";
var hBoxMain = "" + hBox + "px";
// container
var wContainer = "" + (wBox + gap) + "px";
var hContainer = "" + (hBox + gap) + "px";

//usada no drag
var dragId;
var objDrag = new Object();

var main = document.getElementById("main");
main.style.display = "block";
main.style.backgroundImage="url("+hostpublic+":"+porta+"/images/img/"+tema+"/bkg_tema.png)";

//som tema
$('#source_tema').attr('src','/sons/'+tema+'/tema.mp3');
document.getElementById('sons_tema').load();
fnSoundPlay('sons_tema');

var repositorio = document.getElementById("repositorio");
//repositorio.innerHTML = "";
repositorio.style.width = (tamanhoQuadrado + 20) + "px";
if ( repositorio.hasChildNodes() ){
    while ( repositorio.childNodes.length >= 1 ){
        repositorio.removeChild( repositorio.firstChild );       
    } 
}

var containerGrid = document.getElementById("containerGrid");
containerGrid.innerHTML = "";
containerGrid.style.width = wContainer;
containerGrid.style.height = hContainer;
containerGrid.style.display = "block";

var container = document.getElementById("container");
container.innerHTML = "";
container.style.width = wContainer;
container.style.height = hContainer;
container.style.display = "block";

var boxmain = document.getElementById('boxmain');
boxmain.innerHTML = "";
boxmain.style.width = wBoxMain;
boxmain.style.height = hBoxMain;
boxmain.style.backgroundImage = "url('"+imgSrc +"')";
document.getElementById('imgCompleta').style.background = "url('"+imgSrc +"') no-repeat 0 0";
boxmain.classList.add('alpha');

var thumb = document.getElementById("thumb_"+tema);
thumb.style.display="block";

// drop
var drop_sourceX = 0;
var drop_sourceY = 0;
var drop_sourceWidth = 0;
var drop_sourceHeight = 0;
for(drop_y=0;drop_y<qtdLinhas;drop_y++){
	for(drop_x=0;drop_x<qtdColunas;drop_x++){
	  drop_sourceX = drop_sourceX;
	  drop_sourceY = drop_sourceY;
	  drop_sourceWidth = tamanhoQuadrado;
	  drop_sourceHeight = tamanhoQuadrado;
	  drop_div = document.createElement("div");
	  drop_div.className = (drop_x==0)?'boxClear':'box';
	  drop_div.id = "drop"+drop_y+"_"+drop_x;			  
	  drop_div.ondrop = function(){drop(event)};
	  drop_div.ondragover = function(){allowDrop(event)};
	  container.appendChild(drop_div);
	  //próxima coluna 
	  drop_sourceX = drop_sourceX + tamanhoQuadrado;
	}
  //próxima linha, zera variáveis
  drop_x = 0;
  drop_sourceX = 0;
  drop_sourceY = drop_sourceY + tamanhoQuadrado;
}

//grid
var canvas2 = document.getElementById('canvas2');
var grid_sourceX = 0;
var grid_sourceY = 0;
var grid_sourceWidth = 0;
var grid_sourceHeight = 0;
for(grid_y=0;grid_y<qtdLinhas;grid_y++){
	for(grid_x=0;grid_x<qtdColunas;grid_x++){
	  grid_sourceX = grid_sourceX;
	  grid_sourceY = grid_sourceY;
	  grid_sourceWidth = tamanhoQuadrado;
	  grid_sourceHeight = tamanhoQuadrado;
	  grid_div = document.createElement("div");
	  grid_div.className = (grid_x==0)?'boxGridClear':'boxGrid';
	  containerGrid.appendChild(grid_div);
	  //próxima coluna 
	  grid_sourceX = grid_sourceX + tamanhoQuadrado;
	}
  //próxima linha, zera variáveis
  grid_x = 0;
  grid_sourceX = 0
  grid_sourceY = grid_sourceY + tamanhoQuadrado;
}		
		
// DRAG
var repositorio = document.getElementById("repositorio");
var sourceX = 0;
var sourceY = 0;
var sourceWidth = 0;
var sourceHeight = 0;
var destWidth = 0;
var destHeight = 0;
var destX = 0;
var destY = 0;
var count = 1;

imageObj.onload = function() {
	for(y=0;y<qtdLinhas;y++){
		for(x=0;x<qtdColunas;x++){
		  sourceX = sourceX;
		  sourceY = sourceY;
		  sourceWidth = tamanhoQuadrado;
		  sourceHeight = tamanhoQuadrado;
		  destWidth = sourceWidth;
		  destHeight = sourceHeight;
		  canvas = document.createElement("canvas");
		  canvas.width = tamanhoQuadrado;
		  canvas.height = tamanhoQuadrado;
		  context = canvas.getContext("2d");
		  context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
		  canvas.id = "drag"+y+"_"+x;
		  canvas.draggable = "true";
		  canvas.className = "canvasComBorda";
		  canvas.ondragstart = function(){drag(event)};

		  if(count%2 > 0){
			  //console.log(count);
			  repositorio.appendChild(canvas);
		  }else{
			prependElement(repositorio,canvas);
		  }

		  //próxima coluna 
		  count++;
		  sourceX = sourceX + tamanhoQuadrado;
		}
	  //próxima linha, zera variáveis
	  x = 0;
	  sourceX = 0
	  sourceY = sourceY + tamanhoQuadrado;
	}
	//finaliza;
	$('#carregando').hide();					
	$('#mascara').hide('slow');
};

//carrega a imagem
imageObj.src = imgSrc;
	
    function prependElement(parent,child)
    {
        parent.insertBefore(child,parent.childNodes[0]);
    }

	function allowDrop(ev)
	{
		//console.log(ev.x);
		if(multiplayer){
			objDrag.x = ev.x;
			objDrag.y = ev.y;
			objDrag.id = dragId;
			socket.emit('move_objeto',objDrag,function(){});
			clone = false;
		}
		ev.preventDefault();
	}
	
	function drag(ev)
	{
		//inicia o cronometro no primeiro drag
		tempo.iniciarCronometro();

		//chatNinJitSu.alerta(1);
		fnSoundPlay('sons_pin');
		ev.dataTransfer.setData("id",ev.target.id);
		ev.dataTransfer.setData("from",ev.target.parentNode.id);
		dragId = ev.target.id;
	}
	
	function drop(ev)
	{
		//alert(1);
		if(ev.target.nodeName == 'DIV'){
			var drag_id=ev.dataTransfer.getData("id");
			var drop_id=ev.target.id;
			var from=ev.dataTransfer.getData("from");

			//colocou no lugar errado, toca musica ok
			if(drag_id != (drop_id.replace('drop','drag'))){
				fnSoundPlay('sons_oh_no');
								
				//marca nos outros jogadores
				if(multiplayer){
					objDrag.drop_id_erro = drop_id;
					socket.emit('drop_erro',objDrag,function(){});
				}
				
				document.getElementById(drop_id).classList.add('boxErro');
				errosBlocos++;
				 $( "#erros" ).html(errosBlocos);

				ev.preventDefault();
				return false;
			}
			
			//colocou no lugar certo, toca musica ok
			fnSoundPlay('sons_palmas');
			
			ev.dataTransfer.effectAllowed = 'move';
			ev.dataTransfer.dropEffect = 'move';
			ev.target.appendChild(document.getElementById(drag_id));
			
			//marca nos outros jogadores
			if(multiplayer){
				objDrag.drop_id_acerto = drop_id;
				socket.emit('drop_acerto',objDrag,function(){});
			}

			//controle da quantidade de blocos colocados
			if(from != ev.target.id && ev.target.id != 'repositorio'){
				colocadosBlocos++;
				 $( "#acertos" ).html(colocadosBlocos);
			}
			if(from != ev.target.id && ev.target.id == 'repositorio'){
				colocadosBlocos--;
			}
			
			//concluído
			if(colocadosBlocos == totalBlocos){
				//pausa o cronometro
				tempo.pausaCronometro();

				//pontuacao
				totalDePontos = (errosBlocos * -1) * 10;
				totalDePontos +=(colocadosBlocos * 100);
				totalDePontos -=(tempo.totalSegundos);

				//coclui o jogo
				fnJogoConcluido(titulo,tempo,totalDePontos);
				
				var dataRecorde = new Date();
				
				//carrega thumb
				$.ajax({
				    url: "/recorde",
				    type: "POST",
				    data: {
		                jogoid: jogoid,
		                pontos: totalDePontos,
						datadorecorde: dataRecorde
				    },
				    cache: false,
				    timeout: 5000,
				    complete: function() {
				      //console.log('process complete');
					  fnPosicaoRank(jogoid,totalDePontos,dataRecorde);
				    },
				    success: function(data) {
				      //console.log('gravado recorde');
					  //console.log(data);
					  fnListaRecordes(data);
				    },
				    error: function(err) {
				      console.log('erro ao gravar recorde');
				    }
				});
				
				/*
				$.ajax({
				    url: "/listarecorde",
				    type: "GET",
				    data: {
		                jogoid: jogoid				    	
				    },
				    cache: false,
				    timeout: 5000,
				    complete: function() {
				      console.log('process complete');
				    },
				    success: function(data) {
						fnListaRecordes(data);
				    },
				    error: function(err) {
				      console.log('erro ao gravar recorde');
				    }
				});
				*/
			}
		}
		ev.preventDefault();	
	}

	function fnPosicaoRank(jogoid,totalDePontos,dataRecorde){
		//recupera o rank
		$.ajax({
			url: "/posicaorank",
			type: "POST",
			data: {
				jogoid: jogoid,
				pontos: totalDePontos,
				dataRecorde: dataRecorde
			},
			cache: false,
			timeout: 5000,
			complete: function() {
			  //console.log('process complete');
			},
			success: function(data) {
				//console.log(data);
				var dados = JSON.parse(data.dados);
				$('#pontosTotal').append(' <span>(' + dados.retorno +'°) ');
			},
			error: function(err) {
			  console.log('erro ao obter o rank');
			}
		});
	}

	function fnListaRecordes(data){
		//console.log('lista recordes');
		//console.log(data);
		var dados = JSON.parse(data.dados);
		for (i=0;i<dados.retorno.length;i++){
			var objRecorde = dados.retorno[i];
			var _pos =  document.createElement("span");
				_pos.className = "posicaoRank";
				_pos.innerHTML = (i+1) + "º";

			var _usu =  document.createElement("span"); 
				_usu.className = "usuarioRank";
				_usu.innerHTML = objRecorde.usuario;

			var _pontos = document.createElement("span");
				_pontos.className = "pontuacaoRank";
				_pontos.innerHTML = objRecorde.pontos;

			var _li = document.createElement("li");
				_li.appendChild(_pos);
				_li.appendChild(_usu);
				_li.appendChild(_pontos);
				
			$('#listaRecordes').append(_li);
		}
	}
	
	function fnJogoConcluido(titulo,tempo,totalDePontos){
		fnSoundPause('sons_tema');
		fnSoundPlay('sons_kids');
		$('#bt_jogos').hide();		
		$('#main').hide();
		$('#tempo').hide();
		$('#container-quebracabeca').show('slow').animate();
		$('#pontosTotal').html(totalDePontos);
		$('#tempoTotal').html($('#tempo').html());
		$('#tituloJogo').html(titulo);
	}

	function fnOcultaJogo(){

	}

	function fnSoundPlay(acao){
		document.getElementById(acao).play();
	}
	function fnSoundPause(acao){
		document.getElementById(acao).pause();
	}
	function fnMudaImagem(img){
		this.imgSrc = img;
		//fnInit();
	}

	function fnMoveObjeto(objeto){
		//console.log(objeto.dados.x);
		//alert(document.getElementById('drag'));
		document.getElementById('drag').style.position = "absolute";
		document.getElementById('drag').style.zIndex = 999;
		document.getElementById('drag').style.left = objeto.dados.x+"px";
		document.getElementById('drag').style.top = objeto.dados.y+"px";
	}	
	
	//$('#modelos > ul').css('width','450px;');
	//QuebraCabeca.prototype.soundplay = fnSoundPlay;
	//document.getElementById('body').ondragover = function(){allowDrop(event)};
}

//controles
$(document).ready(function(){
	// acoes
	$('#modelos > ul').css('width','450px;');
	//$('#modelos > ul > li').css('width','120px;');
	//$('#modelos > ul > li').css('float','left');
	$('#bt_jogos, #bt_novojogo').click(function(e){
		$('#bt_jogos').hide();
		$('#container-quebracabeca').hide();
		$('#modelos').show('slow');
		$('#mascara').show();
		$('#main').show();
	});
	$('#mascara').click(function(e){
		$('#bt_jogos').show();
		$('#modelos').show();
		$('#mascara').hide();
	});
	//carrega thumb
    $.ajax({
        url: "/listajogosquebracabeca",
        type: "GET",
        data: null,
        cache: false,
        timeout: 5000,
        complete: function() {
          //console.log('process complete');
        },
        success: function(data) {
          fnTrataSuccessLista(data);
        },
        error: function(err) {
          fnTrataErrorLista(err);
        }
    });
});

function fnTrataSuccessLista(data){
	var dados = JSON.parse(data.dados);
	//console.log(dados);
	for (i=0;i<dados.retorno.length;i++){
		var objJogo = dados.retorno[i];
		var _cat =  objJogo.categoria;
			_cat = _cat.replace(" ","").toLowerCase();
		var _img = document.createElement("img");
			_img.src = hostpublic+"/images/img/"+_cat+"/jogos/thumb/"+objJogo.link;
			_img.id = objJogo._id;
			_img.title = objJogo.titulo;
			_img.categoria = _cat;
		var _li = document.createElement("li");
			_li.appendChild(_img);			
		$('#thumb_'+_cat).append(_li);
	};
	$('#modelos > ul > li > img').click(
		function(event){
			//console.log(event.currentTarget.attributes['categoria'].value);
			var _cat = event.currentTarget.attributes['categoria'].value;
			$('#modelos').hide('fast');
			$('#submodelos').show('fast');
			$('#thumb_'+_cat).show('fast');
		}
	);
	$('#submodelos > ul > li > img').click(
		function(event){
			temaQuebraCabeca = this.categoria;
			imagemQuebraCabeca = this.src.replace('thumb/','');
			idQuebraCabeca = this.id;
			tituloQuebraCabeca = this.title;
			
			localStorage.setItem('temaQuebraCabeca', temaQuebraCabeca);
			localStorage.setItem('imagemQuebraCabeca', imagemQuebraCabeca);
			localStorage.setItem('idQuebraCabeca', idQuebraCabeca);
			localStorage.setItem('tituloQuebraCabeca', tituloQuebraCabeca);

			tempo.pausaCronometro();			
			var quebracabeca = new QuebraCabeca(host,porta,temaQuebraCabeca,imagemQuebraCabeca,null,null,null,false,tituloQuebraCabeca,idQuebraCabeca);
			$('#bt_jogos').show();
			$('#tempo').show();
			$('#acertos').show();
			$('#erros').show();
			$('#modelos').hide('slow')
			$('#submodelos > ul > li').hide('fast')
			$('#submodelos').hide('slow')
			$('#carregando').show('fast');
			event.preventDefault();	
		}
	);

	$('#bt_repetirjogo').click(
		function(event){
			temaQuebraCabeca = localStorage.getItem('temaQuebraCabeca');
			imagemQuebraCabeca = localStorage.getItem('imagemQuebraCabeca');
			idQuebraCabeca = localStorage.getItem('idQuebraCabeca');
			tituloQuebraCabeca = localStorage.getItem('tituloQuebraCabeca');			

			var quebracabeca = new QuebraCabeca(host,porta,temaQuebraCabeca,imagemQuebraCabeca,null,null,null,false,tituloQuebraCabeca,idQuebraCabeca);
			$('#bt_jogos').show();
			$('#tempo').show();	
			$('#container-quebracabeca').hide();
			$('#main').show();
			event.preventDefault();	
		}
	);
}

function fnTrataErrorLista(erro){
	console.log("erro");
}
