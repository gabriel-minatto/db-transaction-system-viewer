<?php
	$arquivos = array(
		"./dados/bufferLog.txt",
		"./dados/log.txt",
		"./dados/bufferDad.csv"
		);

	foreach ($arquivos as $arquivo)
		if (file_exists($arquivo))
			unlink($arquivo);
	
	copy("./dados/cidades_bkp.csv", "./dados/cidades.csv");
	
	echo "Sistema Resetado";
?>

<!--  -->