<?php
// Conexión a SQLite
$db = new PDO("sqlite:montos.db");

// Obtener datos del historial
$result = $db->query("SELECT nombre, monto FROM depositos");
$depositos = $result->fetchAll(PDO::FETCH_ASSOC);

// Obtener el monto total
$result = $db->query("SELECT monto_total FROM total");
$total = $result->fetch(PDO::FETCH_ASSOC)['monto_total'];

// Enviar datos al frontend
echo json_encode(["depositos" => $depositos, "total" => $total]);
?>
