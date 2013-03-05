    function fnCadastro(){
        $(".msgErro").remove();
       
        // valida dados
        //nome
        var nome = $('#nome').val()
        if(nome.length < 5){
            fnMensagens('nome',100);
            return false;            
        }else{
            $('#nome').removeClass("bkgErro");
        }

        //email
        var email = $('#email').val()
        if(email.length < 10 || email.indexOf('@') < 0 || email.indexOf('.') < 0){
            fnMensagens('email',101);
            return false;            
        }else{
            $('#email').removeClass("bkgErro");
        }

        //data de nascimento
        //dia 
        var nascimento_dia = $('#nascimento_dia').val()
        if(nascimento_dia.length < 1 || nascimento_dia > 31){
            fnMensagens('nascimento_dia',102);
            return false;            
        }else{
            $('#nascimento_dia').removeClass("bkgErro");
        }
        //mes
        var nascimento_mes = $('#nascimento_mes').val()
        if(nascimento_mes.length < 1 || nascimento_mes > 12){
            fnMensagens('nascimento_mes',102);
            return false;            
        }else{
            $('#nascimento_mes').removeClass("bkgErro");
        }
        //ano
        var nascimento_ano = $('#nascimento_ano').val()
        if(nascimento_ano.length < 4 || nascimento_ano < 1900){
            fnMensagens('nascimento_ano',102);
            return false;            
        }else{
            $('#nascimento_ano').removeClass("bkgErro");
        }
        try{
            var dat_nascimento = new Date(nascimento_ano,nascimento_mes,nascimento_dia);
            $('#nascimento_dia').removeClass("bkgErro");   
        }
        catch(err){
            fnMensagens('nascimento_dia',102);
            return false;            
        }

        //sexo
        var sexo = $('#sexo').val();

        //usuario
        var usuario = $('#usuario').val()
        if(usuario.length < 3){
            fnMensagens('usuario',103);
            return false;            
        }else{
            $('#usuario').removeClass("bkgErro");
        }

        //senha
        var senha = $('#senha').val()
        if(senha.length < 6){
            fnMensagens('senha',104);
            return false;            
        }else{
            $('#senha').removeClass("bkgErro");
        }

        //termo de uso
        var termoDeUso = $("#termos_uso:checked").length;
        if(termoDeUso==0){
            fnMensagens('termos_uso',105);
            return false;            
        }else{
            $('#termos_uso').removeClass("bkgErro");
        }

        $.ajax({
            url: "/cadastro",
            type: "POST",
            data: {
                nome: nome, 
                email: email, 
                nascimento: dat_nascimento, 
                sexo: sexo,
                usuario: usuario, 
                senha: senha
            },
            cache: false,
            timeout: 5000,
            complete: function() {
              console.log('process complete');
            },
            success: function(data) {
              fnTrataSuccessCadastro(data);
            },
            error: function(err) {
              fnTrataErrorCadastro(err);
            },
        });
    }

    function fnMensagens(campo,code){
        var span = document.createElement("span");
            span.className="msgErro";
        var texto;
        switch(code){
            //cadastro
            case 1:
                texto = document.createTextNode("O seu cadastro foi realizado com sucesso!");
                break;
            case 100:
                texto = document.createTextNode("Informe o NOME corretamente!");
                break;
            case 101:
                texto = document.createTextNode("Informe o E-MAIL corretamente!");
                break;
            case 102:
                texto = document.createTextNode("Informe a DATA de NASCIMENTO corretamente!");
                break;
            case 103:
                texto = document.createTextNode("Informe o USUÁRIO corretamente!");
                break;
            case 104:
                texto = document.createTextNode("Informe a SENHA corretamente, minímo de 6 chars!");
                break;
            case 105:
                texto = document.createTextNode("Confirme a leitura e o aceite do Termo de Uso!");
                break;                
            //login
            case 200:
                texto = document.createTextNode("Login inválido, verifique os dados!");
                break;
            case 203:
                texto = document.createTextNode("USUÁRIO inválido!");
                break;
            case 204:
                texto = document.createTextNode("SENHA inválida!");
                break;
            //esquecisenha
            case 300:
                texto = document.createTextNode("Sua senha foi enviada para o e-mail informado");
                break;
            case 301:
                texto = document.createTextNode("Não existe esse e-mail cadastrado, verifique os dados informados!");
                break;
            case 302:
                texto = document.createTextNode("Informe o EMAIL corretamente!");
                break;                
            //Server
            case 11000:
                texto = document.createTextNode("Já existe este cadastrado, informe um diferente!");
                break;
            default:
                texto = document.createTextNode("Ocorreu um erro, tente novamente em instantes.");
        }
        span.appendChild(texto);
        $('#msg').append(span);
        $('#'+campo).focus();
        $('#'+campo).addClass("bkgErro");

    }

    function fnTrataErrorCadastro(erro){
        fnMensagens('submit',erro.code)
        //erro não tratado
        console.log(erro);
        console.log('process error: '+ erro.statusText);
    }

    function fnTrataSuccessCadastro(data){
        var retorno = JSON.parse(data.dados);
        if(retorno.erro){
            fnCadastroErro(retorno.erro);
        }else{
            fnCadastroSucesso(retorno.retorno);
        }
    }

    function fnCadastroSucesso(retorno){
        fnCloseCadastro();
        fnShowLogin();
        fnMensagens('submit',1)
        console.log(retorno);
        console.log('process sucess');
    }

    function fnCadastroErro(erro){
        console.log(erro);
        console.log('process erro: '+ erro.err);        
        //duplicate key
        if(erro.code == 11000){
            campo_erro = erro.err.substring(erro.err.indexOf("$")+1,erro.err.indexOf("_"));
            fnMensagens(campo_erro,erro.code)
        } 

    }

    function dateReviver(key, value) {
        var a;
        if (key == 'nascimento' && typeof value === 'string') {
            a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
            if (a) {
                return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                                +a[5], +a[6]));
            }
        }
        return value;
    };