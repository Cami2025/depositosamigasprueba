<?php
// Conexión a SQLite
$db = new PDO("sqlite:montos.db");

// Exportar la tabla depositos
$depositos = $db->query("SELECT * FROM depositos")->fetchAll(PDO::FETCH_ASSOC);
file_put_contents("depositos.json", json_encode($depositos, JSON_PRETTY_PRINT));

// Exportar la tabla total
$total = $db->query("SELECT * FROM total")->fetchAll(PDO::FETCH_ASSOC);
file_put_contents("total.json", json_encode($total, JSON_PRETTY_PRINT));

echo "Datos exportados a JSON.";
?>
