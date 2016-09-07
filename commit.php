<?php
    $pacote = $_GET['pacote'];
	$pacote = str_replace("xxx", "\n", $pacote);
		
	if ($pacote) {
		$escrita = fopen('./dados/log.txt', 'w');
		fwrite($escrita, $pacote);
		fclose($escrita);
	}

?>

<!--  -->