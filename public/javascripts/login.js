    function fnLogin(){
        $(".msgErro").remove();

        //usuario
        var usuario = $('#username').val()
        if(usuario.length < 3){
            fnMensagens('username',203);
            return false;            
        }else{
            $('#username').removeClass("bkgErro");
        }

        //senha
        var senha = $('#password').val()
        if(senha.length < 6){
            fnMensagens('password',204);
            return false;            
        }else{
            $('#password').removeClass("bkgErro");
        }

        $('#carregando').show();

        $.ajax({
            url: "/login",
            type: "POST",
            data: {
                usuario: usuario, 
                senha: senha
            },
            cache: false,
            timeout: 5000,
            complete: function() {
              $('#carregando').hide();
              console.log('process complete');
            },
            success: function(data) {
              fnTrataSuccessLogin(data);
            },
            error: function(err) {
              fnTrataErrorLogin(err);
            },
        });
    }

    function fnTrataSuccessLogin(data){
        //var retorno = JSON.parse(data.dados,dateReviver); // exemplo usando uma função para tratar todos os dados retornados
        var retorno = JSON.parse(data.dados);
        if(retorno.erro){
            fnLoginErro(retorno.erro);
        }else{
            fnLoginSucesso(retorno.retorno);
        }
    }

    function fnLoginSucesso(retorno){
        console.log(retorno);
        if(retorno){
            $('#box-login').hide("slow").animate();
            var redirect = function(){window.location="/home";}
            setTimeout(redirect,2000);
        }else{
            fnMensagens('submit',200);
        }
    }

    function fnLoginErro(erro){
        console.log(erro);
        console.log('process erro: '+ erro.err);
        fnMensagens('submit',erro.code);
    }

    function fnTrataErrorLogin(erro){
        fnMensagens('submit',erro.code);
        //erro não tratado
        console.log(erro);
        console.log('process error: '+ erro.statusText);
    }
    
    function fnEnviaSenha(){
     $(".msgErro").remove();

        //emailcadastrado
        var emailcadastrado = $('#emailcadastrado').val()
        if(emailcadastrado.length < 3){
            fnMensagens('emailcadastrado',302);
            return false;            
        }else{
            $('#emailcadastrado').removeClass("bkgErro");
        }

        $('#carregando').show();

        $.ajax({
            url: "/esquecisenha",
            type: "POST",
            data: {
                email: emailcadastrado
            },
            cache: false,
            timeout: 5000,
            complete: function() {
              $('#carregando').hide();
              console.log('process complete');
            },
            success: function(data) {
              fnTrataSuccessEsqueciSenha(data);
            },
            error: function(err) {
              fnTrataErrorEsqueciSenha(err);
            },
        });
    }
    
    function fnTrataErrorEsqueciSenha(data){
        var retorno = JSON.parse(data.dados);
        if(retorno.erro){
            fnEsqueciSenhaErro(retorno.erro);
        }else{
            fnMensagens('emailcadastrado',301);
        }
    }    
   
    function fnTrataSuccessEsqueciSenha(data){
        var retorno = JSON.parse(data.dados);
        if(retorno.erro){
            fnEsqueciSenhaErro(retorno.erro);
        }else{
            fnEsqueciSenhaSucesso(retorno.retorno);
        }
    }
    
    function fnEsqueciSenhaSucesso(retorno){
        console.log(retorno);
        if(retorno){
            fnMensagens('emailcadastrado',300);
            fnCloseEsqueciSenha();
        }else{
            fnMensagens('emailcadastrado',301);
        }        
    }

    function fnEsqueciSenhaErro(erro){
        console.log(erro);
        console.log('process erro: '+ erro.err);
        fnMensagens('emailcadastrado',301);
    }