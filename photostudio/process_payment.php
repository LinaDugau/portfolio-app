<?php
// Подключение к базе данных
$host = 'localhost';  // Укажи свои данные для подключения
$dbname = 'f1185782_photostudio';
$username = 'f1185782_photostudio';
$password = '6dhibdRV'; // Введите пароль, если он есть

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Не удалось подключиться к базе данных: " . $e->getMessage());
}

// Получаем данные из формы
$booking_id = $_POST['booking_id'];
$card_number = $_POST['card_number'];
$expiry = $_POST['expiry'];
$cvv = $_POST['cvv'];

// Вставляем данные в таблицу payments
try {
    $sql = "INSERT INTO payments (booking_id, card_number, expiry, cvv) 
            VALUES (:booking_id, :card_number, :expiry, :cvv)";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':booking_id', $booking_id, PDO::PARAM_INT);
    $stmt->bindParam(':card_number', $card_number, PDO::PARAM_STR);
    $stmt->bindParam(':expiry', $expiry, PDO::PARAM_STR);
    $stmt->bindParam(':cvv', $cvv, PDO::PARAM_STR);

    $stmt->execute();

    // Перенаправляем на страницу успешной оплаты
    header("Location: thanks.html"); // Страница успеха после успешной оплаты
    exit();

} catch (PDOException $e) {
    die("Ошибка при обработке платежа: " . $e->getMessage());
}
?>