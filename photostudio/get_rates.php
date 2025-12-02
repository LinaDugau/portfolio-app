<?php
// Подключаемся к базе данных
$host = "localhost";
$dbname = "f1185782_photostudio";
$username = "f1185782_photostudio"; // или ваш пользователь MySQL
$password = "6dhibdRV"; // если есть пароль, укажите его

$conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Получаем все тарифы из базы данных
$stmt = $conn->prepare("SELECT id, name FROM rates");
$stmt->execute();
$rates = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Отправляем тарифы в формате JSON
header('Content-Type: application/json');
echo json_encode($rates);
?>