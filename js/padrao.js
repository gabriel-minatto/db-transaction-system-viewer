var camp_tabela = new Array(16);
for (var i = 0; i < camp_tabela.length; i++)
	camp_tabela[i] = new Array(3);

var bufferLog = "";
var arquivolog = "";

$.extra = '';

function abrirAjax() {
    var ajax;
    if(window.XMLHttpRequest)
        ajax = new XMLHttpRequest();
    else if (window.ActiveXObject)
    	ajax = new ActiveXObject("Microsoft.XMLHTTP");
    else
        alert("Nao rola nesse browser...");//testando arquivo gitignore
	return ajax;
	}

$(document).on('click', '#reset', function(){
	var arquivo = abrirAjax();
	arquivo.open("GET","reset.php",true);
	arquivo.send();
	bufferLog = "";
	arquivolog = "";
	
	var campo = ["#log", "#buffer_log", "#buffer_data", "#dados"]
	for (x in campo)
		$(campo[x]).empty();
	
	for (var i = 1; i <= 5; i++)
		$("#transacao_" + i).attr("class", "ver");
	location.reload();
	});

function logBuffer(termo) {
	var inicio = "início T" + termo
	var linha = $("#c" + termo).val();
	var valor_anterior = camp_tabela[linha][2];
	var valor_atual = $("#n" + termo).val();
	if (valor_atual) {
		camp_tabela[linha][2] = valor_atual;
		
		if (!bufferLog.includes(inicio) && !arquivolog.includes(inicio))
			bufferLog += "<início T" + termo + ">\n";
		
		bufferLog += "<T" + termo + ", Cidades, " + linha + ", valor, " + valor_anterior + ", " + valor_atual + ">\n";
		$("#transacao_" + termo)[0].reset();
		mostraBufferLog();
		bufferDados();
		}
    }

	

	// ############################################ COMITT
	
function logWriter(termo) {
	if ((arquivolog.search("início T" + termo) > 0) || (bufferLog.search("início T" + termo) > 0)) {
		arquivolog += bufferLog;
		arquivolog += "<fim T" + termo + ">\n";
		//document.getElementById("transacao_" + termo).setAttribute("class", "naover");
		
		var transac = $("#transacao_"+termo);
		transac.hide();
		
		bufferLog = "";

		var temp = arquivolog.replace(/(\r\n|\n|\r)/gm,"xxx");
		var arquivo = abrirAjax();
		arquivo.open("GET","commit.php?pacote=" + temp,true);
		arquivo.send();

		$("#buffer_log").empty();
		$("#log").empty();

		var linha = arquivolog.split("\n");
		for (var i = 0; i < linha.length; i++) {
			$("#log").append(linha[i].replace("<", "&#60;") + "<br>");
			}
		}
    }

function mCriar(a, b, c, d) {
	var x = document.createElement(a);
	if (b)
		x.setAttribute(b, c);
	if (d)
		x.appendChild(document.createTextNode(d));
	return x;
	}

function mostraBufferLog() {
	if (bufferLog) {
		$("#buffer_log").empty();
		var linha = bufferLog.split("\n");
		for (var i = 0; i < linha.length; i++) {
			$("#buffer_log").append(linha[i].replace("<", "&#60;") + "<br>");
			}
		}
	}
	
function mostraLog() {
	var log = abrirAjax();
    log.open("GET", './dados/log.txt', false);
    log.onreadystatechange = function () {
        if(log.readyState === 4)
            if(log.status === 200 || log.status == 0) {
				arquivolog = log.responseText;
				var linha = log.responseText.split("\n");
				// $("#log").append("<h2>Arquivo de Log</h2>");
				for (var i = 0; i < linha.length; i++) {
					$("#log").append(linha[i].replace("<", "&#60;") + "<br>");
					if (linha[i].includes("fim"))
						$("#transacao_" + linha[i].substring(6,7)).attr("class", "naover");
					}
			}
			else
				arquivolog = "";
		}
		log.send(null);
	}

function mostraDados() {
	var dados = abrirAjax();
    dados.open("GET", './dados/cidades.csv', false);
    dados.onreadystatechange = function () {
        if(dados.readyState === 4)
            if(dados.status === 200 || dados.status == 0) {
				$("#dados").append("<table id='dados_tabela' class='table table-bordered table-striped table-hover table-responsive'></table>");
				var linha = dados.responseText.split("\n");
				for (var i = 0; i < 16; i++) {
					var celula = linha[i].split(";");
					if (i == 0) {
						$("#dados_tabela").append("<thead id='dados_cabecalho'></thead>");
						$("#dados_tabela").append("<tbody id='dados_corpo'></tbody>");
						$("#dados_cabecalho").append("<tr id='dados_linha_" + i + "'></tr>");
						}
					else
						$("#dados_corpo").append("<tr id='dados_linha_" + i + "'></tr>");
					for (var j = 0; j < 3; j++) {
						camp_tabela[i][j] = celula[j].replace(/(\r\n|\n|\r)/gm,"");
						if (i == 0)
							$("#dados_linha_" + i).append("<th>" + camp_tabela[i][j] + "</th>");
						else
							$("#dados_linha_" + i).append("<td>" + camp_tabela[i][j] + "</td>");
						}
					}
				}
			}
		dados.send(null);
	}

