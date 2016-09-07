var camp_tabela = new Array(16);
for (var i = 0; i < camp_tabela.length; i++)
	camp_tabela[i] = new Array(3);

var bufferLog = "";
var arquivolog = "";

function abrirAjax() {
    var ajax;
    if(window.XMLHttpRequest)
        ajax = new XMLHttpRequest();
    else if (window.ActiveXObject)
    	ajax = new ActiveXObject("Microsoft.XMLHTTP");
    else
        alert("Nao rola nesse browser...");
	return ajax;
	}

function resetar() {
	var arquivo = abrirAjax();
	arquivo.open("GET","reset.php",true);
	arquivo.send();
	bufferLog = "";
	arquivolog = "";
	
	var campo = ["log", "buffer_log", "buffer_data", "dados"]
	for (x in campo)
		while (document.getElementById(campo[x]).hasChildNodes()) 
			document.getElementById(campo[x]).removeChild(document.getElementById(campo[x]).firstChild);
	for (var i = 1; i <= 5; i++)
		document.getElementById("transacao_" + i).setAttribute("class", "ver");
	location.reload();
	}

function logBuffer(termo) {
	var inicio = "início T" + termo
	var linha = document.getElementById("c" + termo).value;
	var valor_anterior = camp_tabela[linha][2];
	var valor_atual = document.getElementById("n" + termo).value;
	if (valor_atual) {
		camp_tabela[linha][2] = valor_atual;
		
		if (!bufferLog.includes(inicio) && !arquivolog.includes(inicio))
			bufferLog += "<início T" + termo + ">\n";
		
		bufferLog += "<T" + termo + ", Cidades, " + linha + ", valor, " + valor_anterior + ", " + valor_atual + ">\n";
		document.getElementById("transacao_" + termo).reset();
		mostraBufferLog();
		bufferDados();
		}
    }

	// ############################################ COMITT
	
