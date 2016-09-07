<?php
    $pacote = $_GET['pacote'];
    $banco = $_GET['banco'];
	
	$pacote = str_replace("xxx", "\n", $pacote);
	$banco = str_replace("xxx", "\n", $banco);
		
	if ($pacote) {
		$escrita = fopen('./dados/log.txt', 'w');
		fwrite($escrita, $pacote);
		fclose($escrita);
	}
	
	if ($banco) {
		$escrita = fopen('./dados/cidades.csv', 'w');
		fwrite($escrita, $banco);
		fclose($banco);
	}

?>

<!--  -->