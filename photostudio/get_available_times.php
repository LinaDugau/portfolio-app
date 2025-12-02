<?php
// Подключение к БД
$host = "localhost";
$dbname = "f1185782_photostudio";
$username = "f1185782_photostudio"; // Замените на свой логин MySQL
$password = "6dhibdRV"; // Замените на свой пароль, если он есть

$conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Получаем дату из запроса
$date = $_GET['date'] ?? '';

if (!$date) {
    echo json_encode([]); // Если нет даты, возвращаем пустой массив
    exit;
}

// Получаем все занятые ID временных слотов
$stmt = $conn->prepare("SELECT time_slot_id FROM bookings WHERE date = :date");
$stmt->execute(['date' => $date]);
$booked_slots = $stmt->fetchAll(PDO::FETCH_COLUMN);

// Формируем запрос на свободные временные слоты
if (!empty($booked_slots)) {
    // Если есть забронированные слоты — исключаем их
    $placeholders = implode(',', array_fill(0, count($booked_slots), '?'));
    $query = "SELECT * FROM time_slots WHERE id NOT IN ($placeholders)";
    $stmt = $conn->prepare($query);
    $stmt->execute($booked_slots);
} else {
    // Если броней нет, выводим все слоты
    $stmt = $conn->query("SELECT * FROM time_slots");
}

$available_slots = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Отправляем JSON-ответ
header('Content-Type: application/json');
echo json_encode($available_slots);
?>