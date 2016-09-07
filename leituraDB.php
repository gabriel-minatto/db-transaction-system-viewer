<?php 
$linha = [];
$dados = file ('./dados/cidades.csv');
foreach ($dados as $linhas) {
	$cel = explode(";", $linhas);
	array_push($linha, $cel[0] = [ 'cod' => $cel[0], 'pro' => $cel[1], 'val' => $cel[2] ]);
}

echo $linha[5]['pro'];
?>
