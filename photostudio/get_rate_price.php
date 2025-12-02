<?php
// Подключаемся к базе данных
$host = "localhost";
$dbname = "f1185782_photostudio";
$username = "f1185782_photostudio"; // или ваш пользователь MySQL
$password = "6dhibdRV"; // если есть пароль, укажите его

$conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Получаем ID тарифа из запроса
$rateId = $_GET['id'] ?? '';

// Проверяем, передан ли ID тарифа
if (!$rateId) {
    echo json_encode(['error' => 'ID тарифа не указан']);
    exit;
}

// Получаем цену тарифа по ID
$stmt = $conn->prepare("SELECT price FROM rates WHERE id = :id");
$stmt->execute(['id' => $rateId]);
$rate = $stmt->fetch(PDO::FETCH_ASSOC);

// Отправляем цену в формате JSON
header('Content-Type: application/json');
if ($rate) {
    echo json_encode(['price' => $rate['price']]);
} else {
    echo json_encode(['error' => 'Тариф не найден']);
}
?>