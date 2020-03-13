$("#botao-sync").on("click", sincronizaPlacar);

function inserePlacar(scoreUsuario) {

    let linha = novaLinha(scoreUsuario.nome, scoreUsuario.numPalavras, scoreUsuario.numCaracteres);
    linha.find(".botao-remover").click(removeLinha);

    let corpoTabela = $("tbody");
    corpoTabela.append(linha);
    $(".placar").slideDown(400);
    scrollPlacar(linha);
}

function novaLinha(usuario, numPalavras, numCaracteres) {
    let linha = $("<tr>");
    let colunaUsuario = $("<td>").text(usuario);
    let colunaPalavras = $("<td>").text(numPalavras);
    let colunaCaracteres = $("<td>").text(numCaracteres);
    
    let colunaRemover = $("<td>");

    let ancora = $("<a>").attr("href", "#").addClass("botao-remover");
    let icone = $("<i>").addClass("small").addClass("material-icons").addClass("grey-text").text("delete");

    // Icone dentro do <a>
    ancora.append(icone);

    // <a> dentro do <td>
    colunaRemover.append(ancora);

    // Os tres <td> dentro do <tr>
    linha.append(colunaUsuario);
    linha.append(colunaPalavras);
    linha.append(colunaCaracteres);
    linha.append(colunaRemover);

    return linha;
}

function removeLinha(event) {
    event.preventDefault();
    let linha = $(this).parent().parent();
    linha.fadeOut(1000);
    setTimeout(function () {
        linha.remove();
    }, 1000);
}

$("#botao-placar").on("click", mostraPlacar);

//animaçao abrindo placar e fechando placar
function mostraPlacar() {
    $(".placar").stop().slideToggle(600);  
}

function scrollPlacar(linha) {
    let offsetScoreUsuario = linha.offset().top;    //posição do score do usuário em relação ao topo da página

    $("html, body").animate({
        scrollTop: offsetScoreUsuario +"px",
    }, 300);
}

function sincronizaPlacar() {
    let placar = [];
    let linhas = $("tbody > tr");

    linhas.each(function (linha) {
        let usuario = $(this).find("td:nth-child(1)").text();

        let numPalavras = $(this).find("td:nth-child(2)").text();

        let numCaracteres = $(this).find("td:nth-child(3)").text();

        let score = {
            usuario: usuario,
            pontos: numPalavras,
            caracteres: numCaracteres,
        }

        placar.push(score); //monta array com as linhas do score
    });

    var dados = {       //monta o objeto que contem array de objetos com cada score
        placar: placar,
    };

    $.post("http://localhost:3000/placar", dados, function () {
        //"Salvou o placar no servidor"
        //inicia animação do tooltipster  
        $(".tooltip").tooltipster("open").tooltipster("content", "Sincronizado com sucesso!");
    }).fail(function () {
        $(".tooltip").tooltipster("open").tooltipster("content", "Falha ao sincronizar!");
    }).always(function () {
        //encerra animação do tooltipster
        setTimeout(function () {
            $(".tooltip").tooltipster("close");
            $(".tooltip").tooltipster("content", "Sincroniza com o servidor");
        }, 1200);

    });
}

function atualizaPlacar() {

    $.get("http://localhost:3000/placar", function (data) {

        $(data).each(function () {
            let linha = novaLinha(this.usuario, this.pontos, this.caracteres);
            linha.find(".botao-remover").on("click", removeLinha);
            $("tbody").append(linha);
        });
    });
}