function bufferDados() {
	var i = new Array(16);
	var j = new Array(3);
	
	$("#buffer_data").empty();
	$("#buffer_data").append("<table id='buffer_dados_tabela' class='table table-bordered table-striped table-hover table-responsive'></table>");
		
	for (var i = 0; i <= 15; i++) {
		if (i == 0) {
			$("#buffer_dados_tabela").append("<thead id='buffer_dados_cabecalho'></thead>");
			$("#buffer_dados_tabela").append("<tbody id='buffer_dados_corpo'></tbody>");
			$("#buffer_dados_cabecalho").append("<tr id='buffer_dados_linha_" + i + "'></tr>");
			}
		else
			$("#buffer_dados_corpo").append("<tr id='buffer_dados_linha_" + i + "'></tr>");
		for (var j = 0; j < 3; j++)
			if (i == 0)
				$("#buffer_dados_linha_" + i).append("<th id='buffer_campo_dados_" + i + j + "'>" + camp_tabela[i][j] + "</></th>");
			else
				$("#buffer_dados_linha_" + i).append("<td id='buffer_campo_dados_" + i + j + "'>" + camp_tabela[i][j] + "</></td>");
		}
	}

$(document).on('click', '#checkpoint', function(){
	arquivolog += bufferLog + "Checkpoint \n";
	bufferLog = "";

	$("#buffer_log").empty();
	$("#log").empty();

	// $("#log").append("<h2>Arquivo de Log</h2>");
	
	var linha = arquivolog.split("\n");
	for (var i = 0; i < linha.length; i++) {
		$("#log").append(document.createTextNode(linha[i]) + "<br>");
		}
	
	var banco = "";
	for (var i = 0; i <= 15; i++) {
		for (var j = 0; j < 3; j++) {
			banco += camp_tabela[i][j];
			if (j < 2)
				 banco += ';';
			}
		banco += '\n';
		}
	banco += '\n';
	
	var templog = arquivolog.replace(/(\r\n|\n|\r)/gm,"xxx");
	var tempbanco = banco.replace(/(\r\n|\n|\r)/gm,"xxx");
	
	var arquivo = abrirAjax();
	arquivo.open("GET","checkpoint.php?pacote=" + templog + "&banco=" + tempbanco,true);
	arquivo.send();
	location.reload();
	});
	
function mascara(campo) {
	var valor = campo.value.match(/\d+/);
	campo.value = valor;
	}

$(document).on('click', '#falha', function(){
	location.reload();
	});
	
$(document).on('click', '#recovery', function(){
	var log = abrirAjax();
	log.open("GET", './dados/log.txt', false);
	log.send();
	var linha = log.responseText.toLowerCase().replace(/[^0-9a-z\n\,]/gm,"").split("\n");
	var redo = "";
	var undo = "";
	var dispensavel = "";
	var checkpoint = 0;
	
	for (var i = linha.length; i > 0; i--)
		if (linha[i-1].length) {
			var t = "0000" + linha[i-1].replace(/[^0-9]/gm,"");
			if (linha[i-1].includes("fim")) {
				if (checkpoint == 0)
					redo += t + "\n";
				else
					dispensavel += t + "\n";
				}
			else if ((linha[i-1].includes("incio")) && !(redo.includes(t)) && !(dispensavel.includes(t)))
				undo += t + "\n";
			else if (linha[i-1].includes("checkpoint"))
				checkpoint = 1;
			}

	// Undo

	if (undo) {
		for (var i = linha.length; i > 0; i--)
			if ((linha[i-1].length) && (linha[i-1].includes(","))) {
				var celula = linha[i-1].split(",");
				var t = "0000" + celula[0].replace(/[^0-9]/gm,"");
				var linhax = celula[2].replace(/[^0-9]/gm,"");
				var valor = celula[4].replace(/[^0-9]/gm,"");
				if (undo.includes(t))
					camp_tabela[linhax][2] = valor;
				}
		}

	// Redo

	if (redo) {
		for (i in linha)
			if (linha[i].includes(",")) {
				var celula = linha[i].split(",");
				var t = "0000" + celula[0].replace(/[^0-9]/gm,"");
				var linhax = celula[2].replace(/[^0-9]/gm,"");
				var valor = celula[5].replace(/[^0-9]/gm,"");
				if (redo.includes(t))
					camp_tabela[linhax][2] = valor;
				}
		}
		
	var banco = "";
	for (var i = 0; i <= 15; i++) {
		for (var j = 0; j < 3; j++) {
			banco += camp_tabela[i][j];
			if (j < 2)
				 banco += ';';
			}
		banco += '\n';
		}
	banco += '\n';
	
	var templog = arquivolog.replace(/(\r\n|\n|\r)/gm,"xxx");
	var tempbanco = banco.replace(/(\r\n|\n|\r)/gm,"xxx");
	
	var arquivo = abrirAjax();
	arquivo.open("GET","checkpoint.php?pacote=" + templog + "&banco=" + tempbanco,true);
	arquivo.send();

	if (undo) {
		$("#alerta").append("<h2>UNDO</h2>");
		$("#alerta").append(undo.replace(/(\r\n|\n|\r)/gm,"<br>"));
	}

	if (redo) {
		$("#alerta").append("<h2>REDO</h2>");
		$("#alerta").append(redo.replace(/(\r\n|\n|\r)/gm,"<br>"));
	}
	
	$("#dados").empty();
	bufferDados();
	mostraDados();
	});

