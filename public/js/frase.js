$("#botao-frase").on("click", function () {
    fraseAleatoria(cronometro);
});

$("#botao-frase-id").on("click", function () {
    fraseDefinida(cronometro);
});

function fraseAleatoria(cronometro) {

    $("#spinner").toggle();

    $.get("http://localhost:3000/frases", function (dados) {
        buscaFraseAleatoria(dados, cronometro);
    })
        .fail(function () {
            $(".erro").show();
            setTimeout(function () {
                $(".erro").hide();
            }, 2000)
        })
        .always(function () {
            $("#spinner").toggle();
        });
}

function buscaFraseAleatoria(dados, cronometro) {
    
    //remove mensagem de erro de busca frase do servidor
    let numAleatorio = Math.floor(Math.random() * dados.length);
    let frase = dados[numAleatorio].texto;

    atualizaIdFrase(numAleatorio);
    atualizaFrase(frase);
    atualizaTamanhoFrase();
    atualizaTempoInicial(dados[numAleatorio].tempo, cronometro);
    reiniciarJogo(cronometro);
}

function atualizaFrase(dado) {
    let frase = $(".frase").text(dado);
}

function fraseDefinida(cronometro) {

    $("#spinner").toggle();

    let inputFraseId = $("#input-frase-id").val();
    atualizaIdFrase(inputFraseId);
    let param = {
        id: inputFraseId
    };

    $.get("http://localhost:3000/frases", param, function (dado) {
        buscaFraseDefinida(dado, cronometro);
    })
        .fail(function () {
            $(".erro").show();
            setTimeout(function () {
                $(".erro").hide();
            }, 4000)
        })
        .always(function () {
            $("#spinner").toggle();
        });
}

function buscaFraseDefinida(dado, cronometro) {

    let frase = dado.texto;

    atualizaFrase(frase);
    atualizaTamanhoFrase();
    atualizaTempoInicial(dado.tempo, cronometro);
    reiniciarJogo(cronometro);
}