// JavaScript Document
function ChatNinjitsu(server){
//inicializa variáveis
var socket = io.connect(server);
var cliente_id;
var objMensagem = new Object();
var visitas = 0;
var totalMsg = 0;
var setScroll = false;
var elem = $('#msgRetorno');
var inner = $('#msgRetornoInner');

	//conecta no servidor;
	//	ChatNinjitsu.prototype.conectar = function(server){}
		
	// Ao conectar com servidor...
	socket.on('connect', function(){
		// Enviando mensagem ao servidor apenas para alertar o servidor.
		socket.send("Ola Servidor");

		// id do Cliente
		cliente_id = this.socket.sessionid;			
		$('#cliente').html(cliente_id);
		
		// recebe a lista de clientes
		socket.on('lista_de_clientes', function(dados){
			//console.log(dados.clientes);
			visitas = 0;
			fnDelOptions('destinatario_id');
			for (var clientes_id in dados.clientes) {
				console.log(clientes_id);
				if(clientes_id != cliente_id) fnAddOption('destinatario_id',clientes_id,clientes_id);
				visitas++;
			}
			fnVisitas();
		});

		// recebe uma mensagem em particular
		socket.on('mensagem_particular', function(obj){
			//console.log(obj);
			var boxMsg=document.createElement('p');				
			var tit=document.createElement('h5');
			var msg=document.createElement('span');
			var txtTit=document.createTextNode((obj.remetente_id == cliente_id)?'você disse para:':obj.remetente_id+' disse no particular:');
			var txtMsg=document.createTextNode(obj.mensagem.texto);
				tit.appendChild(txtTit);
				msg.appendChild(txtMsg);
				boxMsg.appendChild(tit);
				boxMsg.appendChild(msg);
				boxMsg.className = 'msgParticular';				
				
			fnEscreveMsg(boxMsg);
		});

		// recebe uma mensagem para todos
		socket.on('mensagem_para_todos', function(obj){
			//console.log(obj);
			var boxMsg=document.createElement('p');				
			var tit=document.createElement('h5');
			var msg=document.createElement('span');
			var txtTit=document.createTextNode((obj.remetente_id == cliente_id)?'você disse:':obj.remetente_id+' disse:');
			var txtMsg=document.createTextNode(obj.mensagem.texto);
				tit.appendChild(txtTit);
				//msg.appendChild(txtMsg);
				msg.innerHTML = obj.mensagem.texto;
				boxMsg.appendChild(tit);
				boxMsg.appendChild(msg);
				boxMsg.className = (obj.remetente_id == cliente_id)?'msgMinha':'msgTodos';
			
			fnEscreveMsg(boxMsg);
		});		

		// recebe a mensagem de um novo cliente conectado
		socket.on('conectado', function(dados){
			//console.log("conectado: "+ dados.cliente_id);
			fnEscreveMsg("<p><i>"+ dados.cliente_id + " se conectou... </i></p>");
		});

		// rece uma mensagem de que o usuário se desconectou
		socket.on('usuario_desconectado', function(obj){
			//console.log(obj);
		});
		
	});

	//envia a mensagem

	$('#msg').keypress(function(event){
		if(event.keyCode != 13) return;
		fnEnviaMsg();
	});
	$('#bt_enviar').click(function(event){
		fnEnviaMsg();
	});

	//subistituir depois
	function fnMsgParticular(texto){
		var boxMsg=document.createElement('p');				
		var tit=document.createElement('h5');
		var msg=document.createElement('span');
		var txtTit=document.createTextNode('vc disse no particular: ');
		var txtMsg=document.createTextNode(texto);
			tit.appendChild(txtTit);
			msg.appendChild(txtMsg);
			boxMsg.appendChild(tit);
			boxMsg.appendChild(msg);
			boxMsg.className = 'msgParticular';			
		fnEscreveMsg(boxMsg);
	}

	// mostra a quantidade de visitantes online
	function fnVisitas(){
		$('#visitas').html(visitas);
	}

	function fnEnviaMsg(){
		objMensagem.texto = document.getElementById('msg').value;
		if(objMensagem.texto == '') return false;
		if($('#destinatario_id').val() != ""){
			objMensagem.destinatario_id = $('#destinatario_id').val();
			socket.emit('mensagem_particular',objMensagem,function(){});
			//subistituir depois
			fnMsgParticular(objMensagem.texto);
		}else{
			socket.emit('mensagem_para_todos',objMensagem,function(){});	
		}
		document.getElementById('msg').value = '';
	}

	function fnEscreveMsg(msgTexto){
		$('#msgRetornoInner').append(msgTexto);
		fnScroll();
	}

	function fnAddOption(id,text,value){
		var newOption = document.createElement('option');
			newOption.text = text;
			newOption.value = value;
		var elSel = document.getElementById(id);
		try {
			elSel.add(newOption, null); // standards compliant; doesn't work in IE
		}catch(ex) {
			elSel.add(newOption); // IE only
		}
	}

	function fnDelOptions(id){
	  var elSel = document.getElementById(id);
	  var i;
	  if(elSel){
		  for (i = elSel.length - 1; i>0; i--) {
			  elSel.remove(i);
		  }
	  }
	}

	function fnScroll(){
		totalMsg++;			
		//$('#visitas').text(inner.height() + '---' + elem.height());
		if(inner.height() > elem.height()){
			elem.scrollTop(elem.height() + (Math.abs(inner.offset().top)));
			setScroll = true;
		}
		if(setScroll){
			inner.css("position","relative");
			inner.css("padding-right","20");
		}
	}


	ChatNinjitsu.prototype.socket = function(){
		return this.socket;
	}

}