function setExtra(x) {
	$.extra = x;
	}
	
function geraContainer(body){
	
	body.append("<div class='container-fluid' id='container-fluid'></div>");
	
	var container = $("#container-fluid");
	
	container.append("<div class='row' id='row'></div>");
	
	var row = $("#row");
	
	row.append("<div class='col-md-12' id='col-md-12'></div>");
	
	var col = $("#col-md-12");
	
	col.append("<div class='jumbotron' id='jumbotron'></div>");
	
	
	var jumbotron = $("#jumbotron");
	
	return jumbotron;
	
}

function geraCabecalho(body){
	
	body.append("<center><div id='cabecalho' class='jumbotron' class='thumbnail'></div></center>");
	
	var cabecalho = $("#cabecalho");
	
	cabecalho.append("<div id='transacoes'></div>");
	
	cabecalho.append("<div id='console'></div>");
	
	cabecalho.append("<div id='alerta'></div>");
	
	return cabecalho;
	
	
}

function geraControles(content){
	
	
	var controles = $("<div class='thumbnail' role='group'></div>");
	
	
	
	controles.append("<button id='checkpoint' class='btn btn-danger'>Checkpoint</button>");

	controles.append("<button id='reset' class='btn btn-default'>Reset</button>");

	controles.append("<button id='recovery' class='btn btn-default'>Recovery</button>");	

	controles.append("<button id='falha' class='btn btn-default'>Falha</button>");	

	content.append(controles);
	
	return content;
	
}

function geraLogs(data_row){
	

	
	data_row.append($("<div id='caixa_buffer_log'></div>"));
	
	$("#caixa_buffer_log").append("<h2>Buffer de Log");
	$("#caixa_buffer_log").append("<div id='buffer_log'></div>");

	data_row.append($("<div id='caixa_log'></div>"));
	
	$("#caixa_log").append("<h2>Arquivo de Log");
	$("#caixa_log").append("<div id='log'></div>");
	
	return data_row;
}

function geraDados(data_row){
	
	data_row.append("<div id='caixa_buffer_data'></div>");
	$("#caixa_buffer_data").append("<h2>Buffer de Dados</h2>");
	$("#caixa_buffer_data").append("<div id='buffer_data'></div>");

	data_row.append("<div id='caixa_dados'></div>");
	$("#caixa_dados").append("<h2>Arquivo de Dados</h2>");
	$("#caixa_dados").append("<div id='dados'></div>");
	
	
	return data_row;
}

$( document ).ready(function() {	
	
	// alert(JSON.stringify(camp_tabela));

	var campos;
	var x = 1;
	var body = $("body");
	
		$("title").append("Simulador");
		
		var cabecalho = geraCabecalho(body);
		
		var content  =	geraContainer(body);
		
		content.append("<center><div class='row' id='control_row'></div></center>");
		
		var control_row = $("#control_row");
		
		content = geraControles(control_row);
		
		content.append("<center><div class='thumbnail' id='data_row'></div></center>");
		
		var data_row = $("#data_row");
		
		data_row = geraLogs(data_row);
		
		data_row = geraDados(data_row);
		
	// Transações
	$("#transacoes").append("<h2>Transações</h2>");
	
	for (var i = 1; i <= 5; i++) {
		$("#transacoes").append("<form id='transacao_" + i + "'>" + i + " - UPDATE CIDADES SET POPULACAO = </form>");
		$("#transacao_" + i).append("<input id='n" + i + "'></input>");
		$("#transacao_" + i).append(" WHERE COD = ");
		$("#transacao_" + i).append("<select id='c" + i + "'></select>");
		for (var j = 1; j <= 3; j++) {
			$("#c" + i).append("; <option value='" + x + "'>" + x + "</option><br>");
			x++;
			}
		
		$("#transacao_" + i).append(" <input id='r" + i + "'> </input><input id='v" + i + "'></input><br><br>");
		
		var numero = $("#n" + i);
		numero.attr("type", "text");
		numero.attr("onkeyup", "mascara(this)");
		
		var registra = $("#r" + i);
		registra.attr("type", "Button");
		registra.attr("value", "Registra");
		registra.attr("onClick", "logBuffer(" + i + ")");
		registra.addClass("btn btn-success");
		
		var commita = $("#v" + i);
		commita.attr("type", "Button");
		commita.attr("value", "Commit");
		commita.attr("onClick", "logWriter(" + i + ")");
		commita.addClass("btn btn-danger");
		}

	
	mostraLog();
	mostraDados();
	bufferDados();
	});