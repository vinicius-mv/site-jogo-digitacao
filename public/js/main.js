let campo = $(".campo-digitacao");

let cronometro = {
    id: 0,
    tempoRestante: 0,
    tempoInicial: 0,
}

let scoreUsuario = {
    nome: "não informado",
    numPalavras: 0,
    numCaracteres: 0,
    aprovado: false,
}


$(document).ready(function () {
    fraseAleatoria(cronometro);
    atualizaTamanhoFrase();
    spellCheck();
    $("#botao-reiniciar").click(function () {
        reiniciarJogo(cronometro);
    });
    atualizaPlacar();

    //função do plugin selectize -> input nome de (#usuarios) 
    $("#usuarios").selectize({
        create: true,
        sortField: 'text'
    });
    //função do plugin tooltipster -> (botao-sync) placar
    $('.tooltip')
        .tooltipster({
            trigger: 'custom',
            trigger: 'hover',
        })
});

function atualizaIdFrase(idFrase) {
    $("#id-frase").text(idFrase);
}

function atualizaTempoInicial(tempo, cronometro) {
    let tempoDigitacao = $("#tempo-digitacao");
    tempoDigitacao.text(tempo);

    cronometro.tempoInicial = tempoDigitacao.text();
}

//calc numero de palavras dinamicamente.
function atualizaTamanhoFrase() {
    let frase = $(".frase").text();

    let palavras = frase.split(" ");
    let numPalavras = palavras.length;

    let tamanhoFrase = $("#tamanho-frase");
    tamanhoFrase.text(palavras.length);
}

function inicilizaContadores() {

    campo.on("input", function (event) {

        scoreUsuario = validaTexto(scoreUsuario);

        $("#contador-caracteres").text(scoreUsuario.numCaracteres);
        $("#contador-palavras").text(scoreUsuario.numPalavras);
    });
}

function inicializaCronometro(cronometro, scoreUsuario) {

    campo.one("focus", function () {  //  campo.on ≅ campo.one('one' somente ativa na 1a vez do evento, 'on' ativa todas vezes)

        clearInterval(cronometro.id);
        cronometro.id = 0;
        cronometro.id = setInterval(function () {

            //desabilita botoes reiniciar
            $("#botao-reiniciar").attr("disabled", true);
            $("#botao-frase").attr("disabled", true);
            $("#botao-frase-id").attr("disabled", true);


            if (cronometro.tempoRestante >= 1) {
                cronometro.tempoRestante--;

                $("#tempo-digitacao").text(cronometro.tempoRestante);
            }
            else {
                console.log("entrei no else");

                finalizaJogo(scoreUsuario);
                $("#botao-reiniciar").attr("disabled", false);
                $("#botao-frase").attr("disabled", false);
                $("#botao-frase-id").attr("disabled", false);

                clearInterval(cronometro.id);

                scoreUsuario.numPalavras = 0;
                scoreUsuario.numCaracteres = 0;
                scoreUsuario.aprovado = false;

                return;
            }
        }, 1000);

    });
}

function reiniciarJogo(cronometro) {
    clearInterval(cronometro.id);
    cronometro.id = 0;

    campo.removeClass("campo-desativado");
    campo.attr("disabled", false);  //libera a textarea

    //inicializando os campos novamente
    campo.val("");
    $("#contador-palavras").text(0);
    $("#contador-caracteres").text(0);

    campo.removeClass("borda-verde");
    campo.removeClass("borda-vermelha");


    cronometro.tempoRestante = cronometro.tempoInicial;
    $("#tempo-digitacao").text(cronometro.tempoRestante);
    inicializaCronometro(cronometro, scoreUsuario);
}

function spellCheck(scoreUsuario) {
    campo.on("input", function () {
        let frase = $(".frase").text();
        let digitado = campo.val();
        let fraseComparavel = frase.substr(0, digitado.length);

        if (digitado == fraseComparavel) {
            campo.addClass("borda-verde");
            campo.removeClass("borda-vermelha");
        } else {
            campo.addClass("borda-vermelha");
            campo.removeClass("borda-verde");

            scoreUsuario = inicilizaContadores(scoreUsuario);
        }
    });
}

function finalizaJogo(scoreUsuario) {
    let nome;
    $(nome);
    nome = $("#usuarios").val();
    console.log(nome);

    scoreUsuario.nome = nome;

    //aplica fundo cinza ao desativar textarea
    campo.addClass("campo-desativado");
    campo.attr("disabled", true);


    scoreUsuario = validaTexto(scoreUsuario);

    if (scoreUsuario.aprovado == false) {
        $("#erro-texto-invalido").show(1);
        setTimeout(function () {
            $("#erro-texto-invalido").hide(1);
        }, 4000);
    }
    else {
        console.log("chamei inserePlacar()");
        inserePlacar(scoreUsuario);
        return;
    }
}

//funçao que confere texto e atualiza contagem de caracteres e palavras
function validaTexto(scoreUsuario) {
    let fraseInput = $(".campo-digitacao").val();
    let fraseDesafio = $(".frase").text();
    scoreUsuario.aprovado = false;

    while (!scoreUsuario.aprovado) {

        if (fraseInput.length == 0 || scoreUsuario.aprovado == true)
            return scoreUsuario;

        let regexConst = new RegExp(fraseInput);

        scoreUsuario.aprovado = regexConst.test(fraseDesafio);

        let palavras = fraseInput.split(/\S+/).length - 1;
        console.log("numPalavra: " + palavras);

        scoreUsuario.numPalavras = palavras;

        let caracteres = fraseInput.split("");
        scoreUsuario.numCaracteres = caracteres.length;

        caracteres.pop();
        fraseInput = caracteres.join("");
    }

    return scoreUsuario;
}
