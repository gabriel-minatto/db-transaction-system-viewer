	<?php
	$log = './dados/log.txt';
	$arquivo = './dados/bufferLog.txt';
	$f_dados = './dados/cidades.csv';
	$b_dados = './dados/bufferDad.csv';
    $transacao = $_GET['transacao'];
    $f_linha = $_GET['linha'];
    $f_valor = $_GET['valor'];
    $inicio = "<início T$transacao>\n";
	$registro = "";

	// Lote de Dados
	

	if (!file_exists($b_dados))
		copy($f_dados, $b_dados);
	
	$linha = [];
	$dados = file ($b_dados);
	foreach ($dados as $linhas) {
		$cel = explode(";", $linhas);
		array_push($linha, $cel[0] = [ 'pro' => $cel[1], 'val' => $cel[2] ]);
	}
	foreach ($linha as $indice => $linhas) {
		if ($indice == $f_linha) {
			$ba = str_replace("\r", "", str_replace("\n", "", $linha[$indice]['val']));
			$linha[$indice]['val'] = $f_valor . "\r\n";
		}
	}
	foreach ($linha as $indice => $linhas) {
		if ($indice == 0)
			$cod = 'cod';
		else
			$cod = $indice;
		$registro .= $cod  . ';' . $linha[$indice]['pro'] . ';' . $linha[$indice]['val'];
		}

	$escrita = fopen($b_dados, 'w');
	fwrite($escrita, $registro);
	fclose($escrita);
		
	// Registro no Buffer de Log
	
    $registro = "<T$transacao,Cidades,$f_linha,valor,$ba,$f_valor>\n";
	$base = "";
	
	if (file_exists($arquivo))
		$base .= file_get_contents($arquivo);
	if (file_exists($log))
		$base .= file_get_contents($log);
	
	if(!strpos($base, "início T$transacao"))
		$registro = $inicio . $registro;
		
	if (file_exists($arquivo))
		$registro = file_get_contents($arquivo) . $registro;
	
	$escrita = fopen($arquivo, 'w');
	fwrite($escrita, $registro);
	fclose($escrita);
	// $registro = str_replace("<", "&#60;", $registro);
	// $registro = str_replace("\n", "<br>", $registro);
	
	
    // echo $registro;
?>

<!--  -->