function logWriter(termo) {
	if ((arquivolog.search("início T" + termo) > 0) || (bufferLog.search("início T" + termo) > 0)) {
		arquivolog += bufferLog;
		arquivolog += "<fim T" + termo + ">\n";
		document.getElementById("transacao_" + termo).setAttribute("class", "naover");
		bufferLog = "";

		var temp = arquivolog.replace(/(\r\n|\n|\r)/gm,"xxx");
		var arquivo = abrirAjax();
		arquivo.open("GET","commit.php?pacote=" + temp,true);
		arquivo.send();

		while (document.getElementById("buffer_log").hasChildNodes()) 
				document.getElementById("buffer_log").removeChild(document.getElementById("buffer_log").firstChild);
		while (document.getElementById("log").hasChildNodes()) 
				document.getElementById("log").removeChild(document.getElementById("log").firstChild);
		document.getElementById("log").appendChild(mCriar("h2", "", "", "Arquivo de Log"));	
		var linha = arquivolog.split("\n");
		for (var i = 0; i < linha.length; i++) {
			document.getElementById("log").appendChild(document.createTextNode(linha[i]));
			document.getElementById("log").appendChild(mCriar("br", "", "", ""));	
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
		while (document.getElementById("buffer_log").hasChildNodes()) 
			document.getElementById("buffer_log").removeChild(document.getElementById("buffer_log").firstChild);
		document.getElementById("buffer_log").appendChild(mCriar("h2", "", "", "Buffer de Log"));
		var linha = bufferLog.split("\n");
		for (var i = 0; i < linha.length; i++) {
			document.getElementById("buffer_log").appendChild(document.createTextNode(linha[i]));
			document.getElementById("buffer_log").appendChild(mCriar("br", "", "", ""));
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
				document.getElementById("log").appendChild(mCriar("h2", "", "", "Arquivo de Log"));
				var linha = log.responseText.split("\n");
				for (var i = 0; i < linha.length; i++) {
					document.getElementById("log").appendChild(document.createTextNode(linha[i]));
					document.getElementById("log").appendChild(mCriar("br", "", "", ""));
					if (linha[i].includes("fim"))
						document.getElementById("transacao_" + linha[i].substring(6,7)).setAttribute("class", "naover");
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
				document.getElementById("dados").appendChild(mCriar("h2", "", "", "Arquivo de dados"));
				document.getElementById("dados").appendChild(mCriar("table", "id", "tabela_dados", ""));
				
				var linha = dados.responseText.split("\n");
				for (var i = 0; i < linha.length; i++) {
					document.getElementById("tabela_dados").appendChild(mCriar("tr", "id", "dados_linha" + [i], ""));
					var celula = linha[i].split(";");
						for (var j = 0; j < celula.length; j++) {
							if (celula[j].replace(/(\r\n|\n|\r)/gm,"")) {
								document.getElementById("dados_linha" + i).appendChild(mCriar("td", "", "", celula[j].replace(/(\r\n|\n|\r)/gm,"")));
								camp_tabela[i][j] = celula[j].replace(/(\r\n|\n|\r)/gm,"");
								}
							}
					}
				}
			}
		dados.send(null);
	}

function bufferDados() {
	while (document.getElementById("buffer_data").hasChildNodes()) 
		document.getElementById("buffer_data").removeChild(document.getElementById("buffer_data").firstChild);
	document.getElementById("buffer_data").appendChild(mCriar("h2", "", "", "Buffer de Dados"));
	
	for (var i = 0; i <= 15; i++) {
		document.getElementById("buffer_data").appendChild(mCriar("tr", "id", "buffer_dados_linha" + i, ""));
		for (var j = 0; j < 3; j++)
			document.getElementById("buffer_dados_linha" + i).appendChild(mCriar("td", "id", "buffer_campo_dados_" + i + j, camp_tabela[i][j]));
		}
	}

function checkpoint() {
	arquivolog += bufferLog + "Checkpoint \n";
	bufferLog = "";

	while (document.getElementById("buffer_log").hasChildNodes()) 
			document.getElementById("buffer_log").removeChild(document.getElementById("buffer_log").firstChild);
	while (document.getElementById("log").hasChildNodes()) 
			document.getElementById("log").removeChild(document.getElementById("log").firstChild);
	document.getElementById("log").appendChild(mCriar("h2", "", "", "Arquivo de Log"));	
	var linha = arquivolog.split("\n");
	for (var i = 0; i < linha.length; i++) {
		document.getElementById("log").appendChild(document.createTextNode(linha[i]));
		document.getElementById("log").appendChild(mCriar("br", "", "", ""));	
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
	}

function mascara(campo) {
	var valor = campo.value.match(/\d+/);
	campo.value = valor;
	}

function recovery() {
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
	location.reload();
	
	if (undo) {
		document.getElementById("alerta").appendChild(mCriar("h2", "", "", "UNDO"));
		document.getElementById("alerta").appendChild(document.createTextNode(undo.replace(/(\r\n|\n|\r)/gm,"<br>")));
	}
	
	if (redo) {
		document.getElementById("alerta").appendChild(mCriar("h2", "", "", "REDO"));
		document.getElementById("alerta").appendChild(document.createTextNode(redo.replace(/(\r\n|\n|\r)/gm,"<br>")));
	}
	
	// alert("UNDO \n" + undo);
	alert("REDO \n" + redo);
	
	// bufferDados();
	}

function abertura() {
	// alert(JSON.stringify(camp_tabela));

	var campos;
	var x = 1;

	// Transações
	document.getElementById("transacoes").appendChild(mCriar("h2", "", "", "Transações"));
	
	for (var i = 1; i <= 5; i++) {
		document.getElementById("transacoes").appendChild(mCriar("form", "id", "transacao_" + i, i + " - UPDATE CIDADES SET POPULACAO = "));
		document.getElementById("transacao_" + i).appendChild(mCriar("input", "id", "n" + i, ""));
		document.getElementById("transacao_" + i).appendChild(document.createTextNode(" WHERE COD = "));
		document.getElementById("transacao_" + i).appendChild(mCriar("select", "id", "c" + i, ""));
		for (var j = 1; j <= 3; j++) {
			document.getElementById("c" + i).appendChild(mCriar("option", "value", x, x));
			x++;
			}
		
		document.getElementById("transacao_" + i).appendChild(document.createTextNode("; "));
		document.getElementById("transacao_" + i).appendChild(mCriar("input", "id", "r" + i, ""));
		document.getElementById("transacao_" + i).appendChild(mCriar("input", "id", "v" + i, ""));
		
		document.getElementById("n" + i).setAttribute("type", "text");
		document.getElementById("n" + i).setAttribute("onkeyup", "mascara(this)");
		document.getElementById("r" + i).setAttribute("type", "Button");
		document.getElementById("r" + i).setAttribute("value", "Registra");
		document.getElementById("r" + i).setAttribute("onClick", "logBuffer(" + i + ")");
		document.getElementById("v" + i).setAttribute("type", "Button");
		document.getElementById("v" + i).setAttribute("value", "Commit");
		document.getElementById("v" + i).setAttribute("onClick", "logWriter(" + i + ")");
		}

	document.getElementById("transacoes").appendChild(mCriar("input", "id", "checkpoint", ""));
	document.getElementById("transacoes").appendChild(mCriar("br", "", "", ""));
	document.getElementById("transacoes").appendChild(mCriar("input", "id", "reset", ""));
	document.getElementById("transacoes").appendChild(mCriar("br", "", "", ""));
	document.getElementById("transacoes").appendChild(mCriar("input", "id", "recovery", ""));
	document.getElementById("transacoes").appendChild(mCriar("br", "", "", ""));

	document.getElementById("checkpoint").setAttribute("type", "button");
	document.getElementById("checkpoint").setAttribute("value", "checkpoint");
	document.getElementById("checkpoint").setAttribute("onClick", "checkpoint()");
	document.getElementById("reset").setAttribute("type", "button");
	document.getElementById("reset").setAttribute("value", "reset");
	document.getElementById("reset").setAttribute("onClick", "resetar()");
	document.getElementById("recovery").setAttribute("type", "button");
	document.getElementById("recovery").setAttribute("value", "Recovery");
	document.getElementById("recovery").setAttribute("onClick", "recovery()");

	// Arquivo de Log
	mostraLog();

	// Arquivo de Dados
	mostraDados();
	
	// // Buffer de Log
	// mostraBufferLog();
	
	bufferDados();
	
	}
	
	
	