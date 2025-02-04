<?php
require 'vendor/autoload.php';

use Kreait\Firebase\Factory;

// Configura Firebase
$factory = (new Factory)
    ->withServiceAccount('firebase-credentials.json') // Asegúrate de subir tu archivo JSON de credenciales de Firebase
    ->withDatabaseUri('https://fiestasamigas.firebaseio.com/');

$database = $factory->createFirestore();
$firestore = $database->database();

// Obtener datos enviados desde el frontend
$nombre = $_POST['nombre'] ?? 'Desconocido';
$monto = (float) ($_POST['monto'] ?? 0);

// Guardar en Firebase Firestore
$depositoRef = $firestore->collection('depositos')->add([
    'nombre' => $nombre,
    'monto' => $monto,
    'fecha' => date('Y-m-d H:i:s')
]);

echo json_encode(["success" => true, "message" => "Depósito guardado en Firebase"]);
?>